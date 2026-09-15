import { UserModel } from "../models/user.model.js";
import { StoreModel } from "../models/store.model.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

// TODO: Replace with Redis in V1.1 per SAD document
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

    const storeStaff = await StoreModel.findStaffByUserId(user.id);
    if (!storeStaff) {
      throw new AppError("This phone number is not linked to any store", 404);
    }

    const code = generateOtp();
    otpStore.set(phone, {
      code,
      userId: user.id,
      storeId: storeStaff.store_id,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // TODO: Send via Twilio in V1.1 — for now, log to console
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

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
      storeId: entry.storeId,
    });
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        storeId: entry.storeId,
      },
      accessToken,
      refreshToken,
    };
  },
};
