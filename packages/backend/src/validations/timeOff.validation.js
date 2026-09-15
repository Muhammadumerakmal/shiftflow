import { z } from "zod";

export const requestTimeOffSchema = z.object({
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  reason: z.string().max(500).optional(),
});
