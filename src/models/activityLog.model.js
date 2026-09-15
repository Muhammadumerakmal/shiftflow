import { pool } from "../config/db.js";

export const ActivityLogModel = {
  async create({ storeId, userId, action, entityType, entityId, metadata }) {
    const { rows } = await pool.query(
      `INSERT INTO activity_log (store_id, user_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [storeId, userId, action, entityType, entityId, metadata || {}]
    );
    return rows[0];
  },
};
