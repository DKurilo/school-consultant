import { z } from "zod";
import { RecommendationParser } from "./recommendation";

export const ChildParser = z.object({
  name: z.string(),
  recommendations: z.record(z.string(), RecommendationParser),
});

export type Child = z.infer<typeof ChildParser>;
