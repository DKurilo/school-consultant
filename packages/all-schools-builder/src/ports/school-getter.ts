import { SchoolInfo } from "../domains/school-info";

export interface ISchoolGetter {
  list: (prefix: string) => AsyncIterableIterator<string>;
  load: (prefix: string, dbn: string) => Promise<SchoolInfo | undefined>;
}
