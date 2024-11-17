import axios from "axios";
import { IChildAdder } from "../ports/child-adder";

export class ChildAdder implements IChildAdder {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async addChild(token: string, name: string): Promise<void> {
    await axios.post(
      `${this.serverUrl}child`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
