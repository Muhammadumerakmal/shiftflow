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
