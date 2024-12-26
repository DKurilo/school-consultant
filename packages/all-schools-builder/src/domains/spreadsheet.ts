import z from "zod";

export const spreadsheetHeaders = {
  zone: "Zone/District",
  name: "School Name",
  dbn: "DBN (District Borough Number",
  link: "Link",
  threeK: "3K",
  preK: "Pre-K",
  k: "Kindergarten",
};

export const SpreadsheetRowParser = z.object({
  zone: z.string(),
  name: z.string(),
  dbn: z.string(),
  link: z.string(),
  threeK: z.boolean(),
  preK: z.boolean(),
  k: z.boolean(),
});

export type SpreadsheetRow = z.infer<typeof SpreadsheetRowParser>;
