"use strict";

const Controller = require("egg").Controller;
const path = require("path");

class PlatformsController extends Controller {
  async getPlatforms() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    try {
      const createRule = {
        servicePlatform: { type: "string", required: true },
      };
      ctx.validate(createRule, ctx.request.query);
      const { servicePlatform, nav } = ctx.request.query;
      const data = await ctx.service.platforms.getPlatforms(
        servicePlatform,
        nav
      );
      ctx.status = 200;
      ctx.body = helper.response({ data });
    } catch (error) {
      ctx.status = 400;
      ctx.body = helper.response({ message: "参数错误" });
    }
  }

  // async getPlatforms() {
  //   const {
  //     ctx,
  //     ctx: { helper },
  //   } = this;
  //   const { category } = ctx.request.query;
  //   const data = await ctx.service.platforms.getPlatforms(category);
  //   ctx.status = 200;
  //   ctx.body = helper.response({ data });
  // }

  // async createPlatform() {
  //   const {
  //     ctx,
  //     ctx: { helper },
  //   } = this;
  //   try {
  //     const createRule = {
  //       name: { type: "string", required: true },
  //       repo: { type: "string", required: true },
  //       sort: { type: "number", required: true },
  //     };
  //     ctx.validate(createRule, ctx.request.body);

  //     const data = await ctx.service.platforms.createPlatform(ctx.request.body);
  //     ctx.body = helper.response(data);
  //     ctx.status = 201;
  //   } catch (error) {
  //     ctx.status = 400;
  //     ctx.body = helper.response({ message: "参数错误" });
  //   }
  // }

  // async deletePlatform() {
  //   const {
  //     ctx,
  //     ctx: { params, helper },
  //   } = this;
  //   try {
  //     const createRule = {
  //       id: { type: "string", required: true },
  //     };
  //     ctx.validate(createRule, params);

  //     const message = await ctx.service.platforms.deletePlatform(params.id);
  //     ctx.status = 204;
  //     ctx.body = helper.response({ message });
  //   } catch (error) {
  //     ctx.status = 400;
  //     ctx.body = helper.response({ message: "参数错误" });
  //   }
  // }
}

module.exports = PlatformsController;
