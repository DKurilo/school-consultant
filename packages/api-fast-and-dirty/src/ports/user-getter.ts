import { User } from "@school-consultant/common/src/domains/user";

export interface IUserGetter {
  getUser: (email: string) => Promise<User | undefined>;
}
