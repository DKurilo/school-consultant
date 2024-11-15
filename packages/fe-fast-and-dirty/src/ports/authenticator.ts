import { Tokens } from "../domains/tokens";

export interface IAuthenticator {
  authenticate: (email: string, password: string) => Promise<Tokens>;
}
