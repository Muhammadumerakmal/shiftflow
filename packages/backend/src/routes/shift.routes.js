import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole, requireStoreAccess } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createShiftSchema, updateShiftSchema, publishWeekSchema } from "../validations/shift.validation.js";

const router = Router();

router.use(authMiddleware);

// Create a shift (draft) for a store
router.post(
  "/stores/:storeId/shifts",
  requireRole("owner", "manager"),
  validate(createShiftSchema),
  ShiftController.createShift
);

// Get the week's schedule — e.g. /stores/:storeId/shifts?weekStart=2026-08-04
router.get("/stores/:storeId/shifts", requireStoreAccess, ShiftController.getWeekSchedule);

// Publish all draft shifts for a week
router.post(
  "/stores/:storeId/shifts/publish",
  requireRole("owner", "manager"),
  validate(publishWeekSchema),
  ShiftController.publishWeek
);

// Update or delete a single shift
router.patch("/shifts/:shiftId", requireRole("owner", "manager"), validate(updateShiftSchema), ShiftController.updateShift);
router.delete("/shifts/:shiftId", requireRole("owner", "manager"), ShiftController.deleteShift);

export default router;
