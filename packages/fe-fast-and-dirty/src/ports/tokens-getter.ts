import { Tokens } from "../domains/tokens";

export interface ITokensGetter {
  getToken: () => Promise<string>;
  getTokens: () => Promise<Tokens>;
  hasTokens: () => Promise<boolean>;
}
