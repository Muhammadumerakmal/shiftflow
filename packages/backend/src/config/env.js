import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : null,
  sentryDsn: process.env.SENTRY_DSN || null,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || null,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    fromAddress: process.env.SMTP_FROM || "ShiftFlow <no-reply@shiftflow.app>",
  },
};

// Fail fast only when running locally, not on Vercel serverless
if (!process.env.VERCEL) {
  const required = ["databaseUrl", "jwtAccessSecret", "jwtRefreshSecret"];
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable for: ${key}`);
    }
  }
}
