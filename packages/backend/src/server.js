import { env } from "./config/env.js";
import { initSentry } from "./utils/sentry.js";
import "./config/db.js"; // establishes connection on startup
import app from "./app.js";
import { logger } from "./utils/logger.js";

initSentry();

app.listen(env.port, () => {
  logger.info({ port: env.port }, `ShiftFlow API running on http://localhost:${env.port}`);
});
