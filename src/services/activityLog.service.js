import { ActivityLogModel } from "../models/activityLog.model.js";

export const ActivityLogService = {
  // Fire-and-forget style: logs the action, never blocks or breaks the main flow
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
      // Never let audit logging failure break the actual operation
      console.error("Activity log failed:", err.message);
    }
  },
};
