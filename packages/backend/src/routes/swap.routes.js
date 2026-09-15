import { Router } from "express";
import { SwapController } from "../controllers/swap.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole, requireStoreAccess } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requestSwapSchema } from "../validations/swap.validation.js";

const router = Router();

router.use(authMiddleware);

// Any logged-in staff member can request a swap on their own shift
router.post("/shifts/:shiftId/swap-request", validate(requestSwapSchema), SwapController.requestSwap);

// List swap requests for a store — e.g. ?status=manager_review
router.get("/stores/:storeId/swap-requests", requireStoreAccess, SwapController.listForStore);

// Any staff member can accept an open swap
router.post("/swap-requests/:swapId/accept", SwapController.acceptSwap);

// Only manager/owner can approve or reject
router.post(
  "/swap-requests/:swapId/approve",
  requireRole("owner", "manager"),
  SwapController.approveSwap
);
router.post(
  "/swap-requests/:swapId/reject",
  requireRole("owner", "manager"),
  SwapController.rejectSwap
);

export default router;
