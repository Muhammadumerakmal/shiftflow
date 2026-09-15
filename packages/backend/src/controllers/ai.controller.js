import { agentChat } from "../services/agent.service.js";

export const AiController = {
  async chat(req, res, next) {
    try {
      const { message, history } = req.body || {};
      const storeId = req.params.storeId;
      const reply = await agentChat({
        message,
        history,
        storeId,
        userId: req.user.id,
      });
      res.json({ success: true, data: { reply } });
    } catch (err) {
      next(err);
    }
  },
};
