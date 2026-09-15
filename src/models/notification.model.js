import { pool } from "../config/db.js";

export const NotificationModel = {
  async create({ userId, type, title, body, link }) {
    const { rows } = await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link, is_read)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING *`,
      [userId, type, title, body, link || null]
    );
    return rows[0];
  },

  async findByUser(userId, unreadOnly) {
    const params = [userId];
    let filter = "";
    if (unreadOnly) {
      filter = "AND is_read = false";
    }

    const { rows } = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ${filter}
       ORDER BY created_at DESC
       LIMIT 50`,
      params
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM notifications WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  async markRead(id) {
    const { rows } = await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },
};
