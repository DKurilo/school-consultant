import { ReadOnlyRecommendation } from "@school-consultant/common";

export interface IRecommendationGetter {
  getRecommendation: (
    readOnlyKey: string,
  ) => Promise<ReadOnlyRecommendation | undefined>;
}
