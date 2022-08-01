"use strict";

const path = require("path");
const { Controller } = require("egg");

class ServicePlatformsController extends Controller {
  async getServicePlatforms() {
    const {
      ctx,
      ctx: { helper },
    } = this;

    const data = await ctx.service.servicePlatforms.getServicePlatforms();
    ctx.body = helper.response({
      data,
    });
    ctx.status = 200;
  }

  async getFirstPlatform() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const data = await ctx.service.servicePlatforms.getFirstPlatform();
    ctx.body = helper.response({
      data,
    });
    ctx.status = 200;
  }

  async getServicePlatformByCategory() {
    const {
      ctx,
      ctx: { helper, params },
    } = this;

    const data = await ctx.service.servicePlatforms.getServicePlatformByCategory(
      params.category
    );
    ctx.body = helper.response({
      data,
    });
    ctx.status = 200;
  }

  async getPlatforms() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    try {
      const createRule = {
        servicePlatform: { type: "string", required: true },
      };
      const { servicePlatform } = ctx.request.query;
      ctx.validate(createRule, { servicePlatform });
      const data = await ctx.service.servicePlatforms.getServicePlatformByCategory(
        servicePlatform
      );
      ctx.body = helper.response({
        data: data.platforms,
      });
      ctx.status = 200;
    } catch (error) {
      ctx.status = 400;
      ctx.body = helper.response({ message: "参数错误" });
    }
  }

  async createServicePlatforms() {
    const {
      ctx,
      ctx: { helper },
    } = this;

    try {
      const createRule = {
        name: { type: "string", required: true },
        route: { type: "string", required: true },
      };
      ctx.validate(createRule, ctx.request.body);
      const message = await ctx.service.servicePlatforms.createServicePlatforms(
        ctx.request.body
      );
      ctx.body = helper.response(message);
      ctx.status = 201;
    } catch (error) {
      ctx.status = 400;
      ctx.body = helper.response({ message: "参数错误" });
    }
  }
}

module.exports = ServicePlatformsController;
