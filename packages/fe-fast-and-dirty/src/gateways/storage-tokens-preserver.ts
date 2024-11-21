import { Tokens } from "../domains/tokens";
import { ITokensPreserver } from "../ports/tokens-preserver";

export class StorageTokensPreserver implements ITokensPreserver {
  private storage: string;

  public constructor(storage: string) {
    this.storage = storage;
  }

  public async preserveTokens(tokens: Tokens | undefined): Promise<void> {
    if (tokens) {
      localStorage.setItem(this.storage, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(this.storage);
    }
  }
}
