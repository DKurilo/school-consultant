export interface IExportSchools {
  execute: (doNotLoadData: boolean) => Promise<void>;
}
