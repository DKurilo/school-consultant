import { RecommendationInput } from "@school-consultant/common";

export type ErrorReasons =
  | "no access"
  | "user not found"
  | "child not found"
  | "could not save";

export interface ISaveRecommendation {
  execute: (
    token: string,
    child: string,
    recommendation: RecommendationInput,
  ) => Promise<void | ErrorReasons>;
}
