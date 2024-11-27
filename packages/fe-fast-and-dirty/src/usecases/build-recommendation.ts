import { ITokensGetter } from "../ports/tokens-getter";
import { IRecommendationBuilder } from "../ports/recommendation-builder";
import { IBuildRecommendation } from "../ports/build-recommendation";

export class BuildRecommendation implements IBuildRecommendation {
  private tokensGetter: ITokensGetter;
  private recommendationBuilder: IRecommendationBuilder;

  public constructor(
    tokenGetter: ITokensGetter,
    recommendationBuilder: IRecommendationBuilder,
  ) {
    this.tokensGetter = tokenGetter;
    this.recommendationBuilder = recommendationBuilder;
  }

  public async execute(
    childName: string,
    recommendationTitle: string,
  ): Promise<void> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    await this.recommendationBuilder.buildRecommendation(
      token,
      childName,
      recommendationTitle,
    );
    return;
  }
}
