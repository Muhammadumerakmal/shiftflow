import { pool } from "../config/db.js";

export const MembershipModel = {
  async create({ organizationId, userId, orgRole }) {
    const { rows } = await pool.query(
      `INSERT INTO memberships (organization_id, user_id, org_role)
       VALUES ($1, $2, $3)
       RETURNING id, organization_id, user_id, org_role, created_at`,
      [organizationId, userId, orgRole]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM memberships WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  async findByOrgAndUser(organizationId, userId) {
    const { rows } = await pool.query(
      "SELECT * FROM memberships WHERE organization_id = $1 AND user_id = $2",
      [organizationId, userId]
    );
    return rows[0] || null;
  },

  async listByOrg(organizationId) {
    const { rows } = await pool.query(
      `SELECT m.id, m.org_role, m.created_at AS joined_at,
              u.id AS user_id, u.full_name, u.email, u.phone, u.avatar_url
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       WHERE m.organization_id = $1
       ORDER BY m.created_at ASC`,
      [organizationId]
    );
    return rows;
  },

  async listByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT m.id, m.org_role, m.created_at AS joined_at,
              o.id AS organization_id, o.name AS organization_name, o.slug
       FROM memberships m
       JOIN organizations o ON o.id = m.organization_id
       WHERE m.user_id = $1 AND o.is_active = true
       ORDER BY m.created_at ASC`,
      [userId]
    );
    return rows;
  },

  async updateRole(organizationId, userId, orgRole) {
    const { rows } = await pool.query(
      `UPDATE memberships SET org_role = $3
       WHERE organization_id = $1 AND user_id = $2
       RETURNING *`,
      [organizationId, userId, orgRole]
    );
    return rows[0] || null;
  },

  async remove(organizationId, userId) {
    const { rows } = await pool.query(
      `DELETE FROM memberships WHERE organization_id = $1 AND user_id = $2
       RETURNING id`,
      [organizationId, userId]
    );
    return rows[0] || null;
  },
};
