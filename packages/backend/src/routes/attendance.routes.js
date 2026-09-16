import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { requireStoreRole, requireAnyStoreRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { clockInSchema } from "../validations/attendance.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/stores/:storeId/attendance/clock-in", tenantMiddleware, requireAnyStoreRole(), validate(clockInSchema), AttendanceController.clockIn);
router.post("/stores/:storeId/attendance/clock-out", tenantMiddleware, requireAnyStoreRole(), AttendanceController.clockOut);

router.get("/stores/:storeId/attendance", tenantMiddleware, requireAnyStoreRole(), AttendanceController.listForStore);
router.get(
  "/stores/:storeId/attendance/export",
  tenantMiddleware,
  requireStoreRole("manager"),
  AttendanceController.exportCSV
);

export default router;
