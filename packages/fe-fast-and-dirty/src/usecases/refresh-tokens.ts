import { Tokens } from "../domains/tokens";
import { IRefreshTokens } from "../ports/refresh-tokens";
import { ITokensGetter } from "../ports/tokens-getter";
import { ITokensPreserver } from "../ports/tokens-preserver";
import { ITokensRefresher } from "../ports/tokens-refresher";

export class RefreshTokens implements IRefreshTokens {
  private tokensGetter: ITokensGetter;
  private tokensRefresher: ITokensRefresher;
  private tokensPreserver: ITokensPreserver;
  public constructor(
    tokensGetter: ITokensGetter,
    tokensRefresher: ITokensRefresher,
    tokensPreserver: ITokensPreserver,
  ) {
    this.tokensGetter = tokensGetter;
    this.tokensRefresher = tokensRefresher;
    this.tokensPreserver = tokensPreserver;
  }

  private async tryGetTokens(): Promise<Tokens | undefined> {
    try {
      const tokens = await this.tokensGetter.getTokens();
      return tokens;
    } catch {
      return undefined;
    }
  }

  private async tryGetNewTokens(
    oldTokens: Tokens,
  ): Promise<Tokens | undefined> {
    try {
      const tokens = await this.tokensRefresher.refresh(oldTokens);
      return tokens;
    } catch {
      return undefined;
    }
  }

  public async execute(): Promise<void> {
    const oldTokens = await this.tryGetTokens();
    if (oldTokens === undefined) {
      return;
    }
    const newTokens = await this.tryGetNewTokens(oldTokens);
    await this.tokensPreserver.preserveTokens(newTokens);
  }
}
