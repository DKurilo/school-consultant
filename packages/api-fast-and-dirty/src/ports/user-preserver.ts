import { User } from "@school-consultant/common";

export interface IUserPreserver {
  preserveUser: (user: User) => Promise<void>;
}
