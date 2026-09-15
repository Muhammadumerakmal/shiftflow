import { ShiftModel } from "../models/shift.model.js";
import { StoreModel } from "../models/store.model.js";
import { ActivityLogService } from "./activityLog.service.js";
import { NotificationService } from "./notification.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const ShiftService = {
  async createShift({ storeId, userId, startsAt, endsAt, position, notes, createdBy }) {
    if (new Date(startsAt) >= new Date(endsAt)) {
      throw new AppError("Shift start time must be before end time", 400);
    }

    // If assigning to a staff member, check for overlapping shifts
    if (userId) {
      const overlaps = await ShiftModel.findOverlapping({ userId, startsAt, endsAt });
      if (overlaps.length > 0) {
        throw new AppError(
          "This staff member already has a shift that overlaps this time",
          409
        );
      }
    }

    const shift = await ShiftModel.create({
      storeId,
      userId,
      startsAt,
      endsAt,
      position,
      status: "draft",
      notes,
      createdBy,
    });

    await ActivityLogService.log({
      storeId,
      userId: createdBy,
      action: "shift.created",
      entityType: "shift",
      entityId: shift.id,
      metadata: { startsAt, endsAt, position },
    });

    return shift;
  },

  async getWeekSchedule(storeId, weekStart) {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return ShiftModel.findByStoreAndRange(storeId, start.toISOString(), end.toISOString());
  },

  async updateShift(shiftId, updates, updatedBy) {
    const existing = await ShiftModel.findById(shiftId);
    if (!existing) throw new AppError("Shift not found", 404);

    // Re-check overlap if time or staff is changing
    if (updates.userId || updates.startsAt || updates.endsAt) {
      const userId = updates.userId || existing.user_id;
      const startsAt = updates.startsAt || existing.starts_at;
      const endsAt = updates.endsAt || existing.ends_at;

      if (userId) {
        const overlaps = await ShiftModel.findOverlapping({
          userId,
          startsAt,
          endsAt,
          excludeShiftId: shiftId,
        });
        if (overlaps.length > 0) {
          throw new AppError(
            "This staff member already has a shift that overlaps this time",
            409
          );
        }
      }
    }

    const shift = await ShiftModel.update(shiftId, updates);

    await ActivityLogService.log({
      storeId: existing.store_id,
      userId: updatedBy,
      action: "shift.updated",
      entityType: "shift",
      entityId: shiftId,
      metadata: updates,
    });

    return shift;
  },

  async deleteShift(shiftId, deletedBy) {
    const existing = await ShiftModel.findById(shiftId);
    if (!existing) throw new AppError("Shift not found", 404);

    await ShiftModel.delete(shiftId);

    await ActivityLogService.log({
      storeId: existing.store_id,
      userId: deletedBy,
      action: "shift.deleted",
      entityType: "shift",
      entityId: shiftId,
    });

    return { id: shiftId };
  },

  async publishWeek(storeId, weekStart, publishedBy) {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    // Get affected staff before publishing (they're still in draft status)
    const affectedUserIds = await ShiftModel.findAffectedUserIds(
      storeId,
      start.toISOString(),
      end.toISOString()
    );

    const published = await ShiftModel.publishDrafts(
      storeId,
      start.toISOString(),
      end.toISOString()
    );

    await ActivityLogService.log({
      storeId,
      userId: publishedBy,
      action: "schedule.published",
      entityType: "shift",
      metadata: { weekStart, count: published.length },
    });

    // Notify affected staff that the schedule has been published
    const store = await StoreModel.findById(storeId);
    for (const userId of affectedUserIds) {
      await NotificationService.notify({
        userId,
        type: "shift_published",
        title: "New schedule published",
        body: `The schedule for ${store?.name || "your store"} has been published. Check your shifts.`,
      }).catch(() => {}); // fire-and-forget
    }

    return published;
  },
};
