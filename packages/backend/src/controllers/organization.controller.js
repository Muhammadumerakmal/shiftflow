import { OrganizationService } from "../services/organization.service.js";

export const OrganizationController = {
  async getOrganization(req, res, next) {
    try {
      const org = await OrganizationService.getOrganization(req.params.orgId, req.user.id);
      res.json({ success: true, data: org });
    } catch (err) {
      next(err);
    }
  },

  async updateOrganization(req, res, next) {
    try {
      const org = await OrganizationService.updateOrganization(req.params.orgId, req.user.id, req.body);
      res.json({ success: true, data: org });
    } catch (err) {
      next(err);
    }
  },

  async listStores(req, res, next) {
    try {
      const stores = await OrganizationService.listStores(req.params.orgId, req.user.id);
      res.json({ success: true, data: stores });
    } catch (err) {
      next(err);
    }
  },

  async createStore(req, res, next) {
    try {
      const store = await OrganizationService.createStore(req.params.orgId, req.user.id, req.body);
      res.status(201).json({ success: true, data: store });
    } catch (err) {
      next(err);
    }
  },

  async listMembers(req, res, next) {
    try {
      const members = await OrganizationService.listMembers(req.params.orgId, req.user.id);
      res.json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  },
};
