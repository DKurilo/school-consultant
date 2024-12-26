import z from "zod";
import { SingleSourceSchoolInfo } from "../domains/school-info";
import { IDataLoader } from "../ports/data-loader";
import axios from "axios";

const SchoolParser = z
  .object({
    name: z.string(),
    school: z
      .object({
        dbn: z.string(),
        district: z
          .object({
            code: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

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
          zone: school.school.district.code,
          dbn: school.school.dbn,
          raw: school,
        };
      }
    }
  }
}
