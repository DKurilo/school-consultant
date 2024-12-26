import { IApp } from "../ports/app";
import { IExportSchools } from "../ports/export-schools";

export class Console implements IApp {
  private exportSchoolsUsecase: IExportSchools;

  public constructor(exportSchoolsUsecase: IExportSchools) {
    this.exportSchoolsUsecase = exportSchoolsUsecase;
  }

  public async run() {
    const doNotLoadData: boolean = process.argv.includes("--no-load")
    await this.exportSchoolsUsecase.execute(doNotLoadData);
  }
}
