import { Router } from "express";
import { ShiftController } from "../controllers/shift.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { requireStoreRole, requireAnyStoreRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createShiftSchema, updateShiftSchema, publishWeekSchema } from "../validations/shift.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/stores/:storeId/shifts",
  tenantMiddleware,
  requireStoreRole("manager"),
  validate(createShiftSchema),
  ShiftController.createShift
);

router.get("/stores/:storeId/shifts", tenantMiddleware, requireAnyStoreRole(), ShiftController.getWeekSchedule);

router.post(
  "/stores/:storeId/shifts/publish",
  tenantMiddleware,
  requireStoreRole("manager"),
  validate(publishWeekSchema),
  ShiftController.publishWeek
);

router.patch("/shifts/:shiftId", requireStoreRole("manager"), validate(updateShiftSchema), ShiftController.updateShift);
router.delete("/shifts/:shiftId", requireStoreRole("manager"), ShiftController.deleteShift);

export default router;
