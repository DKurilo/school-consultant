import { User } from "@school-consultant/common";

export interface IUserGetter {
  getUser: (email: string) => Promise<User | undefined>;
}
