import axios from "axios";
import { IRecommendationBuilder } from "../ports/recommendation-builder";

export class RecommendationBuilder implements IRecommendationBuilder {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async buildRecommendation(
    token: string,
    childName: string,
    recommendationTitle: string,
  ): Promise<void> {
    await axios.post(
      `${this.serverUrl}recommendation/build`,
      {
        "child-name": childName,
        "recommendation-title": recommendationTitle,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return;
  }
}
