"use strict";

const { Controller } = require("egg");

class MemberController extends Controller {
  async login() {
    const {
      ctx,
      service,
      ctx: { helper },
    } = this;
    const createRule = {
      account: { type: "string", required: true },
    };
    ctx.validate(createRule, ctx.request.body);
    const data = await service.member.login(ctx.request.body);
    ctx.body = helper.response({
      data,
    });
  }

  async jwtlogin() {
    const {
      ctx,
      service,
      ctx: { helper },
    } = this;
    const createRule = {
      account: { type: "string", required: true },
      // password: { type: "string", required: true },
    };
    ctx.validate(createRule, ctx.request.body);
    const accessToken = await service.member.jwtlogin(ctx.request.body);
    ctx.cookies.set("authorization", accessToken);
    ctx.body = helper.response({
      data: { accessToken },
    });
  }
}

module.exports = MemberController;
