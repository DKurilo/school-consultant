import { ICheckIfAuthenticated } from "../ports/check-if-authenticated";
import { ITokensGetter } from "../ports/tokens-getter";

export class CheckIfAuthenticated implements ICheckIfAuthenticated {
  private tokenGetter: ITokensGetter;
  public constructor(tokenGetter: ITokensGetter) {
    this.tokenGetter = tokenGetter;
  }

  public async check(): Promise<boolean> {
    return this.tokenGetter.hasTokens();
  }
}
