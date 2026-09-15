import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole, requireStoreAccess } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { clockInSchema } from "../validations/attendance.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/attendance/clock-in", validate(clockInSchema), AttendanceController.clockIn);
router.post("/attendance/clock-out", AttendanceController.clockOut);

router.get("/stores/:storeId/attendance", requireStoreAccess, AttendanceController.listForStore);
router.get(
  "/stores/:storeId/attendance/export",
  requireRole("owner", "manager"),
  AttendanceController.exportCSV
);

export default router;
