import { Token } from "@school-consultant/common/src/domains/token";

export interface ITokenChecker {
  verify: (token: string) => Promise<Token>;
}
