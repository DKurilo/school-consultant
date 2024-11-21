import { RecommendationInput } from "@school-consultant/common";

export interface IRecommendationPreserver {
  preserve: (
    token: string,
    child: string,
    recommendation: RecommendationInput,
  ) => Promise<void>;
}
