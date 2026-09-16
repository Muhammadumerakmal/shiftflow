import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  orgRole: z.enum(["org_admin", "member"], { required_error: "Organization role is required" }),
  storeId: z.string().uuid().optional(),
  storeRole: z.enum(["manager", "staff"]).optional(),
}).refine(
  (data) => {
    if (data.storeId && !data.storeRole) return false;
    if (data.storeRole && !data.storeId) return false;
    return true;
  },
  { message: "storeId and storeRole must be provided together" }
);

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Invite token is required"),
});
