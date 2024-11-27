import { ReadOnlyRecommendation } from "@school-consultant/common";
import { IGetReadOnlyRecommendation } from "../ports/get-read-only-recommendation";
import { ILogger } from "../ports/logger";
import { IRecommendationGetter } from "../ports/recommendation-getter";

export class GetReadOnlyRecommendation implements IGetReadOnlyRecommendation {
  private logger: ILogger;
  private roRecommendationGetter: IRecommendationGetter;
  private validCharacters =
    "abcdefghijclmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

  public constructor(
    logger: ILogger,
    roRecommendationGetter: IRecommendationGetter,
  ) {
    this.logger = logger;
    this.roRecommendationGetter = roRecommendationGetter;
  }

  private checkKey(key: string): boolean {
    return key
      .split("")
      .reduce((result, c) => result && this.validCharacters.includes(c), true);
  }

  public async execute(
    readOnlyKey: string,
  ): Promise<ReadOnlyRecommendation | "not found"> {
    if (!this.checkKey(readOnlyKey)) {
      this.logger.warn(
        `wrong key is provided, key (basse64 encoded): ${Buffer.from(readOnlyKey, "utf8").toString("base64")}`,
      );
      return "not found";
    }
    try {
      const recommendation =
        await this.roRecommendationGetter.getRecommendation(readOnlyKey);
      if (recommendation !== undefined) {
        return recommendation;
      }
    } catch (e) {
      this.logger.error(
        `Error while getting recommendation with key ${readOnlyKey}, error: ${e}`,
      );
    }
    return "not found";
  }
}
