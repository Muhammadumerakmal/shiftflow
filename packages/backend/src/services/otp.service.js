import { UserModel } from "../models/user.model.js";
import { StoreModel } from "../models/store.model.js";
import { MembershipModel } from "../models/membership.model.js";
import { signAccessToken, signRefreshToken, buildAccessPayload } from "../utils/jwt.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

const otpStore = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const OtpService = {
  async requestOtp(phone) {
    if (!phone) {
      throw new AppError("Phone number is required", 400);
    }

    const user = await UserModel.findByPhone(phone);
    if (!user) {
      throw new AppError("No account found with this phone number", 404);
    }

    const memberships = await MembershipModel.listByUserId(user.id);
    if (memberships.length === 0) {
      throw new AppError("This phone number is not linked to any organization", 404);
    }

    const orgContext = user.default_organization_id
      ? memberships.find((m) => m.organization_id === user.default_organization_id)
      : memberships[0];

    const storeRoles = {};
    if (orgContext) {
      const staffRecords = await StoreModel.findStaffByUserIdAndOrg(user.id, orgContext.organization_id);
      for (const record of staffRecords) {
        storeRoles[record.store_id] = record.role;
      }
    }

    const code = generateOtp();
    otpStore.set(phone, {
      code,
      userId: user.id,
      organizationId: orgContext?.organization_id,
      orgRole: orgContext?.org_role,
      storeRoles,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`[OTP] Code for ${phone}: ${code} (expires in 5 minutes)`);

    return { message: "OTP sent", phone };
  },

  async verifyOtp(phone, code) {
    if (!phone || !code) {
      throw new AppError("Phone and code are required", 400);
    }

    const entry = otpStore.get(phone);
    if (!entry) {
      throw new AppError("No OTP request found for this phone number", 404);
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(phone);
      throw new AppError("OTP has expired. Please request a new code", 410);
    }

    if (entry.code !== code) {
      throw new AppError("Invalid OTP code", 401);
    }

    otpStore.delete(phone);

    const user = await UserModel.findById(entry.userId);
    if (!user) {
      throw new AppError("User account not found", 404);
    }

    const accessToken = signAccessToken(
      buildAccessPayload({
        userId: user.id,
        organizationId: entry.organizationId,
        orgRole: entry.orgRole,
        storeRoles: entry.storeRoles,
      })
    );
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    };
  },
};
