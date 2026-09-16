import { pool } from "../config/db.js";

export const StoreModel = {
  async create({ organizationId, name }) {
    const { rows } = await pool.query(
      `INSERT INTO stores (organization_id, name) VALUES ($1, $2)
       RETURNING id, organization_id, name, created_at`,
      [organizationId, name]
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

  async linkStaff({ storeId, userId, role = "staff", position }) {
    const { rows } = await pool.query(
      `INSERT INTO store_staff (store_id, user_id, role, position, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [storeId, userId, role, position || null]
    );
    return rows[0];
  },

  async getStaffList(storeId) {
    const { rows } = await pool.query(
      `SELECT
         ss.id AS store_staff_id,
         ss.role AS store_role,
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

  async findAllStaffByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT ss.*, s.organization_id
       FROM store_staff ss
       JOIN stores s ON s.id = ss.store_id
       WHERE ss.user_id = $1 AND ss.is_active = true`,
      [userId]
    );
    return rows;
  },

  async findStaffByUserIdAndOrg(userId, organizationId) {
    const { rows } = await pool.query(
      `SELECT ss.*
       FROM store_staff ss
       JOIN stores s ON s.id = ss.store_id
       WHERE ss.user_id = $1 AND ss.is_active = true AND s.organization_id = $2`,
      [userId, organizationId]
    );
    return rows;
  },

  async findStoreByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.created_at
       FROM stores s
       JOIN store_staff ss ON ss.store_id = s.id
       WHERE ss.user_id = $1 AND ss.is_active = true
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  async getStaffById(storeId, storeStaffId) {
    const { rows } = await pool.query(
      `SELECT
         ss.id AS store_staff_id,
         ss.role AS store_role,
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
         u.avatar_url
       FROM store_staff ss
       JOIN users u ON u.id = ss.user_id
       WHERE ss.store_id = $1 AND ss.id = $2`,
      [storeId, storeStaffId]
    );
    return rows[0] || null;
  },

  async getManagerUserIds(storeId) {
    const { rows } = await pool.query(
      `SELECT u.id
       FROM users u
       JOIN store_staff ss ON ss.user_id = u.id
       WHERE ss.store_id = $1
         AND ss.is_active = true
         AND ss.role = 'manager'`,
      [storeId]
    );
    return rows.map((r) => r.id);
  },

  async updateStaff(storeStaffId, { role, position, hourlyRate, canOpen, canClose, maxWeeklyHours, isActive }) {
    const { rows } = await pool.query(
      `UPDATE store_staff
       SET role = COALESCE($2, role),
           position = COALESCE($3, position),
           hourly_rate = COALESCE($4, hourly_rate),
           can_open = COALESCE($5, can_open),
           can_close = COALESCE($6, can_close),
           max_weekly_hours = COALESCE($7, max_weekly_hours),
           is_active = COALESCE($8, is_active)
       WHERE id = $1
       RETURNING *`,
      [storeStaffId, role, position, hourlyRate, canOpen, canClose, maxWeeklyHours, isActive]
    );
    return rows[0] || null;
  },
};
