import { RecommendationInput } from "@school-consultant/common";

export interface ISaveRecommendation {
  execute: (
    token: string,
    child: string,
    recommendation: RecommendationInput,
  ) => Promise<void | "no access" | "user not found" | "child not found">;
}
