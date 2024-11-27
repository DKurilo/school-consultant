import { Recommendation } from "@school-consultant/common";

export interface IGetRecommendation {
  execute: (
    token: string,
    child: string,
    recommendation: string,
  ) => Promise<Recommendation | "not found" | "no access">;
}
