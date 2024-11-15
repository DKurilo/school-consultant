import { GetPublicKeyOrSecret, PublicKey, Secret, verify } from "jsonwebtoken";
import { ILogger } from "../ports/logger";
import { ITokenChecker } from "../ports/token-checker";
import {
  Token,
  TokenParser,
} from "@school-consultant/common/src/domains/token";

const asyncVerify = (
  token: string,
  secretOrPublicKey: Secret | PublicKey | GetPublicKeyOrSecret,
): Promise<Token> =>
  new Promise((resolve, reject) => {
    try {
      verify(token, secretOrPublicKey, { complete: false }, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const token = TokenParser.parse(decoded);
          resolve(token);
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });

export class JwtTokenChecker implements ITokenChecker {
  private logger: ILogger;
  private secret: string;
  public constructor(logger: ILogger, secret: string) {
    this.logger = logger;
    this.secret = secret;
  }

  public async verify(token: string): Promise<Token> {
    try {
      const tokenContent = await asyncVerify(token, this.secret);
      return tokenContent;
    } catch (e) {
      this.logger.warn(`Could not verify token ${token}, error: ${e}`);
      throw e;
    }
  }
}
