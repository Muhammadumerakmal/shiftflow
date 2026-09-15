import { pool } from "../config/db.js";

export const TimeOffModel = {
  async create({ userId, storeId, startsOn, endsOn, reason }) {
    const { rows } = await pool.query(
      `INSERT INTO time_off_requests (user_id, store_id, starts_on, ends_on, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [userId, storeId, startsOn, endsOn, reason || null]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM time_off_requests WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  async findByStore(storeId, status) {
    const params = [storeId];
    let statusFilter = "";
    if (status) {
      params.push(status);
      statusFilter = `AND t.status = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT t.*, u.full_name AS staff_name, rv.full_name AS reviewed_by_name
       FROM time_off_requests t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN users rv ON rv.id = t.reviewed_by
       WHERE t.store_id = $1
       ${statusFilter}
       ORDER BY t.created_at DESC`,
      params
    );
    return rows;
  },

  // Check if this user has an existing (non-denied) request overlapping these dates
  async findOverlapping({ userId, startsOn, endsOn, excludeId }) {
    const { rows } = await pool.query(
      `SELECT * FROM time_off_requests
       WHERE user_id = $1
         AND status != 'denied'
         AND starts_on <= $3
         AND ends_on >= $2
         AND ($4::uuid IS NULL OR id != $4)`,
      [userId, startsOn, endsOn, excludeId || null]
    );
    return rows;
  },

  async updateStatus(id, { status, reviewedBy }) {
    const { rows } = await pool.query(
      `UPDATE time_off_requests
       SET status = $2,
           reviewed_by = $3,
           reviewed_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, status, reviewedBy]
    );
    return rows[0] || null;
  },
};
