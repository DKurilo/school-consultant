import { SchoolInfo, schoolInfoToSpreadsheetRow } from "../domains/school-info";
import { IDataActivator } from "../ports/data-activator";
import { IDataLoader } from "../ports/data-loader";
import { IExportSchools } from "../ports/export-schools";
import { ISchoolGetter } from "../ports/school-getter";
import { ISchoolPreserver } from "../ports/school-preserver";
import { ISpreadsheetPreserver } from "../ports/spreadsheet-preserver";
import { SpreadsheetRow } from "../domains/spreadsheet";
import { generateName } from "../utils/random-name-generator";
import { IMapPreserver } from "../ports/map-preserver";

export type ExportSchoolsOption = {
  linkPrefix: string;
  threeKDataLoader: IDataLoader;
  preKDataLoader: IDataLoader;
  kDataLoader: IDataLoader;
  schoolPreserver: ISchoolPreserver;
  dataActivator: IDataActivator;
  schoolGetter: ISchoolGetter;
  spreadsheetPreserver: ISpreadsheetPreserver;
  mapPreserver: IMapPreserver;
};

const buildGradesDescription = (oldDescr: string, newDescr: string): string => {
  if (oldDescr === newDescr || oldDescr.includes(newDescr)) {
    return oldDescr;
  }
  if (oldDescr === "") {
    return newDescr;
  }
  if (newDescr === "") {
    return oldDescr;
  }
  return `${oldDescr}, ${newDescr}`;
}

export class ExportSchools implements IExportSchools {
  private linkPrefix: string;
  private threeKDataLoader: IDataLoader;
  private preKDataLoader: IDataLoader;
  private kDataLoader: IDataLoader;
  private schoolPreserver: ISchoolPreserver;
  private dataActivator: IDataActivator;
  private schoolGetter: ISchoolGetter;
  private spreadsheetPreserver: ISpreadsheetPreserver;
  private mapPreserver: IMapPreserver;

  public constructor(options: ExportSchoolsOption) {
    this.linkPrefix = options.linkPrefix;
    this.threeKDataLoader = options.threeKDataLoader;
    this.preKDataLoader = options.preKDataLoader;
    this.kDataLoader = options.kDataLoader;
    this.schoolPreserver = options.schoolPreserver;
    this.dataActivator = options.dataActivator;
    this.schoolGetter = options.schoolGetter;
    this.spreadsheetPreserver = options.spreadsheetPreserver;
    this.mapPreserver = options.mapPreserver;
  }

  private async loadPartialSchool(
    loader: IDataLoader,
    key: "threeK" | "preK" | "k",
    prefix: string,
  ): Promise<void> {
    for await (const school of loader.load()) {
      const existingSchool = await this.schoolGetter.load(prefix, school.dbn);
      if (existingSchool === undefined) {
        const schoolInfo: SchoolInfo = {
          borough: school.borough,
          zone: school.zone,
          name: school.name,
          gradesDescription: school.gradesDescription,
          dbn: school.dbn,
          address: school.address,
          latitude: school.latitude,
          longitude: school.longitude,
          email: school.email,
          phone: school.phone,
          website: school.website,
          uniform: school.uniform,
          [key]: school.raw,
        };
        await this.schoolPreserver.preserve(prefix, schoolInfo);
      } else {
        const gradesDescription = buildGradesDescription(school.gradesDescription, existingSchool.gradesDescription);
        await this.schoolPreserver.preserve(prefix, {
          ...existingSchool,
          gradesDescription,
          address: existingSchool.address ?? school.address,
          latitude: existingSchool.latitude ?? school.latitude,
          longitude: existingSchool.longitude ?? school.longitude,
          email: existingSchool.email ?? school.email,
          phone: existingSchool.phone ?? school.phone,
          website: existingSchool.website ?? school.website,
          uniform:
            existingSchool.uniform === undefined
              ? school.uniform
              : existingSchool.uniform,
          [key]: school.raw,
        });
      }
    }
  }

  private async buildSpreadsheetRow(
    prefix: string,
    dbn: string,
  ): Promise<SpreadsheetRow | undefined> {
    const schoolInfo = await this.schoolGetter.load(prefix, dbn);
    if (schoolInfo === undefined) {
      return undefined;
    }
    return schoolInfoToSpreadsheetRow(schoolInfo, this.linkPrefix);
  }

  private async loadData(
    doNotLoadData: boolean,
  ): Promise<[string, Promise<void>]> {
    if (doNotLoadData) {
      return [this.dataActivator.getActivePrefix(), Promise.resolve()];
    }
    const tempPrefix = await generateName();
    await this.loadPartialSchool(this.threeKDataLoader, "threeK", tempPrefix);
    await this.loadPartialSchool(this.preKDataLoader, "preK", tempPrefix);
    await this.loadPartialSchool(this.kDataLoader, "k", tempPrefix);
    const [prefix, postProcess] = await this.dataActivator.activate(tempPrefix);
    return [prefix, postProcess];
  }

  public async execute(doNotLoadData: boolean) {
    const [prefix, postProcess] = await this.loadData(doNotLoadData);
    const spreadsheetDataPromises: Promise<SpreadsheetRow | undefined>[] = [];
    for await (const dbn of this.schoolGetter.list(prefix)) {
      spreadsheetDataPromises.push(this.buildSpreadsheetRow(prefix, dbn));
    }
    const spreadsheetData: SpreadsheetRow[] = (
      await Promise.all(spreadsheetDataPromises)
    ).filter((x) => x !== undefined);
    spreadsheetData.sort((a, b) => {
      if (a.borough === b.borough) {
        if (a.zone === b.zone) {
          if (a.name === b.name) {
            return 0;
          }
          return a.name > b.name ? 1 : -1;
        }
        return a.zone > b.zone ? 1 : -1;
      }
      return a.borough > b.borough ? 1 : -1;
    });
    await Promise.all([
      this.spreadsheetPreserver.preserve(spreadsheetData),
      this.mapPreserver.preserve(spreadsheetData),
      postProcess,
    ]);
  }
}
