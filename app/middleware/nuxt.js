module.exports = () => {
  return async function nuxt(ctx, next) {
    ctx.status = 200;
    ctx.body = await ctx.service.nuxt.render(ctx.req, ctx.res);
  };
};
