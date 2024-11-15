import { z } from "zod";
import { RecommendationParser } from "./recommendation";

export const ChildParser = z.object({
  name: z.string(),
  attemptsLeft: z.number(),
  recommendations: z.array(RecommendationParser),
});

export type Child = z.infer<typeof ChildParser>;
