import { randomInt } from "node:crypto";
import { IUserGetter } from "../ports/user-getter";
import { ILogger } from "../ports/logger";
import { ITokenChecker } from "../ports/token-checker";
import {
  Recommendation,
  RecommendationInput,
  Token,
} from "@school-consultant/common";
import { IUserPreserver } from "../ports/user-preserver";
import { ISaveRecommendation } from "../ports/save-recommendation";

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

export class SaveRecommendation implements ISaveRecommendation {
  private logger: ILogger;
  private tokenChecker: ITokenChecker;
  private userGetter: IUserGetter;
  private userPreserver: IUserPreserver;

  public constructor(
    logger: ILogger,
    tokenChecker: ITokenChecker,
    userGetter: IUserGetter,
    userPreserver: IUserPreserver,
  ) {
    this.logger = logger;
    this.tokenChecker = tokenChecker;
    this.userGetter = userGetter;
    this.userPreserver = userPreserver;
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

  private async generateReadOnlyKey(): Promise<string> {
    const abc =
      "abcdefghijclmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const keyArray = await Promise.all(
      new Array(42).fill(0).map(() => asyncRandomInt(0, abc.length - 1)),
    );
    return keyArray.map((n) => abc[n]).join("");
  }

  public async execute(
    token: string,
    child: string,
    recommendation: RecommendationInput,
  ): Promise<void | "no access" | "user not found" | "child not found"> {
    const tokenContent = await this.getTokenContent(token);

    if (tokenContent === undefined) {
      return "no access";
    }

    const user = await this.userGetter.getUser(tokenContent.email);
    if (user === undefined) {
      return "user not found";
    }
    if (!(child in user.children)) {
      return "child not found";
    }

    const currentRecommendation =
      user.children[child].recommendations?.[recommendation.title];

    if (currentRecommendation === undefined) {
      const key = await this.generateReadOnlyKey();
      const rec: Recommendation = {
        title: recommendation.title,
        interests: recommendation.interests,
        additionalInfo: recommendation.additionalInfo,
        address: recommendation.address,
        readOnlyKey: key,
        schools: [],
      };
      user.children[child].recommendations[recommendation.title] = rec;
      this.userPreserver.preserveUser(user);
      return;
    }
    user.children[child].recommendations[recommendation.title] = {
      ...user.children[child].recommendations?.[recommendation.title],
      ...recommendation,
    };
    await this.userPreserver.preserveUser(user);
  }
}
