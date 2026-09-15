import { StoreModel } from "../models/store.model.js";
import { UserModel } from "../models/user.model.js";
import { ActivityLogService } from "./activityLog.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const StoreService = {
  async getStore(storeId) {
    const store = await StoreModel.findById(storeId);
    if (!store) throw new AppError("Store not found", 404);
    return store;
  },

  async updateStore(storeId, updates) {
    const store = await StoreModel.update(storeId, updates);
    if (!store) throw new AppError("Store not found", 404);
    return store;
  },

  async getStaffList(storeId) {
    return StoreModel.getStaffList(storeId);
  },

  async getStaffById(storeId, staffId) {
    const staff = await StoreModel.getStaffById(storeId, staffId);
    if (!staff) throw new AppError("Staff member not found", 404);
    return staff;
  },

  async inviteStaff({ storeId, phone, fullName, position, invitedBy }) {
    // Match existing user by phone, or create a new placeholder user
    let user = await UserModel.findByPhone(phone);

    if (!user) {
      user = await UserModel.create({
        phone,
        fullName,
        email: null,
        passwordHash: null, // staff log in via OTP, not password
        role: "staff",
      });
    }

    const storeStaff = await StoreModel.linkStaff({
      storeId,
      userId: user.id,
      position,
      isManager: false,
    });

    await ActivityLogService.log({
      storeId,
      userId: invitedBy,
      action: "staff.invited",
      entityType: "store_staff",
      entityId: storeStaff.id,
      metadata: { phone, fullName, position },
    });

    // TODO (V1.1): send SMS invite with app link + OTP via Twilio
    return { user, storeStaff };
  },

  async updateStaff(storeStaffId, updates) {
    const existing = await StoreModel.findStoreStaffById(storeStaffId);
    if (!existing) throw new AppError("Staff member not found", 404);

    return StoreModel.updateStaff(storeStaffId, updates);
  },
};
