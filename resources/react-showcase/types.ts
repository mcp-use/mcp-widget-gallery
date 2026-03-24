import { z } from "zod";

export const propSchema = z.object({
  name: z.string().describe("Display name"),
  type: z.string().optional().describe("Widget type label"),
});

export type ReactShowcaseProps = z.infer<typeof propSchema>;
