import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = express();

const isProd = env.nodeEnv === "production";

const configuredOrigins = env.allowedOrigins || [
  "https://shiftflow-frontend-ten.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!isProd) return callback(null, true);
      if (!origin || configuredOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ success: true, message: "ShiftFlow API", health: "/health" });
});

app.get("/health", (req, res) => {
  // External uptime monitors (UptimeRobot, Render health checks, etc.) should ping this endpoint.
  // Expected: 200 OK with { success: true }. Any other response = downtime alert.
  res.json({
    success: true,
    message: "ShiftFlow API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/v1", routes);

// Error handler must be last
app.use(errorHandler);

logger.info({ port: env.port, env: env.nodeEnv }, "ShiftFlow API initialized");

export default app;
