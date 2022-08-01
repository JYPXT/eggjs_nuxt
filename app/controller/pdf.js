"use strict";

const { throws } = require("assert");
const { Controller } = require("egg");
const fs = require("fs");
const path = require("path");

class PdfController extends Controller {
  async generatePDF() {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const { platform, category } = ctx.request.query;
    try {
      const createRule = {
        platform: { type: "string", required: true },
        category: { type: "string", required: true },
      };
      ctx.validate(createRule, { platform, category });
    } catch (error) {
      ctx.status = 400;
      ctx.body = helper.response({ message: "参数错误" });
    }
    const filePath = await ctx.service.pdf.generatePDF(platform, category);
    ctx.status = 200;
    ctx.body = helper.response({ data: filePath });
  }

  async download() {
    const {
      ctx,
      app,
      ctx: { helper },
    } = this;
    const { platform, category } = ctx.request.query;
    try {
      const createRule = {
        platform: { type: "string", required: true },
        category: { type: "string", required: true },
      };
      ctx.validate(createRule, { platform, category });
    } catch (error) {
      ctx.status = 400;
      ctx.body = helper.response({ message: "参数错误" });
    }
    const filename = `${category}${platform}.pdf`;
    const filePath = path.join(app.baseDir, `resources/assets/${filename}`);
    ctx.set("Content-Type", "application/pdf");
    ctx.set("Content-Disposition", `attachment; filename=${filename}`);
    ctx.status = 200;
    ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = PdfController;
