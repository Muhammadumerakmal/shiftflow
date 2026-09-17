import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async registerOrganization(req, res, next) {
    try {
      const { email, password, fullName, orgName, storeName } = req.body;
      const result = await AuthService.registerOrganization({
        email,
        password,
        fullName,
        orgName,
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
      const result = await AuthService.login({
        email,
        password,
        meta: { userAgent: req.get("user-agent") },
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const result = await AuthService.me(req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async switchOrganization(req, res, next) {
    try {
      const { organizationId } = req.body;
      const result = await AuthService.switchOrganization(req.user.id, organizationId);
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
