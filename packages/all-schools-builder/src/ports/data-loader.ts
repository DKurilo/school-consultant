import { SingleSourceSchoolInfo } from "../domains/school-info";

export interface IDataLoader {
  load: () => AsyncIterableIterator<SingleSourceSchoolInfo>;
}
