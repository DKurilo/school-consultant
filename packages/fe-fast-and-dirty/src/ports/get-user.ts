import { UserResponse } from "@school-consultant/common";

export interface IGetUser {
  execute: () => Promise<UserResponse>;
}
