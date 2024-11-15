export interface ITokenGenerator {
  generateToken: (email: string) => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}
