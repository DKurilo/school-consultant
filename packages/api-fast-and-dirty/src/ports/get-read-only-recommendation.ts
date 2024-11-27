import { ReadOnlyRecommendation } from "@school-consultant/common";

export interface IGetReadOnlyRecommendation {
  execute: (
    readOnlyKey: string,
  ) => Promise<ReadOnlyRecommendation | "not found">;
}
