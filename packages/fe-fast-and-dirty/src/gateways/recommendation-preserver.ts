import axios from "axios";
import { IRecommendationPreserver } from "../ports/recommendation-preserver";
import { RecommendationInput } from "@school-consultant/common";

export class RecommendationPreserver implements IRecommendationPreserver {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async preserve(
    token: string,
    child: string,
    recommendation: RecommendationInput,
  ): Promise<void> {
    await axios.post(
      `${this.serverUrl}recommendation`,
      { child, recommendation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
