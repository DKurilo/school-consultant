export interface IDataActivator {
  getActivePrefix: () => string;
  activate: (prefix: string) => Promise<[string, Promise<void>]>;
}
