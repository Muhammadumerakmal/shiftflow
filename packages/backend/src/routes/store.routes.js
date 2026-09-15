import { Router } from "express";
import { StoreController } from "../controllers/store.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/storeAccess.middleware.js";

const router = Router();

// All store routes require a logged-in user
router.use(authMiddleware);

router.get("/:storeId", StoreController.getStore);
router.patch("/:storeId", requireRole("owner", "manager"), StoreController.updateStore);

router.get("/:storeId/staff", StoreController.getStaffList);
router.post(
  "/:storeId/staff/invite",
  requireRole("owner", "manager"),
  StoreController.inviteStaff
);
router.patch(
  "/:storeId/staff/:staffId",
  requireRole("owner", "manager"),
  StoreController.updateStaff
);

export default router;
