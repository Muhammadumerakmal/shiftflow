import { Router } from "express";
import { TimeOffController } from "../controllers/timeOff.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { requireStoreRole, requireAnyStoreRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requestTimeOffSchema } from "../validations/timeOff.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/stores/:storeId/time-off", tenantMiddleware, requireAnyStoreRole(), validate(requestTimeOffSchema), TimeOffController.requestTimeOff);

router.get("/stores/:storeId/time-off", tenantMiddleware, requireAnyStoreRole(), TimeOffController.listForStore);

router.patch(
  "/time-off/:requestId/approve",
  requireStoreRole("manager"),
  TimeOffController.approve
);
router.patch(
  "/time-off/:requestId/deny",
  requireStoreRole("manager"),
  TimeOffController.deny
);

export default router;
