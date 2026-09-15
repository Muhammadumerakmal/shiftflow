import { Router } from "express";
import { TimeOffController } from "../controllers/timeOff.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/storeAccess.middleware.js";

const router = Router();

router.use(authMiddleware);

// Any logged-in staff member can request time off
router.post("/stores/:storeId/time-off", TimeOffController.requestTimeOff);

// List requests for a store — e.g. ?status=pending
router.get("/stores/:storeId/time-off", TimeOffController.listForStore);

// Only manager/owner can approve or deny
router.patch(
  "/time-off/:requestId/approve",
  requireRole("owner", "manager"),
  TimeOffController.approve
);
router.patch(
  "/time-off/:requestId/deny",
  requireRole("owner", "manager"),
  TimeOffController.deny
);

export default router;
