"use strict";

const path = require("path");
const sendToWormhole = require("stream-wormhole");
const awaitWriteStream = require("await-stream-ready").write;
const fs = require("fs");

module.exports = ({ savePath = "app/public/upload/" }) => {
  return async function formdata(ctx, next) {
    const { app, helper } = ctx;
    try {
      const parts = await ctx.multipart(); // { autoFields: true } 可以将除了文件的其它字段提取到parts的filed中，
      const formdataBody = {};
      let part;
      while ((part = await parts()) != null) {
        if (part.length) {
          // arrays are busboy fields
          formdataBody[part[0]] = part[1]; // === 'undefined'? null : part[1];
        } else {
          if (!part.filename) {
            return;
          }
          // otherwise, it's a stream
          const suffix = part.filename.substr(part.filename.lastIndexOf("."));
          const name = `${Date.now()}${suffix}`;
          const targetUrl = path.join(savePath, name);
          const writeStream = fs.createWriteStream(targetUrl);
          try {
            await awaitWriteStream(part.pipe(writeStream));
          } catch (err) {
            // 出错时把流消费掉
            await sendToWormhole(part);
            ctx.body = helper.error(err);
            throw err;
          }
          formdataBody[part.fieldname] = `${app.config.static.prefix}${name}`;
        }
      }

      ctx.state.formdataBody = formdataBody;
      await next();
    } catch (error) {
      ctx.body = helper.error(error);
    }
  };
};
