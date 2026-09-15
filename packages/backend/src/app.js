import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

const allowedOrigins = [
  "https://shiftflow-frontend-ten.vercel.app",
  "https://shiftflow-frontend-iu8a2y5wu-umers-projects-4a9a6027.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
