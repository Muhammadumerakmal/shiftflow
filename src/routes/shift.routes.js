import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/storeAccess.middleware.js";

const router = Router();

router.use(authMiddleware);

// Create a shift (draft) for a store
router.post(
  "/stores/:storeId/shifts",
  requireRole("owner", "manager"),
  ShiftController.createShift
);

// Get the week's schedule — e.g. /stores/:storeId/shifts?weekStart=2026-08-04
router.get("/stores/:storeId/shifts", ShiftController.getWeekSchedule);

// Publish all draft shifts for a week
router.post(
  "/stores/:storeId/shifts/publish",
  requireRole("owner", "manager"),
  ShiftController.publishWeek
);

// Update or delete a single shift
router.patch("/shifts/:shiftId", requireRole("owner", "manager"), ShiftController.updateShift);
router.delete("/shifts/:shiftId", requireRole("owner", "manager"), ShiftController.deleteShift);

export default router;
