import fs from "node:fs/promises";
import { SchoolInfo } from "../domains/school-info";
import { IMapPreserver } from "../ports/map-preserver";
import { SpreadsheetRow } from "../domains/spreadsheet";

export class FsMapPreserver implements IMapPreserver {
  private mapPath: string;

  public constructor(mapPath: string) {
    this.mapPath = mapPath;
  }

  public async preserve(
    schools: (SpreadsheetRow | SchoolInfo)[],
  ): Promise<void> {
    const data = schools.reduce<Record<string, string>>((o, school) => {
      Object.assign(o, { [school.name]: school.dbn });
      return o;
    }, {});
    await fs.writeFile(this.mapPath, JSON.stringify(data));
  }
}
