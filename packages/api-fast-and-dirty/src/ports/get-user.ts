import { UserResponse } from "@school-consultant/common";

export interface IGetUser {
  execute: (token: string) => Promise<UserResponse | "not found" | "no access">;
}
