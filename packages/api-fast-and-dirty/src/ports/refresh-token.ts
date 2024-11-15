export interface IRefreshToken {
  execute: (
    token: string,
    refreshToken: string,
  ) => Promise<[string, string] | undefined>;
}
