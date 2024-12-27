import z from "zod";
import { SingleSourceSchoolInfo } from "../domains/school-info";
import { IDataLoader } from "../ports/data-loader";
import axios from "axios";
import { SchoolParser } from "../utils/parsers";

const DataParser = z.object({
  next: z.string().nullable(),
  results: z.array(SchoolParser),
});

export class MyschoolsNycDataLoader implements IDataLoader {
  private baseUrl: string;
  private queue: <T>(f: () => Promise<T>) => Promise<T>;

  public constructor(
    baseUrl: string,
    queue: <T>(f: () => Promise<T>) => Promise<T>,
  ) {
    this.baseUrl = baseUrl;
    this.queue = queue;
  }

  public async *load(): AsyncIterableIterator<SingleSourceSchoolInfo> {
    let url: string | null = this.baseUrl;
    while (url !== null) {
      const currentUrl = url;
      const results = await this.queue(() => axios.get(currentUrl));
      const parsedResults = DataParser.parse(results.data);
      url = parsedResults.next;
      for (const school of parsedResults.results) {
        yield {
          name: school.name,
          borough: school.school.district.borough,
          zone: school.school.district.code,
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
  }
}
