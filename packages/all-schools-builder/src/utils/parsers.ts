import { z } from "zod";

export const SchoolParser = z
  .object({
    name: z.string(),
    school: z
      .object({
        dbn: z.string(),
        district: z
          .object({
            code: z.string(),
            borough: z.string(),
          })
          .passthrough(),
        address: z
          .object({
            latitude: z.string().nullable().optional(),
            longitude: z.string().nullable().optional(),
          })
          .passthrough()
          .nullable()
          .optional(),
        full_address: z.string().optional().nullable(),
      })
      .passthrough(),
    email: z.string().optional().nullable(),
    telephone: z.string().optional().nullable(),
    independent_website: z.string().optional().nullable(),
    uniform: z.boolean().optional().nullable(),
    grades_description: z.string(),
  })
  .passthrough();
