import { Tokens } from "../domains/tokens";
import { ITokensGetter } from "../ports/tokens-getter";

export class MemoryTokensGetter implements ITokensGetter {
  private storage: Tokens[];

  public constructor(storage: Tokens[]) {
    this.storage = storage;
  }

  private authenticatedValidator(): void {
    if (this.storage.length === 0) {
      throw Error("not authenticated yet");
    }
  }

  public async getToken(): Promise<string> {
    this.authenticatedValidator();
    return this.storage[0].token;
  }

  public async getTokens(): Promise<Tokens> {
    this.authenticatedValidator();
    return this.storage[0];
  }

  public async hasTokens(): Promise<boolean> {
    try {
      this.authenticatedValidator();
      return true;
    } catch {
      return false;
    }
  }
}
