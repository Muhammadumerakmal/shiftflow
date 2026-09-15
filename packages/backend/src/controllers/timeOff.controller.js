import { TimeOffService } from "../services/timeOff.service.js";

export const TimeOffController = {
  async requestTimeOff(req, res, next) {
    try {
      const { startsOn, endsOn, reason } = req.body;
      const request = await TimeOffService.requestTimeOff({
        userId: req.user.id,
        storeId: req.params.storeId,
        startsOn,
        endsOn,
        reason,
      });
      res.status(201).json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  },

  async listForStore(req, res, next) {
    try {
      const { status } = req.query;
      const requests = await TimeOffService.listForStore(req.params.storeId, status);
      res.json({ success: true, data: requests });
    } catch (err) {
      next(err);
    }
  },

  async approve(req, res, next) {
    try {
      const request = await TimeOffService.approve(req.params.requestId, req.user.id);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  },

  async deny(req, res, next) {
    try {
      const request = await TimeOffService.deny(req.params.requestId, req.user.id);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  },
};
