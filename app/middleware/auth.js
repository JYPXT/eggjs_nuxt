"use strict";

module.exports = () => {
  return async function auth(ctx, next) {
    const { helper, session } = ctx;
    if (!session.oauth) {
      ctx.status = 401;
      ctx.body = helper.response("鉴权失败");
      return;
    }
    await next();
  };
};
