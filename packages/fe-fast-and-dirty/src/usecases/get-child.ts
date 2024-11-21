import { ChildResponse } from "@school-consultant/common";
import { ITokensGetter } from "../ports/tokens-getter";
import { IChildGetter } from "../ports/child-getter";
import { IGetChild } from "../ports/get-child";

export class GetChild implements IGetChild {
  private tokensGetter: ITokensGetter;
  private childGetter: IChildGetter;

  public constructor(tokenGetter: ITokensGetter, childGetter: IChildGetter) {
    this.tokensGetter = tokenGetter;
    this.childGetter = childGetter;
  }

  public async execute(name: string): Promise<ChildResponse> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    return this.childGetter.getChild(token, name);
  }
}
