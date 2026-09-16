import { ActivityLogModel } from "../models/activityLog.model.js";
import { logger } from "../utils/logger.js";

export const ActivityLogService = {
  async log({ storeId, userId, action, entityType, entityId, metadata }) {
    try {
      await ActivityLogModel.create({
        storeId,
        userId,
        action,
        entityType,
        entityId,
        metadata,
      });
    } catch (err) {
      logger.error({ err, storeId, userId, action }, "Activity log failed");
    }
  },
};
