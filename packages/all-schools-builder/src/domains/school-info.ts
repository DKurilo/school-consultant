import { z } from "zod";
import { SpreadsheetRow } from "./spreadsheet";

export type SchoolType = "threeK" | "preK" | "k";

export const SingleSourceSchoolInfoParser = z.object({
  borough: z.string(),
  zone: z.string(),
  name: z.string(),
  gradesDescription: z.string(),
  dbn: z.string(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  uniform: z.boolean().optional(),
  raw: z.object({}).passthrough(),
});

export type SingleSourceSchoolInfo = z.infer<
  typeof SingleSourceSchoolInfoParser
>;

export const SchoolInfoParser = z.object({
  borough: z.string(),
  zone: z.string(),
  name: z.string(),
  gradesDescription: z.string(),
  dbn: z.string(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  uniform: z.boolean().optional(),
  threeK: z.object({}).passthrough().optional(),
  preK: z.object({}).passthrough().optional(),
  k: z.object({}).passthrough().optional(),
});

export type SchoolInfo = z.infer<typeof SchoolInfoParser>;

export const schoolInfoToSpreadsheetRow = (
  si: SchoolInfo,
  schoolListPrefix: string,
): SpreadsheetRow => ({
  borough: si.borough,
  zone: si.zone,
  name: si.name,
  gradesDescription: si.gradesDescription,
  dbn: si.dbn,
  link: `${schoolListPrefix}${si.dbn}`,
  address: si.address,
  mapLink:
    si.latitude && si.longitude
      ? `https://www.google.com/maps/place/${si.latitude},${si.longitude}`
      : undefined,
  email: si.email,
  phone: si.phone,
  website: si.website,
  uniform: si.uniform,
  threeK: "threeK" in si && si.threeK !== null,
  preK: "preK" in si && si.preK !== null,
  k: "k" in si && si.preK !== null,
});
