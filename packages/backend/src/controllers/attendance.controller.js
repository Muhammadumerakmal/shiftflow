import { AttendanceService } from "../services/attendance.service.js";

export const AttendanceController = {
  async clockIn(req, res, next) {
    try {
      const { storeId, shiftId, method } = req.body;
      const record = await AttendanceService.clockIn({
        userId: req.user.id,
        storeId,
        shiftId,
        method,
      });
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  async clockOut(req, res, next) {
    try {
      const record = await AttendanceService.clockOut({ userId: req.user.id });
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  async listForStore(req, res, next) {
    try {
      const { date } = req.query;
      const records = await AttendanceService.listForStore(req.params.storeId, date);
      res.json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  },

  async exportCSV(req, res, next) {
    try {
      const { weekStart } = req.query;
      const csv = await AttendanceService.exportWeekCSV(req.params.storeId, weekStart);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="attendance_${weekStart}.csv"`);
      res.send(csv);
    } catch (err) {
      next(err);
    }
  },
};
