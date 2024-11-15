import { z } from "zod";
import { AddressParser } from "./address";

export const SchoolParser = z.object({
  address: AddressParser,
  name: z.string(),
  description: z.string(),
  strategy: z.string(),
  walkTime: z.number().optional(),
  carTime: z.number().optional(),
  transportTime: z.number().optional(),
});

export type School = z.infer<typeof SchoolParser>;
