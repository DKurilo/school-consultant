import { User } from "@school-consultant/common/src/domains/user";

export interface IUserPreserver {
  preserveUser: (user: User) => Promise<void>;
}
