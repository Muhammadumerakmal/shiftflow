import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { env } from "./config/env.js";

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

app.get("/", (req, res) => {
  res.json({ success: true, message: "ShiftFlow API", health: "/health" });
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "ShiftFlow API is running" });
});

app.use("/api/v1", routes);

// Error handler must be last
app.use(errorHandler);

export default app;
