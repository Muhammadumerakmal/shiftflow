import { InviteService } from "../services/invite.service.js";

export const InviteController = {
  async createInvite(req, res, next) {
    try {
      const { email, orgRole, storeId, storeRole } = req.body;
      const invite = await InviteService.createInvite({
        organizationId: req.params.orgId,
        invitedBy: req.user.id,
        email,
        orgRole,
        storeId,
        storeRole,
      });
      res.status(201).json({ success: true, data: invite });
    } catch (err) {
      next(err);
    }
  },

  async acceptInvite(req, res, next) {
    try {
      const { token } = req.body;
      const result = await InviteService.acceptInvite({
        token,
        userId: req.user?.id || null,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async listPending(req, res, next) {
    try {
      const invites = await InviteService.listPending(req.params.orgId, req.user.id);
      res.json({ success: true, data: invites });
    } catch (err) {
      next(err);
    }
  },

  async revokeInvite(req, res, next) {
    try {
      const result = await InviteService.revokeInvite({
        inviteId: req.params.inviteId,
        organizationId: req.params.orgId,
        userId: req.user.id,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
