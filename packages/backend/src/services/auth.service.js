import { UserModel } from "../models/user.model.js";
import { StoreModel } from "../models/store.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const AuthService = {
  async register({ email, password, fullName, storeName }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await UserModel.create({
      email,
      fullName,
      passwordHash,
      role: "owner",
    });

    const store = await StoreModel.create({ name: storeName });
    await StoreModel.linkStaff({
      storeId: store.id,
      userId: user.id,
      isManager: true,
    });

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
      storeId: store.id,
    });
    const refreshToken = signRefreshToken({ id: user.id });

    return { user, store, accessToken, refreshToken };
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Look up the user's store membership to include storeId in the token
    const storeStaff = await StoreModel.findStaffByUserId(user.id);
    const storeId = storeStaff?.store_id || null;

    const accessToken = signAccessToken({ id: user.id, role: user.role, storeId });
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        storeId,
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
    const store = await StoreModel.findStoreByUserId(userId);
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatar_url,
      storeId: store?.id || null,
      storeName: store?.name || null,
    };
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

    const storeStaff = await StoreModel.findStaffByUserId(user.id);
    const storeId = storeStaff?.store_id || null;

    const newAccessToken = signAccessToken({ id: user.id, role: user.role, storeId });
    const newRefreshToken = signRefreshToken({ id: user.id });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
};
