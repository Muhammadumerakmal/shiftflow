import { env } from "./config/env.js";
import "./config/db.js"; // establishes connection on startup
import app from "./app.js";

app.listen(env.port, () => {
  console.log(`🚀 ShiftFlow API running on http://localhost:${env.port}`);
});
