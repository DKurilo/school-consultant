import {
  ReadOnlyRecommendation,
  ReadOnlyRecommendationParser,
} from "@school-consultant/common";
import axios from "axios";
import { IRoRecommendationGetter } from "../ports/ro-recommendation-getter";

export class RoRecommendationGetter implements IRoRecommendationGetter {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async getRecommendation(
    roToken: string,
  ): Promise<ReadOnlyRecommendation> {
    const response = await axios.get(
      `${this.serverUrl}recommendation/read-only`,
      {
        params: {
          "ro-key": roToken,
        },
      },
    );
    const recommendation = ReadOnlyRecommendationParser.parse(response.data);
    return recommendation;
  }
}
