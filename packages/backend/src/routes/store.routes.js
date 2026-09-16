import { Router } from "express";
import { StoreController } from "../controllers/store.controller.js";
import { AiController } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { requireStoreRole, requireAnyStoreRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateStoreSchema, inviteStaffSchema, updateStaffSchema } from "../validations/store.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/:storeId", tenantMiddleware, requireAnyStoreRole(), StoreController.getStore);
router.patch("/:storeId", tenantMiddleware, requireStoreRole("manager"), validate(updateStoreSchema), StoreController.updateStore);

router.get("/:storeId/staff", tenantMiddleware, requireAnyStoreRole(), StoreController.getStaffList);
router.get("/:storeId/staff/:staffId", tenantMiddleware, requireAnyStoreRole(), StoreController.getStaffById);
router.post(
  "/:storeId/staff/invite",
  tenantMiddleware,
  requireStoreRole("manager"),
  validate(inviteStaffSchema),
  StoreController.inviteStaff
);
router.patch(
  "/:storeId/staff/:staffId",
  tenantMiddleware,
  requireStoreRole("manager"),
  validate(updateStaffSchema),
  StoreController.updateStaff
);

router.post("/:storeId/ai/chat", tenantMiddleware, requireAnyStoreRole(), AiController.chat);

export default router;
