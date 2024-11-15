import { IAuthenticate } from "../ports/authenticate";
import { IAuthenticator } from "../ports/authenticator";
import { ITokensPreserver } from "../ports/tokens-preserver";

export class Authenticate implements IAuthenticate {
  private authenticator: IAuthenticator;
  private tokensPreserver: ITokensPreserver;
  public constructor(
    authenticator: IAuthenticator,
    tokensPreserver: ITokensPreserver,
  ) {
    this.authenticator = authenticator;
    this.tokensPreserver = tokensPreserver;
  }

  public async execute(email: string, password: string): Promise<boolean> {
    try {
      const tokens = await this.authenticator.authenticate(email, password);
      await this.tokensPreserver.preserveTokens(tokens);
      return true;
    } catch {
      return false;
    }
  }
}
