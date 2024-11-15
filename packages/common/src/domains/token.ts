import { z } from "zod";

export const TokenParser = z.object({
  iat: z.number(),
  exp: z.number(),
  email: z.string(),
});

export type Token = z.infer<typeof TokenParser>;
