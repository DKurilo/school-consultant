import { Buffer } from "node:buffer";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { User, UserParser } from "@school-consultant/common/src/domains/user";
import { IUserGetter } from "../ports/user-getter";
import { ILogger } from "../ports/logger";
import { IUserPreserver } from "../ports/user-preserver";

export class FsUser implements IUserGetter, IUserPreserver {
  private storagePath: string;
  private logger: ILogger;

  public constructor(storagePath: string, logger: ILogger) {
    this.storagePath = storagePath;
    this.logger = logger;
  }

  private _getFilePath(email: string): string {
    const fileName = Buffer.from(email).toString("base64url");
    return join(this.storagePath, fileName);
  }

  public async getUser(email: string): Promise<User | undefined> {
    try {
      const userFilePath = this._getFilePath(email);
      const fileContent = await readFile(userFilePath, { encoding: "utf-8" });
      return UserParser.parse(JSON.parse(fileContent));
    } catch (e) {
      this.logger.warn(e);
      return undefined;
    }
  }

  public async preserveUser(user: User): Promise<void> {
    const userFilePath = this._getFilePath(user.email);
    await writeFile(userFilePath, JSON.stringify(user, null, "  "));
  }
}
