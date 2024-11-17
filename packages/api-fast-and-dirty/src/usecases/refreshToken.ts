import { ILogger } from "../ports/logger";
import { IUserGetter } from "../ports/user-getter";
import { ITokenGenerator } from "../ports/token-generator";
import { IUserPreserver } from "../ports/user-preserver";
import { IRefreshToken } from "../ports/refresh-token";
import { ITokenChecker } from "../ports/token-checker";
import { Token } from "@school-consultant/common/src/domains/token";

export class RefreshToken implements IRefreshToken {
  private logger: ILogger;
  private userGetter: IUserGetter;
  private userPreserver: IUserPreserver;
  private tokenChecker: ITokenChecker;
  private tokenGenerator: ITokenGenerator;

  public constructor(
    logger: ILogger,
    userGetter: IUserGetter,
    userPreserver: IUserPreserver,
    tokenGenerator: ITokenGenerator,
    tokenChecker: ITokenChecker,
  ) {
    this.logger = logger;
    this.userGetter = userGetter;
    this.userPreserver = userPreserver;
    this.tokenGenerator = tokenGenerator;
    this.tokenChecker = tokenChecker;
  }

  private async getTokenContent(token: string): Promise<Token | undefined> {
    try {
      const tokenContent = await this.tokenChecker.verify(token);
      return tokenContent;
    } catch (e) {
      this.logger.debug(
        `Token is invalid while refreshing token for token ${token} error: ${e}`,
      );
      return undefined;
    }
  }

  public async execute(
    token: string,
    refreshToken: string,
  ): Promise<[string, string] | undefined> {
    const tokenContent = await this.getTokenContent(token);
    if (tokenContent === undefined) {
      return undefined;
    }
    const email = tokenContent.email;
    const user = await this.userGetter.getUser(email);
    if (user === undefined) {
      return undefined;
    }
    if (refreshToken === user.refreshToken) {
      const token = await this.tokenGenerator.generateToken(user.email);
      const refreshToken = await this.tokenGenerator.generateRefreshToken();
      this.userPreserver.preserveUser({ ...user, refreshToken });
      return [token, refreshToken];
    }
    this.logger.warn(`Bad attempt to refresh token for ${email}`);
    return undefined;
  }
}
