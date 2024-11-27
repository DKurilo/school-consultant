import { z } from "zod";

export const CoordsParser = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type Coords = z.infer<typeof CoordsParser>;
