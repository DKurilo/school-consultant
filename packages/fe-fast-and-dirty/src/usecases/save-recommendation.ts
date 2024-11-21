import { RecommendationInput } from "@school-consultant/common";
import { IRecommendationPreserver } from "../ports/recommendation-preserver";
import { ISaveRecommendation } from "../ports/save-recommendation";
import { ITokensGetter } from "../ports/tokens-getter";

export class SaveRecommendation implements ISaveRecommendation {
  private tokensGetter: ITokensGetter;
  private recommendationPreserver: IRecommendationPreserver;

  public constructor(
    tokenGetter: ITokensGetter,
    recommendationPreserver: IRecommendationPreserver,
  ) {
    this.tokensGetter = tokenGetter;
    this.recommendationPreserver = recommendationPreserver;
  }

  public async execute(
    child: string,
    recommendation: RecommendationInput,
  ): Promise<void> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    await this.recommendationPreserver.preserve(token, child, recommendation);
  }
}
