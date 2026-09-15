import { SwapService } from "../services/swap.service.js";

export const SwapController = {
  async requestSwap(req, res, next) {
    try {
      const { offeredTo, reason } = req.body;
      const swap = await SwapService.requestSwap({
        shiftId: req.params.shiftId,
        requestedBy: req.user.id,
        offeredTo,
        reason,
      });
      res.status(201).json({ success: true, data: swap });
    } catch (err) {
      next(err);
    }
  },

  async listForStore(req, res, next) {
    try {
      const { status } = req.query;
      const swaps = await SwapService.listForStore(req.params.storeId, status);
      res.json({ success: true, data: swaps });
    } catch (err) {
      next(err);
    }
  },

  async acceptSwap(req, res, next) {
    try {
      const swap = await SwapService.acceptSwap(req.params.swapId, req.user.id);
      res.json({ success: true, data: swap });
    } catch (err) {
      next(err);
    }
  },

  async approveSwap(req, res, next) {
    try {
      const swap = await SwapService.approveSwap(req.params.swapId, req.user.id);
      res.json({ success: true, data: swap });
    } catch (err) {
      next(err);
    }
  },

  async rejectSwap(req, res, next) {
    try {
      const swap = await SwapService.rejectSwap(req.params.swapId, req.user.id);
      res.json({ success: true, data: swap });
    } catch (err) {
      next(err);
    }
  },
};
