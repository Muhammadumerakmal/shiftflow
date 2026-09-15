import { StoreService } from "../services/store.service.js";

export const StoreController = {
  async getStore(req, res, next) {
    try {
      const store = await StoreService.getStore(req.params.storeId);
      res.json({ success: true, data: store });
    } catch (err) {
      next(err);
    }
  },

  async updateStore(req, res, next) {
    try {
      const store = await StoreService.updateStore(req.params.storeId, req.body);
      res.json({ success: true, data: store });
    } catch (err) {
      next(err);
    }
  },

  async getStaffList(req, res, next) {
    try {
      const staff = await StoreService.getStaffList(req.params.storeId);
      res.json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  },

  async getStaffById(req, res, next) {
    try {
      const staff = await StoreService.getStaffById(req.params.storeId, req.params.staffId);
      res.json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  },

  async inviteStaff(req, res, next) {
    try {
      const { phone, fullName, position } = req.body;
      const result = await StoreService.inviteStaff({
        storeId: req.params.storeId,
        phone,
        fullName,
        position,
        invitedBy: req.user.id,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async updateStaff(req, res, next) {
    try {
      const staff = await StoreService.updateStaff(req.params.staffId, req.body);
      res.json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  },
};
