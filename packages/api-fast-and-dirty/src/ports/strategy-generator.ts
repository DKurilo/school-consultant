import { Recommendation, School } from "@school-consultant/common";

export interface IStrategyGenerator {
  generateStrategy: (
    recommendation: Recommendation,
    school: School,
  ) => Promise<string>;
}
