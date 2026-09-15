import { SwapModel } from "../models/swap.model.js";
import { ShiftModel } from "../models/shift.model.js";
import { ActivityLogService } from "./activityLog.service.js";
import { NotificationService } from "./notification.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

// State machine:
// open -> accepted -> manager_review -> approved
//                                     -> rejected
// open -> cancelled (requester cancels before anyone accepts)

export const SwapService = {
  async requestSwap({ shiftId, requestedBy, offeredTo, reason }) {
    const shift = await ShiftModel.findById(shiftId);
    if (!shift) throw new AppError("Shift not found", 404);

    if (shift.user_id !== requestedBy) {
      throw new AppError("You can only request a swap for your own shift", 403);
    }

    const swap = await SwapModel.create({ shiftId, requestedBy, offeredTo, reason });

    await ActivityLogService.log({
      storeId: shift.store_id,
      userId: requestedBy,
      action: "swap.requested",
      entityType: "shift_swap_request",
      entityId: swap.id,
    });

    // Notify the offered-to user, or broadcast to all store staff if open to all
    if (swap.offered_to) {
      await NotificationService.notify({
        userId: swap.offered_to,
        type: "swap_request",
        title: "New swap request",
        body: `A colleague has requested to swap a shift with you.`,
      }).catch(() => {});
    }

    return swap;
  },

  async listForStore(storeId, status) {
    return SwapModel.findByStore(storeId, status);
  },

  // A staff member accepts an open swap — moves it to manager_review
  async acceptSwap(swapId, acceptedBy) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new AppError("Swap request not found", 404);

    if (swap.status !== "open") {
      throw new AppError(`Cannot accept a swap with status "${swap.status}"`, 409);
    }

    if (swap.requested_by === acceptedBy) {
      throw new AppError("You cannot accept your own swap request", 400);
    }

    const updated = await SwapModel.update(swapId, {
      status: "manager_review",
      acceptedBy,
    });

    const shift = await ShiftModel.findById(swap.shift_id);
    await ActivityLogService.log({
      storeId: shift.store_id,
      userId: acceptedBy,
      action: "swap.accepted",
      entityType: "shift_swap_request",
      entityId: swapId,
    });

    return updated;
  },

  // Manager approves — reassign the shift to the accepting staff member
  async approveSwap(swapId, approvedBy) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new AppError("Swap request not found", 404);

    if (swap.status !== "manager_review") {
      throw new AppError(
        `Cannot approve a swap with status "${swap.status}" — it must be in manager_review`,
        409
      );
    }

    // Reassign the shift to the accepting staff member
    await ShiftModel.update(swap.shift_id, { userId: swap.accepted_by });

    const updated = await SwapModel.update(swapId, {
      status: "approved",
      resolvedAt: new Date().toISOString(),
    });

    const shift = await ShiftModel.findById(swap.shift_id);
    await ActivityLogService.log({
      storeId: shift.store_id,
      userId: approvedBy,
      action: "swap.approved",
      entityType: "shift_swap_request",
      entityId: swapId,
    });

    await NotificationService.notify({
      userId: swap.requested_by,
      type: "swap_resolved",
      title: "Your swap request was approved",
      body: `Your shift swap request has been approved.`,
    });
    await NotificationService.notify({
      userId: swap.accepted_by,
      type: "swap_resolved",
      title: "You're covering a shift",
      body: `You've been assigned the shift you agreed to cover.`,
    });

    return updated;
  },

  async rejectSwap(swapId, rejectedBy) {
    const swap = await SwapModel.findById(swapId);
    if (!swap) throw new AppError("Swap request not found", 404);

    if (!["open", "accepted", "manager_review"].includes(swap.status)) {
      throw new AppError(`Cannot reject a swap with status "${swap.status}"`, 409);
    }

    const updated = await SwapModel.update(swapId, {
      status: "rejected",
      resolvedAt: new Date().toISOString(),
    });

    const shift = await ShiftModel.findById(swap.shift_id);
    await ActivityLogService.log({
      storeId: shift.store_id,
      userId: rejectedBy,
      action: "swap.rejected",
      entityType: "shift_swap_request",
      entityId: swapId,
    });

    await NotificationService.notify({
      userId: swap.requested_by,
      type: "swap_resolved",
      title: "Your swap request was rejected",
      body: `Your shift swap request was not approved.`,
    });

    return updated;
  },
};
