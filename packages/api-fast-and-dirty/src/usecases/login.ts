import { promisify } from "node:util";
import { pbkdf2 } from "node:crypto";
import { ILogin } from "../ports/login";
import { ILogger } from "../ports/logger";
import { IUserGetter } from "../ports/user-getter";
import { ITokenGenerator } from "../ports/token-generator";
import { IUserPreserver } from "../ports/user-preserver";

const asyncPbkf2 = promisify(pbkdf2);

export class Login implements ILogin {
  private logger: ILogger;
  private userGetter: IUserGetter;
  private userPreserver: IUserPreserver;
  private tokenGenerator: ITokenGenerator;

  public constructor(
    logger: ILogger,
    userGetter: IUserGetter,
    userPreserver: IUserPreserver,
    tokenGenerator: ITokenGenerator,
  ) {
    this.logger = logger;
    this.userGetter = userGetter;
    this.userPreserver = userPreserver;
    this.tokenGenerator = tokenGenerator;
  }

  public async execute(
    email: string,
    password: string,
  ): Promise<[string, string] | undefined> {
    const user = await this.userGetter.getUser(email);
    if (user === undefined) {
      return undefined;
    }
    const hash = await asyncPbkf2(
      password,
      user.passSalt,
      10000,
      128,
      "sha512",
    );
    if (hash.toString("hex") === user.passHash) {
      const token = await this.tokenGenerator.generateToken(user.email);
      const refreshToken = await this.tokenGenerator.generateRefreshToken();
      this.userPreserver.preserveUser({ ...user, refreshToken });
      return [token, refreshToken];
    }
    this.logger.warn(`Bad attempt to log in for ${email}`);
    return undefined;
  }
}
