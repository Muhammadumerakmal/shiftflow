import { InviteModel } from "../models/invite.model.js";
import { MembershipModel } from "../models/membership.model.js";
import { StoreModel } from "../models/store.model.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const InviteService = {
  async createInvite({ organizationId, invitedBy, email, orgRole, storeId, storeRole }) {
    const membership = await MembershipModel.findByOrgAndUser(organizationId, invitedBy);
    if (!membership || membership.org_role !== "org_admin") {
      throw new AppError("Access denied", 403);
    }

    const existingMember = await UserModel.findByEmail(email);
    if (existingMember) {
      const existingMembership = await MembershipModel.findByOrgAndUser(organizationId, existingMember.id);
      if (existingMembership) {
        throw new AppError("User is already a member of this organization", 409);
      }
    }

    const existingInvite = await InviteModel.findByEmailAndOrg(email, organizationId);
    if (existingInvite) {
      throw new AppError("An invite is already pending for this email", 409);
    }

    if (storeId) {
      const store = await StoreModel.findById(storeId);
      if (!store || store.organization_id !== organizationId) {
        throw new AppError("Invalid store for this organization", 400);
      }
    }

    const invite = await InviteModel.create({
      organizationId,
      storeId,
      email,
      orgRole,
      storeRole,
      invitedBy,
    });

    return invite;
  },

  async acceptInvite({ token, userId }) {
    const invite = await InviteModel.findByToken(token);
    if (!invite) {
      throw new AppError("Invalid or expired invite", 404);
    }

    if (invite.accepted_at) {
      throw new AppError("This invite has already been accepted", 409);
    }

    if (new Date(invite.expires_at) < new Date()) {
      throw new AppError("This invite has expired", 410);
    }

    let user;
    if (userId) {
      user = await UserModel.findById(userId);
    } else {
      user = await UserModel.findByEmail(invite.email);
    }

    if (!user) {
      throw new AppError("User not found. Please register first.", 404);
    }

    const existingMembership = await MembershipModel.findByOrgAndUser(invite.organization_id, user.id);
    if (!existingMembership) {
      await MembershipModel.create({
        organizationId: invite.organization_id,
        userId: user.id,
        orgRole: invite.org_role,
      });
    }

    if (invite.store_id && invite.store_role) {
      const existingStaff = await StoreModel.findStaffByUserIdAndOrg(user.id, invite.organization_id);
      const alreadyInStore = existingStaff.some((s) => s.store_id === invite.store_id);
      if (!alreadyInStore) {
        await StoreModel.linkStaff({
          storeId: invite.store_id,
          userId: user.id,
          role: invite.store_role,
        });
      }
    }

    await InviteModel.markAccepted(invite.id);

    return {
      organization: { id: invite.organization_id, name: invite.organization_name },
      store: invite.store_id ? { id: invite.store_id, name: invite.store_name } : null,
      orgRole: invite.org_role,
      storeRole: invite.store_role,
    };
  },

  async listPending(organizationId, userId) {
    const membership = await MembershipModel.findByOrgAndUser(organizationId, userId);
    if (!membership || membership.org_role !== "org_admin") {
      throw new AppError("Access denied", 403);
    }

    return InviteModel.listPending(organizationId);
  },

  async revokeInvite({ inviteId, organizationId, userId }) {
    const membership = await MembershipModel.findByOrgAndUser(organizationId, userId);
    if (!membership || membership.org_role !== "org_admin") {
      throw new AppError("Access denied", 403);
    }

    const revoked = await InviteModel.revoke(inviteId);
    if (!revoked) {
      throw new AppError("Invite not found or already processed", 404);
    }

    return { id: inviteId };
  },
};
