import { ChildResponse } from "@school-consultant/common";

export interface IGetChild {
  execute: (
    token: string,
    child: string,
  ) => Promise<ChildResponse | "not found" | "no access">;
}
