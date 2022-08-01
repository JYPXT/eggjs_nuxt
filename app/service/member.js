"use strict";

const { Service } = require("egg");

class MemberService extends Service {
  async login({ account, password }) {
    const { ctx, app } = this;
    if (account === app.config.admin.account) {
      ctx.session.oauth = account;
      // const sessionid = ctx.cookies.get("docssessionid");
      return await ctx.service.servicePlatforms.getFirstPlatform();
    } else {
      ctx.status = 400;
      return "account error";
    }
  }

  async jwtlogin({ account, password }) {
    const { ctx, app } = this;
    if (account === app.config.admin.account) {
      const options = {
        exp: Date.now() + ctx.app.config.jwt.expires,
      };
      const { secret } = ctx.app.config.jwt;
      return app.jwt.sign(options, secret);
    } else {
      ctx.status = 400;
      return "account error";
    }
  }
}

module.exports = MemberService;
