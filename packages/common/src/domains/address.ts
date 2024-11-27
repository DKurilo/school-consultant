import { z } from "zod";
import { CoordsParser } from "./coords";

export const AddressParser = z.union([
  z.object({
    zip: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    coords: CoordsParser.optional(),
  }),
  z.object({
    addr: z.string(),
    coords: CoordsParser.optional(),
  }),
]);

export type Address = z.infer<typeof AddressParser>;
