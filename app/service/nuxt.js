"use strict";

const path = require("path");
const { Service } = require("egg");
const resolve = path.resolve;
const { Nuxt, Builder, Generator } = require("nuxt");

let instance = null;
let isbuilding = false;
class NuxtService extends Service {
  constructor(ctx) {
    super(ctx);
    this.resolveDirname = path.join.bind(null, this.app.baseDir);
  }

  async build(dev) {
    const { ctx, app, resolveDirname } = this;
    ctx.logger.info("NuxtService build");
    const servicePlatforms = await ctx.service.servicePlatforms.getServicePlatforms();
    const nuxtConfig = app.config.nuxtConfig;
    nuxtConfig.router.extendRoutes = (routes) => {
      servicePlatforms.forEach((servicePlatform) => {
        const category = servicePlatform.name;
        // routes.push({
        //   name: `${category}`,
        //   path: `/${category}/:nav/:slidebar/:page`,
        //   component: resolveDirname("resources/pages/article/index.vue"),
        //   chunkName: "article",
        // });

        routes.push(
          {
            name: `${category}`,
            path: `/${category}`,
            component: resolveDirname("resources/pages/category/index.vue"),
            chunkName: `pages/category/index`,
          },
          {
            name: `${category}-nav`,
            path: `/${category}/:nav`,
            component: resolveDirname(
              "resources/pages/category/_nav/index.vue"
            ),
            chunkName: `pages/category/_nav/index`,
          },
          {
            name: `${category}-nav-slidebar`,
            path: `/${category}/:nav/:slidebar`,
            component: resolveDirname(
              "resources/pages/category/_nav/_slidebar/index.vue"
            ),
            chunkName: `pages/category/_nav/_slidebar/index`,
          },
          {
            name: `${category}-nav-slidebar-page`,
            path: `/${category}/:nav/:slidebar/:page`,
            component: resolveDirname(
              "resources/pages/category/_nav/_slidebar/_page/index.vue"
            ),
            chunkName: `pages/category/_nav/_slidebar/_page/index`,
          }
        );
      });

      routes.push({
        name: "notfound",
        path: "*",
        component: resolveDirname("resources/pages/404.vue"),
      });
    };
    const config = Object.assign(nuxtConfig, { dev });
    instance = new Nuxt(config);
    await new Builder(instance).build();
  }

  async render(req, res) {
    if (!instance && !isbuilding) {
      isbuilding = true;
      await this.build(process.env.NODE_ENV !== "production");
    }
    return new Promise((resolve, reject) => {
      instance.render(req, res, (promise) => {
        promise.then(resolve).catch(reject);
      });
    });
  }

  async generate() {
    const { baseDir } = this.app;
    const config = Object.assign(this.app.config.nuxtConfig, {
      generate: {
        dir: resolve(baseDir, "nuxtDist"),
      },
      dev: false,
      buildDir: resolve(baseDir, "nuxtDist1"),
    });
    const instance = new Nuxt(config);
    await new Builder(instance).build();
    await new Generator(instance).generate({ build: false });
  }
}

module.exports = NuxtService;
