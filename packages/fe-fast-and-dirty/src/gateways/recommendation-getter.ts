import {
  Recommendation,
  RecommendationParser,
} from "@school-consultant/common";
import axios from "axios";
import { IRecommendationGetter } from "../ports/recommendation-getter";

export class RecommendationGetter implements IRecommendationGetter {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async getRecommendation(
    token: string,
    childName: string,
    recommendationTitle: string,
  ): Promise<Recommendation> {
    const response = await axios.get(`${this.serverUrl}recommendation`, {
      params: {
        "child-name": childName,
        "recommendation-title": recommendationTitle,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const recommendation = RecommendationParser.parse(response.data);
    return recommendation;
  }
}
