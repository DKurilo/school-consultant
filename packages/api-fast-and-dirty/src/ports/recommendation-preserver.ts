import { Recommendation } from "@school-consultant/common";

export interface IRecommendationPreserver {
  preserveRecommendation: (recommendation: Recommendation) => Promise<void>;
}
