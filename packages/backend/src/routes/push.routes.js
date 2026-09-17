import { Router } from "express";
import { PushController } from "../controllers/push.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Public — client fetches the VAPID public key before subscribing.
router.get("/push/public-key", PushController.getPublicKey);

// Authenticated — register / remove this device's push subscription.
router.post("/push/subscribe", authMiddleware, PushController.subscribe);
router.post("/push/unsubscribe", authMiddleware, PushController.unsubscribe);

export default router;
