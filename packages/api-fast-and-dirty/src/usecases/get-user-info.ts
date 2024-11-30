import { UserResponse, userToUserResponse } from "@school-consultant/common";
import { IGetUser } from "../ports/get-user";
import { IUserGetter } from "../ports/user-getter";
import { ILogger } from "../ports/logger";
import { ITokenChecker } from "../ports/token-checker";
import { Token } from "@school-consultant/common/src/domains/token";

export class GetUserInfo implements IGetUser {
  private logger: ILogger;
  private tokenChecker: ITokenChecker;
  private userGetter: IUserGetter;

  public constructor(
    logger: ILogger,
    tokenChecker: ITokenChecker,
    userGetter: IUserGetter,
  ) {
    this.logger = logger;
    this.tokenChecker = tokenChecker;
    this.userGetter = userGetter;
  }

  private async getTokenContent(token: string): Promise<Token | undefined> {
    try {
      const tokenContent = await this.tokenChecker.verify(token);
      return tokenContent;
    } catch (e) {
      this.logger.debug(
        `Token is invalid while geting user for token ${token} error: ${e}`,
      );
      return undefined;
    }
  }

  public async execute(
    token: string,
  ): Promise<UserResponse | "not found" | "no access"> {
    const tokenContent = await this.getTokenContent(token);

    if (tokenContent === undefined) {
      return "no access";
    }

    const user = await this.userGetter.getUser(tokenContent.email);
    if (user === undefined) {
      return "not found";
    }
    return userToUserResponse(user);
  }
}
