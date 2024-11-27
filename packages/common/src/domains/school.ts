import { z } from "zod";
import { AddressParser } from "./address";
import { CoordsParser } from "./coords";

export const ShortSchoolParser = z.object({
  address: AddressParser,
  name: z.string(),
  description: z.string(),
});

export type ShortSchool = z.infer<typeof ShortSchoolParser>;

export const SchoolParser = z.object({
  address: AddressParser,
  name: z.string(),
  rank: z.number(),
  description: z.string(),
  strategy: z.string().optional(),
  coords: CoordsParser.optional(),
  walkTime: z.number().optional(),
  carTime: z.number().optional(),
  transportTime: z.number().optional(),
});

export type School = z.infer<typeof SchoolParser>;
