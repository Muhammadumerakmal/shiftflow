import { pool } from "../config/db.js";

export const PushSubscriptionModel = {
  // Upsert by endpoint — a browser re-subscribing with the same endpoint just
  // refreshes its keys and owner rather than creating duplicates.
  async upsert({ userId, endpoint, p256dh, auth, userAgent }) {
    const { rows } = await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint)
       DO UPDATE SET user_id = EXCLUDED.user_id,
                     p256dh = EXCLUDED.p256dh,
                     auth = EXCLUDED.auth,
                     user_agent = EXCLUDED.user_agent
       RETURNING *`,
      [userId, endpoint, p256dh, auth, userAgent || null]
    );
    return rows[0];
  },

  async findByUser(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM push_subscriptions WHERE user_id = $1",
      [userId]
    );
    return rows;
  },

  async deleteByEndpoint(endpoint) {
    await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [
      endpoint,
    ]);
  },
};
