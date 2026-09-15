import { pool } from "../config/db.js";

export const AttendanceModel = {
  async create({ shiftId, userId, storeId, clockInAt, clockInMethod, variance, flagged }) {
    const { rows } = await pool.query(
      `INSERT INTO attendance_records
         (shift_id, user_id, store_id, clock_in_at, clock_in_method, variance_minutes, flagged)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [shiftId || null, userId, storeId, clockInAt, clockInMethod, variance, flagged]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM attendance_records WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // Find an open record (clocked in, not yet clocked out) for a user
  async findOpenForUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM attendance_records
       WHERE user_id = $1 AND clock_out_at IS NULL
       ORDER BY clock_in_at DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  async clockOut(id, clockOutAt) {
    const { rows } = await pool.query(
      `UPDATE attendance_records
       SET clock_out_at = $2
       WHERE id = $1
       RETURNING *`,
      [id, clockOutAt]
    );
    return rows[0] || null;
  },

  async findByStoreAndRange(storeId, startDate, endDate) {
    const { rows } = await pool.query(
      `SELECT a.*, u.full_name AS staff_name,
              s.starts_at AS scheduled_start, s.ends_at AS scheduled_end
       FROM attendance_records a
       JOIN users u ON u.id = a.user_id
       LEFT JOIN shifts s ON s.id = a.shift_id
       WHERE a.store_id = $1
         AND a.clock_in_at >= $2
         AND a.clock_in_at < $3
       ORDER BY a.clock_in_at DESC`,
      [storeId, startDate, endDate]
    );
    return rows;
  },
};
