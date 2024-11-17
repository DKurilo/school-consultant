import { z } from "zod";
import { ChildParser } from "./child";

export const UserParser = z.object({
  email: z.string(),
  passHash: z.string(),
  passSalt: z.string(),
  refreshToken: z.string().optional(),
  children: z.record(z.string(), ChildParser),
  attemptsLeft: z.number(),
});

export type User = z.infer<typeof UserParser>;
