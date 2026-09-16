import { Router } from "express";
import { SwapController } from "../controllers/swap.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { requireStoreRole, requireAnyStoreRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requestSwapSchema } from "../validations/swap.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/stores/:storeId/swap-request", tenantMiddleware, requireAnyStoreRole(), validate(requestSwapSchema), SwapController.requestSwap);

router.get("/stores/:storeId/swap-requests", tenantMiddleware, requireAnyStoreRole(), SwapController.listForStore);

router.post("/swap-requests/:swapId/accept", SwapController.acceptSwap);

router.post(
  "/swap-requests/:swapId/approve",
  requireStoreRole("manager"),
  SwapController.approveSwap
);
router.post(
  "/swap-requests/:swapId/reject",
  requireStoreRole("manager"),
  SwapController.rejectSwap
);

export default router;
