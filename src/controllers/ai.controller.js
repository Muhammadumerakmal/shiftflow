import { chatWithGemini } from "../services/ai.service.js";

export const AiController = {
  async chat(req, res, next) {
    try {
      const { message, history } = req.body || {};
      const reply = await chatWithGemini({ message, history, userId: req.user.id });
      res.json({ success: true, data: { reply } });
    } catch (err) {
      next(err);
    }
  },
};
