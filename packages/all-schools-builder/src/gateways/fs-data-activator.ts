import fs from "node:fs/promises";
import path from "node:path";
import { IDataActivator } from "../ports/data-activator";
import { generateName } from "../utils/random-name-generator";

export class FsDataActivator implements IDataActivator {
  private storagePath: string;
  private activePrefix: string;

  public constructor(storagePath: string, activePrefix: string) {
    this.storagePath = storagePath;
    this.activePrefix = activePrefix;
  }

  private async deletePathNoError(p: string): Promise<void> {
    try {
      fs.rm(p, { recursive: true, force: true });
    } catch (e) {
      console.log(e);
    }
  }

  public async activate(prefix: string): Promise<[string, Promise<void>]> {
    const tempName = await generateName();
    const tempPath = path.join(this.storagePath, tempName);
    const activePath = path.join(this.storagePath, this.activePrefix);
    const newPath = path.join(this.storagePath, prefix);
    try {
      await fs.rename(activePath, tempPath);
    } catch (e) {
      console.log(e);
    }
    await fs.rename(newPath, activePath);
    const deletePromise = this.deletePathNoError(tempPath);
    return [this.activePrefix, deletePromise];
  }

  public getActivePrefix(): string {
    return this.activePrefix;
  }
}
