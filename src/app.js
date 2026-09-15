import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, message: "ShiftFlow API is running" });
});

app.use("/api/v1", routes);

// Error handler must be last
app.use(errorHandler);

export default app;
