import { Router } from "express";
import authRoutes from "./auth.routes.js";
import otpRoutes from "./otp.routes.js";
import storeRoutes from "./store.routes.js";
import shiftRoutes from "./shift.routes.js";
import swapRoutes from "./swap.routes.js";
import timeOffRoutes from "./timeOff.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import notificationRoutes from "./notification.routes.js";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/auth/otp", otpRoutes);
router.use("/stores", storeRoutes);
router.use("/", shiftRoutes); // shift routes define their own /stores/:storeId/shifts and /shifts/:id paths
router.use("/", swapRoutes);  // swap routes define their own /shifts/:id/swap-request and /swap-requests/:id paths
router.use("/", timeOffRoutes); // time-off routes define their own /stores/:storeId/time-off and /time-off/:id paths
router.use("/", attendanceRoutes); // attendance routes define their own /attendance/* and /stores/:storeId/attendance paths
router.use("/", notificationRoutes); // notification routes define their own /notifications/* paths
router.use("/", aiRoutes); // ai routes define their own /ai/* paths

export default router;
