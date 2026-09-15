import { Router } from "express";
import { OtpController } from "../controllers/otp.controller.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

const otpRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/request", otpRateLimit, OtpController.requestOtp);
router.post("/verify", otpRateLimit, OtpController.verifyOtp);

export default router;
