import { ReadOnlyRecommendation } from "@school-consultant/common";

export interface IRoRecommendationGetter {
  getRecommendation: (roToken: string) => Promise<ReadOnlyRecommendation>;
}
