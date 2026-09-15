import { z } from "zod";

export const createShiftSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  startsAt: z.string().datetime("Invalid start time"),
  endsAt: z.string().datetime("Invalid end time"),
  position: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export const updateShiftSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  startsAt: z.string().datetime("Invalid start time").optional(),
  endsAt: z.string().datetime("Invalid end time").optional(),
  position: z.string().max(100).optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
  notes: z.string().max(500).optional(),
});

export const publishWeekSchema = z.object({
  weekStart: z.string().datetime("Invalid week start date"),
});
