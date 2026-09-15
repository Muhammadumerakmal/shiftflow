import { UserModel } from "../models/user.model.js";
import { StoreModel } from "../models/store.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
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

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },
};
