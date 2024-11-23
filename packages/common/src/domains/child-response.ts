import { z } from "zod";
import { Child } from "./child";
import { RecommendationStatusParser } from "./recommendation";

export const ChildResponseParser = z.object({
  name: z.string(),
  recommendations: z.record(z.string(), RecommendationStatusParser),
});

export type ChildResponse = z.infer<typeof ChildResponseParser>;

export const childToChildResponse = (child: Child): ChildResponse => ({
  name: child.name,
  recommendations: Object.entries(child.recommendations).reduce(
    (o, [name, recommendation]) => {
      Object.assign(o, {
        [name]: recommendation.status,
      });
      return o;
    },
    {},
  ),
});
