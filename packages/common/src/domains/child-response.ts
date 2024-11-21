import { z } from "zod";
import { Child } from "./child";

export const ChildResponseParser = z.object({
  name: z.string(),
  recommendations: z.record(z.string(), z.boolean()),
});

export type ChildResponse = z.infer<typeof ChildResponseParser>;

export const childToChildResponse = (child: Child): ChildResponse => ({
  name: child.name,
  recommendations: Object.entries(child.recommendations).reduce(
    (o, [name, recommendation]) => {
      Object.assign(o, {
        [name]: recommendation?.recommendation !== undefined,
      });
      return o;
    },
    {},
  ),
});
