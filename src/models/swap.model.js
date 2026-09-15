import { pool } from "../config/db.js";

export const SwapModel = {
  async create({ shiftId, requestedBy, offeredTo, reason }) {
    const { rows } = await pool.query(
      `INSERT INTO shift_swap_requests (shift_id, requested_by, offered_to, status, reason)
       VALUES ($1, $2, $3, 'open', $4)
       RETURNING *`,
      [shiftId, requestedBy, offeredTo || null, reason || null]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM shift_swap_requests WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // List swap requests for a store, optionally filtered by status
  async findByStore(storeId, status) {
    const params = [storeId];
    let statusFilter = "";
    if (status) {
      params.push(status);
      statusFilter = `AND sr.status = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT
         sr.*,
         s.starts_at, s.ends_at, s.position AS shift_position,
         req.full_name AS requested_by_name,
         acc.full_name AS accepted_by_name
       FROM shift_swap_requests sr
       JOIN shifts s ON s.id = sr.shift_id
       JOIN users req ON req.id = sr.requested_by
       LEFT JOIN users acc ON acc.id = sr.accepted_by
       WHERE s.store_id = $1
       ${statusFilter}
       ORDER BY sr.created_at DESC`,
      params
    );
    return rows;
  },

  async update(id, { status, acceptedBy, offeredTo, resolvedAt }) {
    const { rows } = await pool.query(
      `UPDATE shift_swap_requests
       SET status = COALESCE($2, status),
           accepted_by = COALESCE($3, accepted_by),
           offered_to = COALESCE($4, offered_to),
           resolved_at = COALESCE($5, resolved_at)
       WHERE id = $1
       RETURNING *`,
      [id, status, acceptedBy, offeredTo, resolvedAt]
    );
    return rows[0] || null;
  },
};
