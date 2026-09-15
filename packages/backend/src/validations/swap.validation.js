import { z } from "zod";

export const requestSwapSchema = z.object({
  offeredTo: z.string().uuid().optional().nullable(),
  reason: z.string().max(500).optional(),
});
