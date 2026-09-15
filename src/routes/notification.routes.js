import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// ?unread=true to filter only unread
router.get("/notifications", NotificationController.listForUser);
router.patch("/notifications/:notificationId/read", NotificationController.markRead);

export default router;
