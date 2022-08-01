/* eslint valid-jsdoc: "off" */

"use strict";

const path = require("path");
const fs = require("fs");
const nuxtConfig = require("./nuxt.config");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // config.proxy = true;
  // config.hostHeaders = "Host";

  config.siteFile = {
    "/favicon.ico": fs.readFileSync(path.join(__dirname, "favicon.ico")),
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1616303389020_5321";

  config.session = {
    key: "docssessionid",
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  config.jwt = {
    secret: "1423914693",
    enable: false,
    expires: 24 * 60 * 60 * 1000,
  };

  // add your middleware config here
  // config.middleware = ["logs"];
  config.middleware = ["logs", "auth", "nuxt"];

  config.auth = {
    match: /\/apiserve/,
  };

  config.nuxt = {
    ignore: /^\/api\/|^\/apiserve\//,
  };

  config.nuxtConfig = nuxtConfig;

  config.mongoose = {
    client: {
      url: "mongodb://127.0.0.1/docs",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    },
  };

  config.static = {
    maxAge: 86400,
    dir: [
      {
        prefix: nuxtConfig.router.base || "/",
        dir: "resources/assets",
      },
      {
        prefix: "/@images/",
        dir: "resources/internalAssets/images",
      },
    ],
  };

  // add your user config here
  const userConfig = {
    admin: {
      account: "cloudroomdocs",
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
