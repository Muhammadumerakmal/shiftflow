import { NotificationService } from "../services/notification.service.js";

export const NotificationController = {
  async listForUser(req, res, next) {
    try {
      const unreadOnly = req.query.unread === "true";
      const notifications = await NotificationService.listForUser(req.user.id, unreadOnly);
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      const notification = await NotificationService.markRead(
        req.params.notificationId,
        req.user.id
      );
      res.json({ success: true, data: notification });
    } catch (err) {
      next(err);
    }
  },
};
