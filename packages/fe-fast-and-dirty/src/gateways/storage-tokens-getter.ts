import { Tokens, TokensParser } from "../domains/tokens";
import { ITokensGetter } from "../ports/tokens-getter";

export class StorageTokensGetter implements ITokensGetter {
  private storage: string;

  public constructor(storage: string) {
    this.storage = storage;
  }

  private authenticatedValidator(): void {
    if (localStorage.getItem(this.storage) === null) {
      throw Error("not authenticated yet");
    }
  }

  public async getToken(): Promise<string> {
    const tokens = await this.getTokens();
    return tokens.token;
  }

  public async getTokens(): Promise<Tokens> {
    this.authenticatedValidator();
    return TokensParser.parse(JSON.parse(localStorage.getItem(this.storage)));
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
