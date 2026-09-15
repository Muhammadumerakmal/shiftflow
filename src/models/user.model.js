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

  async create({ email, phone, fullName, passwordHash, role }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, phone, full_name, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, created_at`,
      [email, phone, fullName, passwordHash, role]
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
};
