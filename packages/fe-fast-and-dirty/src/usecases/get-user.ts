import { UserResponse } from "@school-consultant/common";
import { ITokensGetter } from "../ports/tokens-getter";
import { IUserGetter } from "../ports/user-getter";
import { IGetUser } from "../ports/get-user";

export class GetUser implements IGetUser {
  private tokensGetter: ITokensGetter;
  private userGetter: IUserGetter;

  public constructor(tokenGetter: ITokensGetter, userGetter: IUserGetter) {
    this.tokensGetter = tokenGetter;
    this.userGetter = userGetter;
  }

  public async execute(): Promise<UserResponse> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    return this.userGetter.getUser(token);
  }
}
