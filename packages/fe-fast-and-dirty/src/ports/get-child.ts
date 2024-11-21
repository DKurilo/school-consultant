import { ChildResponse } from "@school-consultant/common";

export interface IGetChild {
  execute: (name: string) => Promise<ChildResponse>;
}
