import fs from "node:fs/promises";
import path from "node:path";
import { IDataLoader } from "../ports/data-loader";
import { SchoolType, SingleSourceSchoolInfo } from "../domains/school-info";
import z from "zod";
import { SchoolParser } from "../utils/parsers";

const SchoolJsonParser = z.object({
  threeK: SchoolParser.optional(),
  preK: SchoolParser.optional(),
  k: SchoolParser.optional(),
});

export class FsDataLoader implements IDataLoader {
  private storagePath: string;
  private schoolType: SchoolType;

  public constructor(
    storageFolder: string,
    storagePrefix: string,
    schoolType: SchoolType,
  ) {
    this.storagePath = path.join(storageFolder, storagePrefix);
    this.schoolType = schoolType;
  }

  public async *load(): AsyncIterableIterator<SingleSourceSchoolInfo> {
    const fileIterator = await fs.opendir(this.storagePath);
    let ent = await fileIterator.read();
    while (ent !== null) {
      if (ent.isFile() && path.extname(ent.name) === ".json") {
        const filePath = path.join(ent.parentPath, ent.name);
        const content = await fs.readFile(filePath, "utf8");
        const json = SchoolJsonParser.parse(JSON.parse(content));
        const school = json[this.schoolType];
        if (school !== undefined) {
          yield {
            borough: school.school.district.borough,
            zone: school.school.district.code,
            name: school.name,
            gradesDescription: school.grades_description,
            dbn: school.school.dbn,
            address: school.school.full_address ?? undefined,
            latitude: school.school.address?.latitude ?? undefined,
            longitude: school.school.address?.longitude ?? undefined,
            email: school.email ?? undefined,
            phone: school.telephone ?? undefined,
            website: school.independent_website ?? undefined,
            uniform: school.uniform ?? undefined,
            raw: school,
          };
        }
      }
      ent = await fileIterator.read();
    }
    fileIterator.close();
  }
}
