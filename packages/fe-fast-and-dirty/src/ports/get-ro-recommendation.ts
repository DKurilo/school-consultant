import { ReadOnlyRecommendation } from "@school-consultant/common";

export interface IGetRoRecommendation {
  execute: (roToken: string) => Promise<ReadOnlyRecommendation>;
}
