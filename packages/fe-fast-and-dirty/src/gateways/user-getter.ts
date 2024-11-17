import { UserResponse, UserResponseParser } from "@school-consultant/common";
import axios from "axios";
import { IUserGetter } from "../ports/user-getter";

export class UserGetter implements IUserGetter {
  private serverUrl: string;

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async getUser(token: string): Promise<UserResponse> {
    const response = await axios.get(`${this.serverUrl}user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = UserResponseParser.parse(response.data);
    return user;
  }
}
