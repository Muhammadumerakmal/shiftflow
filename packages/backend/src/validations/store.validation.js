import { z } from "zod";

export const updateStoreSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  address: z.string().max(255).optional(),
  timezone: z.string().max(50).optional(),
  businessHours: z.any().optional(),
});

export const inviteStaffSchema = z.object({
  phone: z.string().min(1, "Phone number is required").max(20),
  fullName: z.string().min(1, "Full name is required").max(100),
  position: z.string().max(100).optional(),
});

export const updateStaffSchema = z.object({
  position: z.string().max(100).optional(),
  hourlyRate: z.number().min(0).optional(),
  canOpen: z.boolean().optional(),
  canClose: z.boolean().optional(),
  maxWeeklyHours: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
