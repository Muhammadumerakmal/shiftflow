import { AppError } from "./errorHandler.middleware.js";

export function requireOrgRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.orgRole)) {
      return next(new AppError("You do not have permission to do this", 403));
    }
    next();
  };
}

export function requireStoreRole(...allowedRoles) {
  return (req, res, next) => {
    const storeId = req.params.storeId;
    const storeRole = req.user.storeRoles?.[storeId];

    if (!storeRole || !allowedRoles.includes(storeRole)) {
      return next(new AppError("You do not have permission to do this", 403));
    }

    req.storeRole = storeRole;
    next();
  };
}

export function requireAnyStoreRole() {
  return (req, res, next) => {
    const storeId = req.params.storeId;
    const storeRole = req.user.storeRoles?.[storeId];

    if (!storeRole) {
      return next(new AppError("You do not have access to this store", 403));
    }

    req.storeRole = storeRole;
    next();
  };
}
