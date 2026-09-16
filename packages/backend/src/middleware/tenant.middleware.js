import { StoreModel } from "../models/store.model.js";
import { AppError } from "./errorHandler.middleware.js";

export async function tenantMiddleware(req, res, next) {
  try {
    const storeId = req.params.storeId;
    if (!storeId) return next();

    const store = await StoreModel.findById(storeId);
    if (!store || !store.is_active) {
      return next(new AppError("Access denied", 403));
    }

    if (store.organization_id !== req.user.organizationId) {
      return next(new AppError("Access denied", 403));
    }

    const storeRole = req.user.storeRoles?.[storeId];
    if (!storeRole) {
      return next(new AppError("You do not have access to this store", 403));
    }

    req.storeRole = storeRole;
    req.store = store;
    next();
  } catch (err) {
    next(err);
  }
}
