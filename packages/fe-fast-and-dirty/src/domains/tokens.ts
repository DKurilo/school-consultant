import { z } from "zod";

export const TokensParser = z.object({
  refreshToken: z.string(),
  token: z.string(),
});

export type Tokens = z.infer<typeof TokensParser>;
