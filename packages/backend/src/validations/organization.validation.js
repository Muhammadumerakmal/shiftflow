import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  plan: z.string().max(50).optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100),
});
