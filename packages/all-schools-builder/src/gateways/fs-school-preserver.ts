import fs from "node:fs/promises";
import path from "node:path";
import { SchoolInfo } from "../domains/school-info";
import { ISchoolPreserver } from "../ports/school-preserver";

export class FsSchoolPreserver implements ISchoolPreserver {
  private storagePath: string;

  public constructor(storagePath: string) {
    this.storagePath = storagePath;
  }

  public async preserve(prefix: string, schoolInfo: SchoolInfo): Promise<void> {
    const folderName = path.join(this.storagePath, prefix);
    const fileName = path.join(folderName, `${schoolInfo.dbn}.json`);
    try {
      const ent = await fs.stat(folderName);
      if (!ent.isDirectory()) {
        await fs.unlink(folderName);
        throw new Error("dummy");
      }
    } catch {
      await fs.mkdir(folderName);
    }
    await fs.writeFile(fileName, JSON.stringify(schoolInfo));
  }
}
