import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireOrgRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateOrganizationSchema, createStoreSchema } from "../validations/organization.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/:orgId", OrganizationController.getOrganization);
router.patch("/:orgId", requireOrgRole("org_admin"), validate(updateOrganizationSchema), OrganizationController.updateOrganization);
router.get("/:orgId/stores", OrganizationController.listStores);
router.post("/:orgId/stores", requireOrgRole("org_admin"), validate(createStoreSchema), OrganizationController.createStore);
router.get("/:orgId/members", OrganizationController.listMembers);

export default router;
