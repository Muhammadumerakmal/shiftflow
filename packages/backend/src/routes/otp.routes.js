import { Router } from "express";
import { OtpController } from "../controllers/otp.controller.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

const otpRequestRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, keyType: "phone" });
const otpVerifyRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/request", otpRequestRateLimit, OtpController.requestOtp);
router.post("/verify", otpVerifyRateLimit, OtpController.verifyOtp);

export default router;
