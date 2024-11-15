import { Tokens } from "../domains/tokens";
import { ICheckIfAuthenticated } from "../ports/check-if-authenticated";

export class CheckIfAuthenticated implements ICheckIfAuthenticated {
  private storage: Tokens[];

  public constructor(storage: Tokens[]) {
    this.storage = storage;
  }

  public async check(): Promise<boolean> {
    return this.storage.length > 0;
  }
}
