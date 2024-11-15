import { z } from "zod";

export const AddressParser = z.object({
  zip: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
});

export type Address = z.infer<typeof AddressParser>;
