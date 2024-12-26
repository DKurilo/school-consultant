import { z } from "zod";
import { SpreadsheetRow } from "./spreadsheet";

export const SingleSourceSchoolInfoParser = z.object({
  zone: z.string(),
  name: z.string(),
  dbn: z.string(),
  raw: z.object({}).passthrough(),
});

export type SingleSourceSchoolInfo = z.infer<
  typeof SingleSourceSchoolInfoParser
>;

export const SchoolInfoParser = z.object({
  zone: z.string(),
  name: z.string(),
  dbn: z.string(),
  threeK: z.object({}).passthrough().optional(),
  preK: z.object({}).passthrough().optional(),
  k: z.object({}).passthrough().optional(),
});

export type SchoolInfo = z.infer<typeof SchoolInfoParser>;

export const schoolInfoToSpreadsheetRow = (
  si: SchoolInfo,
  schoolListPrefix: string,
): SpreadsheetRow => ({
  zone: si.zone,
  name: si.name,
  dbn: si.dbn,
  link: `${schoolListPrefix}${si.dbn}`,
  threeK: "threeK" in si && si.threeK !== null,
  preK: "preK" in si && si.preK !== null,
  k: "preK" in si && si.preK !== null,
});
