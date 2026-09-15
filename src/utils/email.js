import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

if (env.smtp.host && env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export async function sendEmail({ to, subject, text }) {
  if (!transporter || !to) {
    // SMTP not configured (or user has no email, e.g. staff invited by phone only) —
    // skip silently rather than breaking the calling flow. In-app notification still gets created.
    console.log(`[email skipped] to=${to || "none"} subject="${subject}"`);
    return { skipped: true };
  }

  try {
    await transporter.sendMail({
      from: env.smtp.fromAddress,
      to,
      subject,
      text,
    });
    return { skipped: false };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { skipped: true, error: err.message };
  }
}
