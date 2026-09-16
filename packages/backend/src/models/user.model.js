import { pool } from "../config/db.js";

export const UserModel = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  },

  async create({ email, phone, fullName, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, phone, full_name, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, phone, avatar_url, created_at`,
      [email, phone || null, fullName, passwordHash || null]
    );
    return rows[0];
  },

  async findByPhone(phone) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );
    return rows[0] || null;
  },

  async updateDefaultOrg(userId, organizationId) {
    const { rows } = await pool.query(
      `UPDATE users SET default_organization_id = $2, updated_at = now()
       WHERE id = $1 RETURNING id, default_organization_id`,
      [userId, organizationId]
    );
    return rows[0] || null;
  },

  async update(id, { fullName, phone, avatarUrl }) {
    const { rows } = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = now()
       WHERE id = $1
       RETURNING id, email, full_name, phone, avatar_url, created_at`,
      [id, fullName, phone, avatarUrl]
    );
    return rows[0] || null;
  },
};
