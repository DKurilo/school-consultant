import { Tokens } from "../domains/tokens";
import { ITokensPreserver } from "../ports/tokens-preserver";

export class MemoryTokensPreserver implements ITokensPreserver {
  private storage: Tokens[];

  public constructor(storage: Tokens[]) {
    this.storage = storage;
  }

  public async preserveTokens(tokens: Tokens | undefined): Promise<void> {
    if (tokens) {
      this.storage.push(tokens);
      if (this.storage.length > 1) {
        this.storage.shift();
      }
    } else {
      this.storage.length = 0;
    }
  }
}
