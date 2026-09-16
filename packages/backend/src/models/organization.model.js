import { pool } from "../config/db.js";

export const OrganizationModel = {
  async create({ name, slug }) {
    const { rows } = await pool.query(
      `INSERT INTO organizations (name, slug) VALUES ($1, $2)
       RETURNING id, name, slug, plan, created_at`,
      [name, slug]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM organizations WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const { rows } = await pool.query(
      "SELECT * FROM organizations WHERE slug = $1",
      [slug]
    );
    return rows[0] || null;
  },

  async update(id, { name, plan }) {
    const { rows } = await pool.query(
      `UPDATE organizations
       SET name = COALESCE($2, name),
           plan = COALESCE($3, plan),
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, name, plan]
    );
    return rows[0] || null;
  },

  async deactivate(id) {
    const { rows } = await pool.query(
      `UPDATE organizations SET is_active = false, updated_at = now()
       WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0] || null;
  },

  async listByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT o.id, o.name, o.slug, o.plan, m.org_role, m.created_at AS joined_at
       FROM organizations o
       JOIN memberships m ON m.organization_id = o.id
       WHERE m.user_id = $1 AND o.is_active = true
       ORDER BY m.created_at ASC`,
      [userId]
    );
    return rows;
  },

  async listStores(organizationId) {
    const { rows } = await pool.query(
      `SELECT id, name, address, timezone, is_active, created_at
       FROM stores
       WHERE organization_id = $1
       ORDER BY name ASC`,
      [organizationId]
    );
    return rows;
  },

  async generateUniqueSlug(baseName) {
    const slug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let candidate = slug;
    let counter = 1;
    while (true) {
      const existing = await this.findBySlug(candidate);
      if (!existing) return candidate;
      candidate = `${slug}-${counter}`;
      counter++;
    }
  },
};
