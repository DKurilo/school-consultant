import { RecommendationInput } from "@school-consultant/common";

export interface ISaveRecommendation {
  execute: (
    child: string,
    recommendation: RecommendationInput,
  ) => Promise<void>;
}
