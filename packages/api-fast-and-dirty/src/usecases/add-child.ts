import { IUserGetter } from "../ports/user-getter";
import { ILogger } from "../ports/logger";
import { ITokenChecker } from "../ports/token-checker";
import { Token } from "@school-consultant/common";
import { IAddChild } from "../ports/add-child";
import { IUserPreserver } from "../ports/user-preserver";

export class AddChild implements IAddChild {
  private logger: ILogger;
  private tokenChecker: ITokenChecker;
  private userGetter: IUserGetter;
  private userPreservr: IUserPreserver;

  public constructor(
    logger: ILogger,
    tokenChecker: ITokenChecker,
    userGetter: IUserGetter,
    userPreservr: IUserPreserver,
  ) {
    this.logger = logger;
    this.tokenChecker = tokenChecker;
    this.userGetter = userGetter;
    this.userPreservr = userPreservr;
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

  public async execute(token: string, name: string): Promise<void | "no access" | "user not found" | "child already exists"> {
    const tokenContent = await this.getTokenContent(token);

    if (tokenContent === undefined) {
      return "no access"
    }

    const user = await this.userGetter.getUser(tokenContent.email);
    if (user === undefined) {
      return "user not found";
    }
    if (name in user.children) {
      return "child already exists";
    }
    user.children[name] = { name, recommendations: [] };
    await this.userPreservr.preserveUser(user);
  }
}
