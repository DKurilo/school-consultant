import { sign, Secret, PrivateKey, SignOptions } from "jsonwebtoken";
import { ITokenGenerator } from "../ports/token-generator";
import { ILogger } from "../ports/logger";
import { randomInt } from "node:crypto";

const asyncRandomInt = (min: number, max: number): Promise<number> =>
  new Promise((resolve, reject) => {
    try {
      randomInt(min, max, (err, n) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(n);
      });
    } catch (e) {
      reject(e);
    }
  });

const asyncSign = (
  payload: string | Buffer | object,
  secretOrPrivateKey: Secret | PrivateKey,
  options?: SignOptions,
) =>
  new Promise<string>((resolve, reject) => {
    try {
      sign(payload, secretOrPrivateKey, options ?? {}, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        if (token === undefined) {
          reject(Error(`undefined token for payload ${payload}`));
          return;
        }
        resolve(token);
      });
    } catch (e) {
      reject(e);
    }
  });

export class JwtTokenGenerator implements ITokenGenerator {
  private logger: ILogger;
  private secret: string;
  private duration: number;

  public constructor(logger: ILogger, secret: string, duration: number) {
    this.logger = logger;
    this.secret = secret;
    this.duration = duration;
  }

  public async generateToken(email: string): Promise<string> {
    try {
      const token = await asyncSign({ email }, this.secret, {
        expiresIn: this.duration,
      });
      if (token === undefined) {
        this.logger.error(`Token is undefined for email ${email}`);
        throw Error("JWT were not created");
      }
      return token;
    } catch (e) {
      this.logger.error(
        `Could not generate token for email ${email} because of ${e}`,
      );
      throw e;
    }
  }

  public async generateRefreshToken(): Promise<string> {
    const abc =
      "abcdefghijclmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}[]|\\;:'\"<>,.?/`~";
    const tokenArray = await Promise.all(
      new Array(256).fill(0).map(() => asyncRandomInt(0, abc.length - 1)),
    );
    return tokenArray.map((n) => abc[n]).join("");
  }
}
