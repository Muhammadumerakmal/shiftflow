import { Router } from "express";
import { StoreController } from "../controllers/store.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole, requireStoreAccess } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateStoreSchema, inviteStaffSchema, updateStaffSchema } from "../validations/store.validation.js";

const router = Router();

// All store routes require a logged-in user
router.use(authMiddleware);

router.get("/:storeId", requireStoreAccess, StoreController.getStore);
router.patch("/:storeId", requireRole("owner", "manager"), validate(updateStoreSchema), StoreController.updateStore);

router.get("/:storeId/staff", requireStoreAccess, StoreController.getStaffList);
router.post(
  "/:storeId/staff/invite",
  requireRole("owner", "manager"),
  validate(inviteStaffSchema),
  StoreController.inviteStaff
);
router.patch(
  "/:storeId/staff/:staffId",
  requireRole("owner", "manager"),
  validate(updateStaffSchema),
  StoreController.updateStaff
);

export default router;
