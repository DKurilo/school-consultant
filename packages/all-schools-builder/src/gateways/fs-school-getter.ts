import fs from "node:fs/promises";
import path from "node:path";
import { ISchoolGetter } from "../ports/school-getter";
import { SchoolInfo, SchoolInfoParser } from "../domains/school-info";

export class FsSchoolGetter implements ISchoolGetter {
  private storagePath: string;

  public constructor(storagePath: string) {
    this.storagePath = storagePath;
  }

  public async *list(prefix: string): AsyncIterableIterator<string> {
    const schoolsPath = path.join(this.storagePath, prefix);
    const fileIterator = await fs.opendir(schoolsPath);
    let ent = await fileIterator.read();
    while (ent !== null) {
      if (ent.isFile() && path.extname(ent.name) === "json") {
        yield path.basename(ent.name).slice(0, -4);
      }
      ent = await fileIterator.read();
    }
    fileIterator.close();
  }

  public async load(
    prefix: string,
    dbn: string,
  ): Promise<SchoolInfo | undefined> {
    const schoolPath = path.join(this.storagePath, prefix, `${dbn}.json`);
    const content = await fs.readFile(schoolPath, "utf8");
    return SchoolInfoParser.parse(content);
  }
}
