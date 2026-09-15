import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/storeAccess.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/attendance/clock-in", AttendanceController.clockIn);
router.post("/attendance/clock-out", AttendanceController.clockOut);

router.get("/stores/:storeId/attendance", AttendanceController.listForStore);
router.get(
  "/stores/:storeId/attendance/export",
  requireRole("owner", "manager"),
  AttendanceController.exportCSV
);

export default router;
