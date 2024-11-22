import { Recommendation } from "@school-consultant/common";
import { ITokensGetter } from "../ports/tokens-getter";
import { IRecommendationGetter } from "../ports/recommendation-getter";
import { IGetRecommendation } from "../ports/get-recommendation";

export class GetRecommendation implements IGetRecommendation {
  private tokensGetter: ITokensGetter;
  private recommendationGetter: IRecommendationGetter;

  public constructor(
    tokenGetter: ITokensGetter,
    recommendationGetter: IRecommendationGetter,
  ) {
    this.tokensGetter = tokenGetter;
    this.recommendationGetter = recommendationGetter;
  }

  public async execute(
    childName: string,
    recommendationTitle: string,
  ): Promise<Recommendation> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    return this.recommendationGetter.getRecommendation(
      token,
      childName,
      recommendationTitle,
    );
  }
}
