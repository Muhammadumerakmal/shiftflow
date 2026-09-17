import { UserModel } from "../models/user.model.js";
import { StoreModel } from "../models/store.model.js";
import { OrganizationModel } from "../models/organization.model.js";
import { MembershipModel } from "../models/membership.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, buildAccessPayload } from "../utils/jwt.js";
import { PushService } from "./push.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

// Turn a raw User-Agent into a short human label for the sign-in alert.
function shortDevice(ua = "") {
  if (/Android/i.test(ua)) return "an Android device";
  if (/iPhone|iPad|iPod/i.test(ua)) return "an iOS device";
  if (/Windows/i.test(ua)) return "a Windows device";
  if (/Macintosh|Mac OS/i.test(ua)) return "a Mac";
  if (/Linux/i.test(ua)) return "a Linux device";
  return "a new device";
}

async function buildStoreRoles(userId, organizationId) {
  const staffRecords = await StoreModel.findStaffByUserIdAndOrg(userId, organizationId);
  const storeRoles = {};
  for (const record of staffRecords) {
    storeRoles[record.store_id] = record.role;
  }
  return storeRoles;
}

export const AuthService = {
  async registerOrganization({ email, password, fullName, orgName, storeName }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await UserModel.create({
      email,
      fullName,
      passwordHash,
    });

    const slug = await OrganizationModel.generateUniqueSlug(orgName);
    const organization = await OrganizationModel.create({ name: orgName, slug });

    await MembershipModel.create({
      organizationId: organization.id,
      userId: user.id,
      orgRole: "org_admin",
    });

    const store = await StoreModel.create({
      organizationId: organization.id,
      name: storeName,
    });

    await StoreModel.linkStaff({
      storeId: store.id,
      userId: user.id,
      role: "manager",
      position: "Owner",
    });

    await UserModel.updateDefaultOrg(user.id, organization.id);

    const storeRoles = { [store.id]: "manager" };

    const accessToken = signAccessToken(
      buildAccessPayload({
        userId: user.id,
        organizationId: organization.id,
        orgRole: "org_admin",
        storeRoles,
      })
    );
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
      organization,
      store,
      accessToken,
      refreshToken,
    };
  },

  async login({ email, password, meta }) {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Fire a "new sign-in" Web Push to the user's already-registered devices
    // (best-effort — first-ever login has no devices yet, so nothing sends).
    const when = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    const device = meta?.userAgent ? ` from ${shortDevice(meta.userAgent)}` : "";
    PushService.sendToUser(user.id, {
      title: "New sign-in to ShiftFlow",
      body: `Your account was just signed in${device} at ${when}.`,
      url: "/settings",
    }).catch(() => {});

    const memberships = await MembershipModel.listByUserId(user.id);
    if (memberships.length === 0) {
      throw new AppError("No organization memberships found", 403);
    }

    let orgContext;
    if (user.default_organization_id) {
      orgContext = memberships.find((m) => m.organization_id === user.default_organization_id);
    }
    if (!orgContext) {
      orgContext = memberships[0];
    }

    const storeRoles = await buildStoreRoles(user.id, orgContext.organization_id);

    const accessToken = signAccessToken(
      buildAccessPayload({
        userId: user.id,
        organizationId: orgContext.organization_id,
        orgRole: orgContext.org_role,
        storeRoles,
      })
    );
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatar_url,
      },
      organizations: memberships.map((m) => ({
        id: m.organization_id,
        name: m.organization_name,
        slug: m.slug,
        role: m.org_role,
      })),
      activeOrganization: {
        id: orgContext.organization_id,
        name: orgContext.organization_name,
        slug: orgContext.slug,
        role: orgContext.org_role,
      },
      accessToken,
      refreshToken,
    };
  },

  async me(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const memberships = await MembershipModel.listByUserId(userId);

    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      organizations: memberships.map((m) => ({
        id: m.organization_id,
        name: m.organization_name,
        slug: m.slug,
        role: m.org_role,
      })),
    };
  },

  async switchOrganization(userId, organizationId) {
    const membership = await MembershipModel.findByOrgAndUser(organizationId, userId);
    if (!membership) {
      throw new AppError("Access denied", 403);
    }

    await UserModel.updateDefaultOrg(userId, organizationId);

    const storeRoles = await buildStoreRoles(userId, organizationId);

    const accessToken = signAccessToken(
      buildAccessPayload({
        userId,
        organizationId,
        orgRole: membership.org_role,
        storeRoles,
      })
    );
    const refreshToken = signRefreshToken({ id: userId });

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    const memberships = await MembershipModel.listByUserId(user.id);
    if (memberships.length === 0) {
      throw new AppError("No organization memberships found", 403);
    }

    let orgContext;
    if (user.default_organization_id) {
      orgContext = memberships.find((m) => m.organization_id === user.default_organization_id);
    }
    if (!orgContext) {
      orgContext = memberships[0];
    }

    const storeRoles = await buildStoreRoles(user.id, orgContext.organization_id);

    const newAccessToken = signAccessToken(
      buildAccessPayload({
        userId: user.id,
        organizationId: orgContext.organization_id,
        orgRole: orgContext.org_role,
        storeRoles,
      })
    );
    const newRefreshToken = signRefreshToken({ id: user.id });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
};
