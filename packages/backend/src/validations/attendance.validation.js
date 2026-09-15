import { z } from "zod";

export const clockInSchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
  shiftId: z.string().uuid().optional().nullable(),
  method: z.enum(["app_geofence", "pin_pad", "manager_manual"]).optional(),
});
