"use strict";

module.exports = () => {
  return async function auth(ctx, next) {
    const { helper } = ctx;
    const authorization = ctx.request.get("authorization");
    const cookie = ctx.request.get("cookie");
    const cookies = cookie.split(";").reduce((res, co) => {
      const str = co.split("=");
      if (str) {
        res[str[0].replace(/^\s+|\s+$/, "")] = str[1];
      }
      return res;
    }, {});
    const oauth = authorization || cookies.authorization;
    if (!oauth) {
      ctx.status = 401;
      ctx.body = helper.response("没有权限访问");
      return;
    }
    try {
      const code = ctx.app.jwt.decode(oauth, ctx.app.config.jwt.secret);
      if (code.exp && code.exp < new Date().getTime()) {
        ctx.status = 401;
        ctx.body = helper.response("token过期");
        return;
      }
      // ctx.state = { code };
      await next();
    } catch (error) {
      ctx.logger.error(error);
      ctx.status = 401;
      ctx.body = helper.response("token异常");
    }
  };
};
