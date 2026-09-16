import { OrganizationModel } from "../models/organization.model.js";
import { MembershipModel } from "../models/membership.model.js";
import { StoreModel } from "../models/store.model.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { cacheGet, cacheSet, cacheDelete } from "../utils/cache.js";

const STORE_LIST_TTL = 60 * 1000; // 60 seconds

function storeListCacheKey(orgId) {
  return `stores:org:${orgId}`;
}

export const OrganizationService = {
  async getOrganization(orgId, userId) {
    const membership = await MembershipModel.findByOrgAndUser(orgId, userId);
    if (!membership) {
      throw new AppError("Access denied", 403);
    }

    const org = await OrganizationModel.findById(orgId);
    if (!org) {
      throw new AppError("Access denied", 403);
    }

    return org;
  },

  async updateOrganization(orgId, userId, updates) {
    const membership = await MembershipModel.findByOrgAndUser(orgId, userId);
    if (!membership || membership.org_role !== "org_admin") {
      throw new AppError("Access denied", 403);
    }

    const org = await OrganizationModel.update(orgId, updates);
    if (!org) {
      throw new AppError("Access denied", 403);
    }

    return org;
  },

  async listStores(orgId, userId) {
    const membership = await MembershipModel.findByOrgAndUser(orgId, userId);
    if (!membership) {
      throw new AppError("Access denied", 403);
    }

    const cacheKey = storeListCacheKey(orgId);
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    let stores;
    if (membership.org_role === "org_admin") {
      stores = await OrganizationModel.listStores(orgId);
    } else {
      const staffRecords = await StoreModel.findStaffByUserIdAndOrg(userId, orgId);
      const storeIds = staffRecords.map((r) => r.store_id);
      if (storeIds.length === 0) return [];

      const allStores = await OrganizationModel.listStores(orgId);
      stores = allStores.filter((s) => storeIds.includes(s.id));
    }

    cacheSet(cacheKey, stores, STORE_LIST_TTL);
    return stores;
  },

  async createStore(orgId, userId, { name }) {
    const membership = await MembershipModel.findByOrgAndUser(orgId, userId);
    if (!membership || membership.org_role !== "org_admin") {
      throw new AppError("Access denied", 403);
    }

    const store = await StoreModel.create({ organizationId: orgId, name });

    cacheDelete(storeListCacheKey(orgId));
    return store;
  },

  async listMembers(orgId, userId) {
    const membership = await MembershipModel.findByOrgAndUser(orgId, userId);
    if (!membership) {
      throw new AppError("Access denied", 403);
    }

    return MembershipModel.listByOrg(orgId);
  },
};
