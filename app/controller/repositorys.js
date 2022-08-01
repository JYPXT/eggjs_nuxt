"use strict";

const Controller = require("egg").Controller;

class RepositoryController extends Controller {
  async parseConfig() {
    const {
      ctx,
      ctx: { helper, params },
    } = this;
    const createRule = {
      id: { type: "string", required: true },
    };
    ctx.validate(createRule, params);
    const res = await ctx.service.repositorys.parseConfig(params.id);
    ctx.status = 201;
    ctx.body = helper.response(res);
  }

  async getRepositorys() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const { category } = ctx.request.query;
    const data = await ctx.service.repositorys.getRepositorys(category);
    ctx.status = 200;
    ctx.body = helper.response({ data });
  }

  async createRepository() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const createRule = {
      platformName: { type: "string", required: true },
      servicePlatform: { type: "string", required: true },
      repo: { type: "string", required: true },
      sort: { type: "number", required: true },
    };
    ctx.validate(createRule, ctx.request.body);
    const {
      platformName,
      servicePlatform,
      repo,
      repositoryName,
      branchName,
      childDir,
      sort,
    } = ctx.request.body;
    const data = await ctx.service.repositorys.createRepository(
      servicePlatform,
      platformName,
      repo,
      repositoryName,
      branchName,
      childDir,
      sort
    );
    ctx.status = 201;
    ctx.body = helper.response({ data });
  }

  async updateRepository() {
    const {
      ctx,
      ctx: { params, helper },
    } = this;
    const createRule = {
      id: { type: "string", required: true },
    };
    ctx.validate(createRule, params);
    const message = await ctx.service.repositorys.updateRepository(params.id);
    ctx.status = 204;
    ctx.body = helper.response({ message });
  }

  async deleteRepository() {
    const {
      ctx,
      ctx: { params, helper },
    } = this;
    const createRule = {
      id: { type: "string", required: true },
    };
    ctx.validate(createRule, params);
    const message = await ctx.service.repositorys.deleteRepository(params.id);
    ctx.status = 204;
    ctx.body = helper.response({ message });
  }
}

module.exports = RepositoryController;
