import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async me(req, res, next) {
    try {
      const result = await AuthService.me(req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const { email, password, fullName, storeName } = req.body;
      const result = await AuthService.register({
        email,
        password,
        fullName,
        storeName,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refresh(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
