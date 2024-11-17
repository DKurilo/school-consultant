import { IAddChild } from "../ports/add-child";
import { IChildAdder } from "../ports/child-adder";
import { ITokensGetter } from "../ports/tokens-getter";

export class AddChild implements IAddChild {
  private tokensGetter: ITokensGetter;
  private childAdder: IChildAdder;

  public constructor(tokenGetter: ITokensGetter, childAdder: IChildAdder) {
    this.tokensGetter = tokenGetter;
    this.childAdder = childAdder;
  }

  public async execute(name: string): Promise<void> {
    const token = await this.tokensGetter.getToken();
    if (token === undefined) {
      throw Error("no token");
    }
    await this.childAdder.addChild(token, name);
  }
}
