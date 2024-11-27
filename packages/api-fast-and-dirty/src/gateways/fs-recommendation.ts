import { readFile, writeFile } from "node:fs/promises";
import {
  ReadOnlyRecommendation,
  ReadOnlyRecommendationParser,
  Recommendation,
} from "@school-consultant/common";
import { ILogger } from "../ports/logger";
import { IRecommendationGetter } from "../ports/recommendation-getter";
import { IRecommendationPreserver } from "../ports/recommendation-preserver";
import { join } from "node:path";

export class FsRecommendation
  implements IRecommendationPreserver, IRecommendationGetter
{
  private storagePath: string;
  private logger: ILogger;

  public constructor(storagePath: string, logger: ILogger) {
    this.storagePath = storagePath;
    this.logger = logger;
  }

  public async getRecommendation(
    readOnlyKey: string,
  ): Promise<ReadOnlyRecommendation | undefined> {
    try {
      const recommendationFilePath = join(this.storagePath, readOnlyKey);
      const fileContent = await readFile(recommendationFilePath, {
        encoding: "utf-8",
      });
      return ReadOnlyRecommendationParser.parse(JSON.parse(fileContent));
    } catch (e) {
      this.logger.warn(e);
      return undefined;
    }
  }

  public async preserveRecommendation(
    recommendation: Recommendation,
  ): Promise<void> {
    try {
      const recommendationFilePath = join(
        this.storagePath,
        recommendation.readOnlyKey,
      );
      const readOnlyRecommendation: ReadOnlyRecommendation =
        ReadOnlyRecommendationParser.parse(recommendation);
      await writeFile(
        recommendationFilePath,
        JSON.stringify(readOnlyRecommendation, null, "  "),
      );
    } catch (e) {
      this.logger.error(
        `Error while preserving recommendation ${recommendation.readOnlyKey}`,
        e,
      );
    }
  }
}
