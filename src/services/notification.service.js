import { NotificationModel } from "../models/notification.model.js";
import { UserModel } from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

export const NotificationService = {
  // Shared helper — other services (shift, swap, timeoff) call this.
  // Creates an in-app notification and (if the user has an email) sends an email too.
  async notify({ userId, type, title, body, link }) {
    const notification = await NotificationModel.create({ userId, type, title, body, link });

    const user = await UserModel.findById(userId);
    if (user?.email) {
      await sendEmail({ to: user.email, subject: title, text: body });
    }

    return notification;
  },

  async listForUser(userId, unreadOnly) {
    return NotificationModel.findByUser(userId, unreadOnly);
  },

  async markRead(notificationId, requestingUserId) {
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) throw new AppError("Notification not found", 404);

    if (notification.user_id !== requestingUserId) {
      throw new AppError("You cannot mark someone else's notification as read", 403);
    }

    return NotificationModel.markRead(notificationId);
  },
};
