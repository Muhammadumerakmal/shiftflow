import { PushService } from "../services/push.service.js";
import { env } from "../config/env.js";

export const PushController = {
  // Public — the client needs this key to create a subscription.
  getPublicKey(req, res) {
    res.json({ success: true, data: { publicKey: env.vapid.publicKey } });
  },

  async subscribe(req, res, next) {
    try {
      const { subscription } = req.body || {};
      const saved = await PushService.subscribe({
        userId: req.user.id,
        subscription,
        userAgent: req.get("user-agent"),
      });
      res.status(201).json({ success: true, data: { id: saved.id } });
    } catch (err) {
      next(err);
    }
  },

  async unsubscribe(req, res, next) {
    try {
      const { endpoint } = req.body || {};
      await PushService.unsubscribe(endpoint);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
