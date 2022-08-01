"use strict";

const Controller = require("egg").Controller;
const path = require("path");

class DocumentsController extends Controller {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir);
    this.resolveBaseDir = path.resolve.bind(null, baseDir);
  }

  async getNavs() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const { servicePlatform, platform } = ctx.request.query;
    const navs = await ctx.service.documents.getNavs(servicePlatform, platform);
    ctx.status = 200;
    ctx.body = helper.response({ data: navs });
  }

  async getLayout() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const layouts = await ctx.service.documents.getLayout();
    ctx.status = 200;
    ctx.body = helper.response({ data: layouts });
  }

  async getSlidebars() {
    const {
      ctx,
      ctx: { params, helper },
    } = this;
    const createRule = {
      id: { type: "string", required: true },
    };
    ctx.validate(createRule, params);
    const slidebars = await ctx.service.documents.getSlidebars(params.id);
    ctx.status = 200;
    ctx.body = helper.response({ data: slidebars });
  }

  async getActicle() {
    const {
      ctx,
      ctx: { params, helper },
    } = this;

    const createRule = {
      id: { type: "string", required: true },
    };
    ctx.validate(createRule, params);
    const article = await ctx.service.documents.getActicle(params.id);
    if (article) {
      ctx.status = 200;
      ctx.body = helper.response({ data: article });
    } else {
      ctx.status = 400;
      ctx.body = helper.response({ message: "找不到该文章" });
    }
  }

  async getActicleByRoute() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const { route, platform } = ctx.request.query;
    const createRule = {
      route: { type: "string", required: true },
      platform: { type: "string", required: true },
    };
    ctx.validate(createRule, ctx.request.query);
    const article = await ctx.service.documents.getActicleByRoute(
      route,
      platform
    );
    if (article) {
      ctx.status = 200;
      ctx.body = helper.response({ data: article });
    } else {
      ctx.status = 400;
      ctx.body = helper.response({ message: "找不到该文章" });
    }
  }

  // async parseDocuments() {
  //   const {
  //     ctx,
  //     ctx: { helper },
  //   } = this;
  //   const { markdowns } = docsConfig;
  //   for (let i = 0; i < markdowns.length; i++) {
  //     const markdown = markdowns[i];
  //     await ctx.service.documents.parseMarkdown(markdown);
  //   }
  //   ctx.status = 201;
  //   ctx.body = helper.response("解析markdown文件成功");
  // }

  async parseMarkdown() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    await this.ctx.service.documents.parseMarkdown();
    ctx.body = helper.response("解析markdown文件成功");
  }

  async search() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    // const createRule = {
    //   condition: { type: 'string', required: true }
    // };
    // ctx.validate(createRule, ctx.request.query);
    let { platform, text, pageindex, pagesize, category } = ctx.request.query;
    text = text || "";
    pageindex = pageindex ? Number(pageindex) : 0;
    pagesize = pagesize ? Number(pagesize) : 10;
    const skip = pageindex * pagesize;
    const result = await this.ctx.service.documents.search({
      category,
      platform,
      text,
      skip,
      pageindex,
      pagesize,
    });
    ctx.status = 200;
    ctx.body = helper.response({ data: result || [] });
  }
}

module.exports = DocumentsController;
