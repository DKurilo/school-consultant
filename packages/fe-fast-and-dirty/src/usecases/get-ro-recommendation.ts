import { ReadOnlyRecommendation } from "@school-consultant/common";
import { IRoRecommendationGetter } from "../ports/ro-recommendation-getter";
import { IGetRoRecommendation } from "../ports/get-ro-recommendation";

export class GetRoRecommendation implements IGetRoRecommendation {
  private roRecommendationGetter: IRoRecommendationGetter;

  public constructor(roRecommendationGetter: IRoRecommendationGetter) {
    this.roRecommendationGetter = roRecommendationGetter;
  }

  public async execute(roToken: string): Promise<ReadOnlyRecommendation> {
    return this.roRecommendationGetter.getRecommendation(roToken);
  }
}
