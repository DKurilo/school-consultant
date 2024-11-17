import { UserResponse } from "@school-consultant/common";

export interface IUserGetter {
  getUser: (token: string) => Promise<UserResponse>;
}
