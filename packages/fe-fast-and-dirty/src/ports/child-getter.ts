import { ChildResponse } from "@school-consultant/common";

export interface IChildGetter {
  getChild: (token: string, childName: string) => Promise<ChildResponse>;
}
