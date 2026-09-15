import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// POST /api/ai/chat  { message: string, history?: [{ role, text }] }
router.post("/ai/chat", AiController.chat);

export default router;
