import { logger } from "../utils/logger.js";
import { captureError } from "../utils/sentry.js";

export function errorHandler(err, req, res, next) {
  const context = {
    organizationId: req.storeId || req.organizationId,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    ip: req.ip,
  };

  if (err.status >= 500) {
    logger.error({ err, ...context }, err.message);
    captureError(err, context);
  } else {
    logger.warn({ err, ...context }, err.message);
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    error: message,
  });
}

// Custom error class services can throw with a specific HTTP status
export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
