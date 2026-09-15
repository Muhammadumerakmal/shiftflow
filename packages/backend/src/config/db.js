import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

// Quick sanity check on startup
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Connected to Neon Postgres"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
