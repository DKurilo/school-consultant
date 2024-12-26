export interface IDataActivator {
  activate: (prefix: string) => Promise<[string, Promise<void>]>;
}
