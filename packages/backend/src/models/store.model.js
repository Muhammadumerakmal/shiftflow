import { pool } from "../config/db.js";

export const StoreModel = {
  async create({ name }) {
    const { rows } = await pool.query(
      `INSERT INTO stores (name) VALUES ($1) RETURNING id, name, created_at`,
      [name]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM stores WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  },

  async update(id, { name, address, timezone, businessHours }) {
    const { rows } = await pool.query(
      `UPDATE stores
       SET name = COALESCE($2, name),
           address = COALESCE($3, address),
           timezone = COALESCE($4, timezone),
           business_hours = COALESCE($5, business_hours),
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, name, address, timezone, businessHours]
    );
    return rows[0] || null;
  },

  async linkStaff({ storeId, userId, position, isManager = true }) {
    const { rows } = await pool.query(
      `INSERT INTO store_staff (store_id, user_id, position, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [storeId, userId, position || (isManager ? "manager" : "staff")]
    );
    return rows[0];
  },

  // Get all staff for a store, joined with user info
  async getStaffList(storeId) {
    const { rows } = await pool.query(
      `SELECT
         ss.id AS store_staff_id,
         ss.position,
         ss.hourly_rate,
         ss.can_open,
         ss.can_close,
         ss.max_weekly_hours,
         ss.is_active,
         u.id AS user_id,
         u.full_name,
         u.email,
         u.phone,
         u.role,
         u.avatar_url
       FROM store_staff ss
       JOIN users u ON u.id = ss.user_id
       WHERE ss.store_id = $1
       ORDER BY u.full_name ASC`,
      [storeId]
    );
    return rows;
  },

  async findStoreStaffById(storeStaffId) {
    const { rows } = await pool.query(
      "SELECT * FROM store_staff WHERE id = $1",
      [storeStaffId]
    );
    return rows[0] || null;
  },

  async findStaffByUserId(userId) {
    const { rows } = await pool.query(
      "SELECT * FROM store_staff WHERE user_id = $1 AND is_active = true LIMIT 1",
      [userId]
    );
    return rows[0] || null;
  },

  async getStaffById(storeId, storeStaffId) {
    const { rows } = await pool.query(
      `SELECT
         ss.id AS store_staff_id,
         ss.position,
         ss.hourly_rate,
         ss.can_open,
         ss.can_close,
         ss.max_weekly_hours,
         ss.is_active,
         u.id AS user_id,
         u.full_name,
         u.email,
         u.phone,
         u.role,
         u.avatar_url
       FROM store_staff ss
       JOIN users u ON u.id = ss.user_id
       WHERE ss.store_id = $1 AND ss.id = $2`,
      [storeId, storeStaffId]
    );
    return rows[0] || null;
  },

  // Get manager/owner user IDs for a store (for sending notifications)
  async getManagerUserIds(storeId) {
    const { rows } = await pool.query(
      `SELECT u.id
       FROM users u
       JOIN store_staff ss ON ss.user_id = u.id
       WHERE ss.store_id = $1
         AND ss.is_active = true
         AND u.role IN ('owner', 'manager')`,
      [storeId]
    );
    return rows.map((r) => r.id);
  },

  async updateStaff(storeStaffId, { position, hourlyRate, canOpen, canClose, maxWeeklyHours, isActive }) {
    const { rows } = await pool.query(
      `UPDATE store_staff
       SET position = COALESCE($2, position),
           hourly_rate = COALESCE($3, hourly_rate),
           can_open = COALESCE($4, can_open),
           can_close = COALESCE($5, can_close),
           max_weekly_hours = COALESCE($6, max_weekly_hours),
           is_active = COALESCE($7, is_active)
       WHERE id = $1
       RETURNING *`,
      [storeStaffId, position, hourlyRate, canOpen, canClose, maxWeeklyHours, isActive]
    );
    return rows[0] || null;
  },
};
