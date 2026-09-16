import crypto from "crypto";
import { pool } from "../config/db.js";

export const InviteModel = {
  async create({ organizationId, storeId, email, orgRole, storeRole, invitedBy, expiresInHours = 24 }) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const { rows } = await pool.query(
      `INSERT INTO invites (organization_id, store_id, email, org_role, store_role, token, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, org_role, store_role, expires_at, created_at`,
      [organizationId, storeId || null, email, orgRole, storeRole || null, token, invitedBy, expiresAt]
    );
    return { ...rows[0], token };
  },

  async findByToken(token) {
    const { rows } = await pool.query(
      `SELECT i.*, o.name AS organization_name, o.slug AS organization_slug,
              s.name AS store_name
       FROM invites i
       JOIN organizations o ON o.id = i.organization_id
       LEFT JOIN stores s ON s.id = i.store_id
       WHERE i.token = $1`,
      [token]
    );
    return rows[0] || null;
  },

  async findByEmailAndOrg(email, organizationId) {
    const { rows } = await pool.query(
      `SELECT * FROM invites
       WHERE email = $1 AND organization_id = $2 AND accepted_at IS NULL
       ORDER BY created_at DESC LIMIT 1`,
      [email, organizationId]
    );
    return rows[0] || null;
  },

  async markAccepted(id) {
    const { rows } = await pool.query(
      `UPDATE invites SET accepted_at = now() WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] || null;
  },

  async listPending(organizationId) {
    const { rows } = await pool.query(
      `SELECT i.id, i.email, i.org_role, i.store_role, i.expires_at, i.created_at,
              s.name AS store_name, u.full_name AS invited_by_name
       FROM invites i
       LEFT JOIN stores s ON s.id = i.store_id
       JOIN users u ON u.id = i.invited_by
       WHERE i.organization_id = $1
         AND i.accepted_at IS NULL
         AND i.expires_at > now()
       ORDER BY i.created_at DESC`,
      [organizationId]
    );
    return rows;
  },

  async revoke(id) {
    const { rows } = await pool.query(
      `DELETE FROM invites WHERE id = $1 AND accepted_at IS NULL RETURNING id`,
      [id]
    );
    return rows[0] || null;
  },

  async cleanupExpired() {
    const { rows } = await pool.query(
      `DELETE FROM invites WHERE expires_at < now() AND accepted_at IS NULL RETURNING id`
    );
    return rows;
  },
};
