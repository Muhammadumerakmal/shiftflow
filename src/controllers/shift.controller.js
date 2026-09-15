import { ShiftService } from "../services/shift.service.js";

export const ShiftController = {
  async createShift(req, res, next) {
    try {
      const { userId, startsAt, endsAt, position, notes } = req.body;
      const shift = await ShiftService.createShift({
        storeId: req.params.storeId,
        userId,
        startsAt,
        endsAt,
        position,
        notes,
        createdBy: req.user.id,
      });
      res.status(201).json({ success: true, data: shift });
    } catch (err) {
      next(err);
    }
  },

  async getWeekSchedule(req, res, next) {
    try {
      const { weekStart } = req.query;
      const shifts = await ShiftService.getWeekSchedule(req.params.storeId, weekStart);
      res.json({ success: true, data: shifts });
    } catch (err) {
      next(err);
    }
  },

  async updateShift(req, res, next) {
    try {
      const shift = await ShiftService.updateShift(
        req.params.shiftId,
        req.body,
        req.user.id
      );
      res.json({ success: true, data: shift });
    } catch (err) {
      next(err);
    }
  },

  async deleteShift(req, res, next) {
    try {
      const result = await ShiftService.deleteShift(req.params.shiftId, req.user.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async publishWeek(req, res, next) {
    try {
      const { weekStart } = req.body;
      const published = await ShiftService.publishWeek(
        req.params.storeId,
        weekStart,
        req.user.id
      );
      res.json({ success: true, data: published });
    } catch (err) {
      next(err);
    }
  },
};
