export interface IAuthenticate {
  execute: (email: string, password: string) => Promise<boolean>;
}
