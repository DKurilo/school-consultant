import { Tokens } from "../domains/tokens";

export interface ITokensPreserver {
  preserveTokens: (tokens: Tokens | undefined) => Promise<void>;
}
