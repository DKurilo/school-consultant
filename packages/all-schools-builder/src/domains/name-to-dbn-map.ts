import { z } from "zod";

export const NameToDbnMapParser = z.record(z.string(), z.string());

export type NameToDbnMap = z.infer<typeof NameToDbnMapParser>;
