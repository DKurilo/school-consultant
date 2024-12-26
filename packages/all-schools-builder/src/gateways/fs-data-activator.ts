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

  public async activate(prefix: string): Promise<[string, Promise<void>]> {
    const tempName = await generateName();
    const tempPath = path.join(this.storagePath, tempName);
    const activePath = path.join(this.storagePath, this.activePrefix);
    const newPath = path.join(this.storagePath, prefix);
    await fs.rename(activePath, tempPath);
    await fs.rename(newPath, activePath);
    const deletePromise = fs.rm(tempPath, { recursive: true, force: true });
    return [this.activePrefix, deletePromise];
  }
}
