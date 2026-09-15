import { OtpService } from "../services/otp.service.js";

export const OtpController = {
  async requestOtp(req, res, next) {
    try {
      const { phone } = req.body;
      const result = await OtpService.requestOtp(phone);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req, res, next) {
    try {
      const { phone, code } = req.body;
      const result = await OtpService.verifyOtp(phone, code);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
