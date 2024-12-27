import { IApp } from "../ports/app";
import { IExportSchools } from "../ports/export-schools";

export class Console implements IApp {
  private exportSchoolsUsecase: IExportSchools;
  private transformExportSchoolsUsecase: IExportSchools;

  public constructor(
    exportSchoolsUsecase: IExportSchools,
    transformExportSchoolsUsecase: IExportSchools,
  ) {
    this.exportSchoolsUsecase = exportSchoolsUsecase;
    this.transformExportSchoolsUsecase = transformExportSchoolsUsecase;
  }

  public async run() {
    const transformData: boolean = process.argv.includes("--transform");
    const doNotLoadData: boolean = process.argv.includes("--no-load");
    if (transformData) {
      await this.transformExportSchoolsUsecase.execute(doNotLoadData);
      return;
    }
    await this.exportSchoolsUsecase.execute(doNotLoadData);
  }
}
