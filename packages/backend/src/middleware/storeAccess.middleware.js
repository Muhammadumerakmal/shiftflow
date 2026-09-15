import { StoreModel } from "../models/store.model.js";
import { AppError } from "./errorHandler.middleware.js";

// Usage: requireRole("owner", "manager")
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do this", 403));
    }
    next();
  };
}

// Verify the authenticated user belongs to the store in the URL param
export async function requireStoreAccess(req, res, next) {
  try {
    const storeId = req.params.storeId;
    if (!storeId) return next();

    // Owners/managers can access any store (they control access at the role level)
    if (req.user.role === "owner" || req.user.role === "manager") {
      return next();
    }

    // For staff, verify they belong to this store
    const staff = await StoreModel.findStaffByUserId(req.user.id);
    if (!staff || staff.store_id !== storeId) {
      return next(new AppError("You do not have access to this store", 403));
    }

    next();
  } catch (err) {
    next(err);
  }
}
