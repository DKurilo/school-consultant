import { Recommendation } from "@school-consultant/common";

export interface IGetRecommendation {
  execute: (
    childName: string,
    recommendationTitle: string,
  ) => Promise<Recommendation>;
}
