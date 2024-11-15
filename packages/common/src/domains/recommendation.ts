import { z } from "zod";
import { AddressParser } from "./address";
import { SchoolParser } from "./school";

export const RecommendationParser = z.object({
  interests: z.array(z.string()),
  additionalInfo: z.string(),
  address: AddressParser,
  readOnlyKey: z.string(),
  schools: z.array(SchoolParser),
});

export type Recommendation = z.infer<typeof RecommendationParser>;
