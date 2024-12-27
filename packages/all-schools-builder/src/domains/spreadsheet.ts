import z from "zod";

export const spreadsheetHeaders = {
  borough: "Borough",
  zone: "Zone/District",
  name: "School Name",
  gradesDescription: "Grades",
  dbn: "DBN (District Borough Number)",
  link: "Link",
  address: "Address",
  mapLink: "Google Map",
  email: "E-mail",
  phone: "Phone number",
  website: "Web Site",
  uniform: "Uniform",
  threeK: "3K",
  preK: "Pre-K",
  k: "Kindergarten",
};

export const SpreadsheetRowParser = z.object({
  borough: z.string(),
  zone: z.string(),
  name: z.string(),
  gradesDescription: z.string(),
  dbn: z.string(),
  link: z.string(),
  address: z.string().optional(),
  mapLink: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  uniform: z.boolean().optional(),
  threeK: z.boolean(),
  preK: z.boolean(),
  k: z.boolean(),
});

export type SpreadsheetRow = z.infer<typeof SpreadsheetRowParser>;
