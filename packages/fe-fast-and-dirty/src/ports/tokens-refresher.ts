import { Tokens } from "../domains/tokens";

export interface ITokensRefresher {
  refresh: (oldTokens: Tokens) => Promise<Tokens>;
}
