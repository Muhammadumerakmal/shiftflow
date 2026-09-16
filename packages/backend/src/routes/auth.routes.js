import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";
import {
  registerOrganizationSchema,
  loginSchema,
  switchOrganizationSchema,
  refreshSchema,
} from "../validations/auth.validation.js";

const router = Router();

const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const orgCreateRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });
const switchOrgRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyType: "user" });

router.get("/me", authMiddleware, AuthController.me);
router.post("/register-organization", orgCreateRateLimit, validate(registerOrganizationSchema), AuthController.registerOrganization);
router.post("/login", authRateLimit, validate(loginSchema), AuthController.login);
router.post("/switch-organization", authMiddleware, switchOrgRateLimit, validate(switchOrganizationSchema), AuthController.switchOrganization);
router.post("/refresh", validate(refreshSchema), AuthController.refresh);

export default router;
