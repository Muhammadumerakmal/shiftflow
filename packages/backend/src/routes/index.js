import { Router } from "express";
import authRoutes from "./auth.routes.js";
import otpRoutes from "./otp.routes.js";
import organizationRoutes from "./organization.routes.js";
import inviteRoutes from "./invite.routes.js";
import storeRoutes from "./store.routes.js";
import shiftRoutes from "./shift.routes.js";
import swapRoutes from "./swap.routes.js";
import timeOffRoutes from "./timeOff.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import notificationRoutes from "./notification.routes.js";
import pushRoutes from "./push.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/auth/otp", otpRoutes);
router.use("/organizations", organizationRoutes);
router.use("/invites", inviteRoutes);
router.use("/stores", storeRoutes);
router.use("/", shiftRoutes);
router.use("/", swapRoutes);
router.use("/", timeOffRoutes);
router.use("/", attendanceRoutes);
router.use("/", notificationRoutes);
router.use("/", pushRoutes);

export default router;
