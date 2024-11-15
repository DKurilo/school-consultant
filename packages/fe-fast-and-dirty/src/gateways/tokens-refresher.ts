import axios from "axios";
import { Tokens, TokensParser } from "../domains/tokens";
import { ITokensRefresher } from "../ports/tokens-refresher";

export class TokensRefresher implements ITokensRefresher {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async refresh(oldTokens: Tokens): Promise<Tokens> {
    const response = await axios.post(
      `${this.serverUrl}refresh`,
      { refreshToken: oldTokens.refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oldTokens.token}`,
        },
      },
    );
    const tokens = TokensParser.parse(response.data);
    return tokens;
  }
}
