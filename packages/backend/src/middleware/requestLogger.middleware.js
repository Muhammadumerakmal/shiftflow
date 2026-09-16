import { logger } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const context = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      organizationId: req.user?.organizationId,
      userId: req.user?.id,
    };

    if (res.statusCode >= 500) {
      logger.error(context, "Request completed with error");
    } else if (res.statusCode >= 400) {
      logger.warn(context, "Request completed with client error");
    } else {
      logger.info(context, "Request completed");
    }
  });

  next();
}