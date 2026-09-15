import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";
import { registerSchema, loginSchema, refreshSchema } from "../validations/auth.validation.js";

const router = Router();

const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.get("/me", authMiddleware, AuthController.me);
router.post("/register", authRateLimit, validate(registerSchema), AuthController.register);
router.post("/login", authRateLimit, validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshSchema), AuthController.refresh);

export default router;
