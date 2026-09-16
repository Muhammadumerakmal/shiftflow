import pg from "pg";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

pool
  .query("SELECT NOW()")
  .then(() => logger.info("Connected to Neon Postgres"))
  .catch((err) => {
    logger.error({ err }, "Database connection failed");
    process.exit(1);
  });
