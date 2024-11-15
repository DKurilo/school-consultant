export interface ILogin {
  execute: (
    email: string,
    password: string,
  ) => Promise<[string, string] | undefined>;
}
