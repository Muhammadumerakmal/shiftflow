import { AttendanceModel } from "../models/attendance.model.js";
import { ShiftModel } from "../models/shift.model.js";
import { ActivityLogService } from "./activityLog.service.js";
import { toCSV } from "../utils/csvExport.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

const LATE_THRESHOLD_MINUTES = 10; // more than 10 min late gets flagged

export const AttendanceService = {
  async clockIn({ userId, storeId, shiftId, method }) {
    const alreadyOpen = await AttendanceModel.findOpenForUser(userId);
    if (alreadyOpen) {
      throw new AppError("You are already clocked in — clock out first", 409);
    }

    const now = new Date();
    let variance = null;
    let flagged = false;

    if (shiftId) {
      const shift = await ShiftModel.findById(shiftId);
      if (shift) {
        const scheduledStart = new Date(shift.starts_at);
        variance = Math.round((now - scheduledStart) / 60000); // minutes, +ve = late
        flagged = variance > LATE_THRESHOLD_MINUTES;
      }
    }

    const record = await AttendanceModel.create({
      shiftId,
      userId,
      storeId,
      clockInAt: now.toISOString(),
      clockInMethod: method || "manager_manual",
      variance,
      flagged,
    });

    await ActivityLogService.log({
      storeId,
      userId,
      action: "attendance.clock_in",
      entityType: "attendance_record",
      entityId: record.id,
      metadata: { variance, flagged },
    });

    return record;
  },

  async clockOut({ userId }) {
    const open = await AttendanceModel.findOpenForUser(userId);
    if (!open) {
      throw new AppError("No active clock-in found", 404);
    }

    const record = await AttendanceModel.clockOut(open.id, new Date().toISOString());

    await ActivityLogService.log({
      storeId: record.store_id,
      userId,
      action: "attendance.clock_out",
      entityType: "attendance_record",
      entityId: record.id,
    });

    return record;
  },

  async listForStore(storeId, date) {
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return AttendanceModel.findByStoreAndRange(storeId, start.toISOString(), end.toISOString());
  },

  async exportWeekCSV(storeId, weekStart) {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const records = await AttendanceModel.findByStoreAndRange(
      storeId,
      start.toISOString(),
      end.toISOString()
    );

    return toCSV(records, [
      { label: "Staff Name", value: (r) => r.staff_name },
      { label: "Scheduled Start", value: (r) => r.scheduled_start },
      { label: "Scheduled End", value: (r) => r.scheduled_end },
      { label: "Clock In", value: (r) => r.clock_in_at },
      { label: "Clock Out", value: (r) => r.clock_out_at },
      { label: "Variance (min)", value: (r) => r.variance_minutes },
      { label: "Flagged", value: (r) => (r.flagged ? "Yes" : "No") },
    ]);
  },
};
