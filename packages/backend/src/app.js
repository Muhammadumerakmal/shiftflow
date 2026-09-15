import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://shiftflow-frontend-ten.vercel.app",
      "http://localhost:3000",
    ],
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
