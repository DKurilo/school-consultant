import { Recommendation, School } from "@school-consultant/common";

export interface ISchoolsListGetter {
  getSchoolsList: (recommendation: Recommendation) => Promise<School[]>;
}
