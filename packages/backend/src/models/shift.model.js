import { pool } from "../config/db.js";

export const ShiftModel = {
  async create({ storeId, userId, startsAt, endsAt, position, status, notes, createdBy }) {
    const { rows } = await pool.query(
      `INSERT INTO shifts (store_id, user_id, starts_at, ends_at, position, status, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [storeId, userId, startsAt, endsAt, position, status || "draft", notes, createdBy]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM shifts WHERE id = $1", [id]);
    return rows[0] || null;
  },

  // Get all shifts for a store within a date range (used for week view)
  async findByStoreAndRange(storeId, weekStart, weekEnd) {
    const { rows } = await pool.query(
      `SELECT s.*, u.full_name AS staff_name
       FROM shifts s
       LEFT JOIN users u ON u.id = s.user_id
       WHERE s.store_id = $1
         AND s.starts_at >= $2
         AND s.starts_at < $3
         AND s.status != 'cancelled'
       ORDER BY s.starts_at ASC`,
      [storeId, weekStart, weekEnd]
    );
    return rows;
  },

  // Get a user's own upcoming published shifts (for the AI assistant / "my schedule" views)
  async findUpcomingByUser(userId, limit = 10) {
    const { rows } = await pool.query(
      `SELECT s.*, st.name AS store_name
       FROM shifts s
       LEFT JOIN stores st ON st.id = s.store_id
       WHERE s.user_id = $1
         AND s.status = 'published'
         AND s.ends_at >= now()
       ORDER BY s.starts_at ASC
       LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },

  // Check if this user already has an overlapping shift (excluding a given shift id, for updates)
  async findOverlapping({ userId, startsAt, endsAt, excludeShiftId }) {
    const { rows } = await pool.query(
      `SELECT * FROM shifts
       WHERE user_id = $1
         AND status != 'cancelled'
         AND starts_at < $3
         AND ends_at > $2
         AND ($4::uuid IS NULL OR id != $4)`,
      [userId, startsAt, endsAt, excludeShiftId || null]
    );
    return rows;
  },

  async update(id, { userId, startsAt, endsAt, position, notes, status }) {
    const { rows } = await pool.query(
      `UPDATE shifts
       SET user_id = COALESCE($2, user_id),
           starts_at = COALESCE($3, starts_at),
           ends_at = COALESCE($4, ends_at),
           position = COALESCE($5, position),
           notes = COALESCE($6, notes),
           status = COALESCE($7, status),
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, userId, startsAt, endsAt, position, notes, status]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM shifts WHERE id = $1 RETURNING id",
      [id]
    );
    return rows[0] || null;
  },

  // Publish all draft shifts for a store within a date range
  async publishDrafts(storeId, weekStart, weekEnd) {
    const { rows } = await pool.query(
      `UPDATE shifts
       SET status = 'published', updated_at = now()
       WHERE store_id = $1
         AND status = 'draft'
         AND starts_at >= $2
         AND starts_at < $3
       RETURNING *`,
      [storeId, weekStart, weekEnd]
    );
    return rows;
  },
};
