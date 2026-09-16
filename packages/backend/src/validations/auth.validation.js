import { z } from "zod";

export const registerOrganizationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(1, "Full name is required").max(100),
  orgName: z.string().min(1, "Organization name is required").max(100),
  storeName: z.string().min(1, "Store name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const switchOrganizationSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
