import { TimeOffModel } from "../models/timeOff.model.js";
import { ActivityLogService } from "./activityLog.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const TimeOffService = {
  async requestTimeOff({ userId, storeId, startsOn, endsOn, reason }) {
    if (new Date(startsOn) > new Date(endsOn)) {
      throw new AppError("Start date must be before or equal to end date", 400);
    }

    const overlaps = await TimeOffModel.findOverlapping({ userId, startsOn, endsOn });
    if (overlaps.length > 0) {
      throw new AppError(
        "You already have a time-off request covering these dates",
        409
      );
    }

    const request = await TimeOffModel.create({ userId, storeId, startsOn, endsOn, reason });

    await ActivityLogService.log({
      storeId,
      userId,
      action: "timeoff.requested",
      entityType: "time_off_request",
      entityId: request.id,
      metadata: { startsOn, endsOn },
    });

    // TODO (V1.1): notify manager

    return request;
  },

  async listForStore(storeId, status) {
    return TimeOffModel.findByStore(storeId, status);
  },

  async approve(requestId, reviewedBy) {
    const request = await TimeOffModel.findById(requestId);
    if (!request) throw new AppError("Time-off request not found", 404);

    if (request.status !== "pending") {
      throw new AppError(`Cannot approve a request with status "${request.status}"`, 409);
    }

    const updated = await TimeOffModel.updateStatus(requestId, {
      status: "approved",
      reviewedBy,
    });

    await ActivityLogService.log({
      storeId: request.store_id,
      userId: reviewedBy,
      action: "timeoff.approved",
      entityType: "time_off_request",
      entityId: requestId,
    });

    // TODO (V1.1): notify staff member

    return updated;
  },

  async deny(requestId, reviewedBy) {
    const request = await TimeOffModel.findById(requestId);
    if (!request) throw new AppError("Time-off request not found", 404);

    if (request.status !== "pending") {
      throw new AppError(`Cannot deny a request with status "${request.status}"`, 409);
    }

    const updated = await TimeOffModel.updateStatus(requestId, {
      status: "denied",
      reviewedBy,
    });

    await ActivityLogService.log({
      storeId: request.store_id,
      userId: reviewedBy,
      action: "timeoff.denied",
      entityType: "time_off_request",
      entityId: requestId,
    });

    return updated;
  },
};
