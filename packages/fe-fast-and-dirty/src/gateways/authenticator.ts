import axios from "axios";
import { Tokens, TokensParser } from "../domains/tokens";
import { IAuthenticator } from "../ports/authenticator";

export class Authenticator implements IAuthenticator {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async authenticate(email: string, password: string): Promise<Tokens> {
    const response = await axios.post(
      `${this.serverUrl}login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );
    const tokens = TokensParser.parse(response.data);
    return tokens;
  }
}
