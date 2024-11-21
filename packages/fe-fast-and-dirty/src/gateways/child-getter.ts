import { ChildResponse, ChildResponseParser } from "@school-consultant/common";
import axios from "axios";
import { IChildGetter } from "../ports/child-getter";

export class ChildGetter implements IChildGetter {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async getChild(
    token: string,
    childName: string,
  ): Promise<ChildResponse> {
    const response = await axios.get(`${this.serverUrl}child`, {
      params: {
        name: childName,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = ChildResponseParser.parse(response.data);
    return user;
  }
}
