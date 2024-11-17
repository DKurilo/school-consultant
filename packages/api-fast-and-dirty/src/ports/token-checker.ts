import { Token } from "@school-consultant/common";

export interface ITokenChecker {
  verify: (token: string) => Promise<Token>;
}
