import { Router } from "express";
import { InviteController } from "../controllers/invite.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireOrgRole } from "../middleware/storeAccess.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createInviteSchema, acceptInviteSchema } from "../validations/invite.validation.js";

const router = Router();

router.post("/accept", validate(acceptInviteSchema), InviteController.acceptInvite);

router.use(authMiddleware);

router.get("/:orgId/invites", requireOrgRole("org_admin"), InviteController.listPending);
router.post("/:orgId/invites", requireOrgRole("org_admin"), validate(createInviteSchema), InviteController.createInvite);
router.delete("/:orgId/invites/:inviteId", requireOrgRole("org_admin"), InviteController.revokeInvite);

export default router;
