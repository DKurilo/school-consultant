import { SchoolInfo } from "../domains/school-info";

export interface ISchoolPreserver {
  preserve: (prefix: string, schoolInfo: SchoolInfo) => Promise<void>;
}
