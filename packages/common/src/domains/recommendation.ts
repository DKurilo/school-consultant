import { z } from "zod";
import { AddressParser } from "./address";
import { SchoolParser } from "./school";

export const RecommendationStatusParser = z.union([
  z.literal("new"),
  z.literal("building"),
  z.literal("ready"),
]);

export type RecommendationStatus = z.infer<typeof RecommendationStatusParser>;

export const RecommendationParser = z.object({
  title: z.string(),
  interests: z.array(z.string()),
  additionalInfo: z.string(),
  address: AddressParser,
  readOnlyKey: z.string(),
  schools: z.array(SchoolParser),
  status: RecommendationStatusParser,
});

export type Recommendation = z.infer<typeof RecommendationParser>;

export const RecommendationInputParser = z.object({
  title: z.string(),
  interests: z.array(z.string()),
  additionalInfo: z.string(),
  address: AddressParser,
});

export type RecommendationInput = z.infer<typeof RecommendationInputParser>;

export const ReadOnlyRecommendationParser = z.object({
  title: z.string(),
  interests: z.array(z.string()),
  additionalInfo: z.string(),
  address: AddressParser,
  readOnlyKey: z.string(),
  schools: z.array(SchoolParser),
});

export type ReadOnlyRecommendation = z.infer<
  typeof ReadOnlyRecommendationParser
>;
