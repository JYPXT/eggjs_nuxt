"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Service } = require("egg");
const uuid = require("uuid");
const matter = require("gray-matter");
const markdownCompiler = require("../utils/markdown-compiler");

class DocumentsService extends Service {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir, "docs");
    this.resolveBaseDir = path.resolve.bind(null, baseDir);
    this.articles = {};
    this.articlesAlias = {};
  }

  async clearCollectionByPlatform(servicePlatform, platform) {
    // 删了对应平台的 导航栏、文章、搜索数据
    try {
      await this.ctx.model.Navs.deleteMany({
        platform,
        servicePlatform,
      });
      this.ctx.logger.info("drop Navs");
    } catch (error) {
      this.ctx.logger.error("drop Navs" + error);
    }
    try {
      await this.ctx.model.Articles.deleteMany({
        platform,
        servicePlatform,
      });
      this.ctx.logger.info("drop Articles");
    } catch (error) {
      this.ctx.logger.error("drop Articles" + error);
    }
    try {
      await this.ctx.model.Datas.deleteMany({
        platform,
        servicePlatform,
      });
      this.ctx.logger.info("drop Datas");
    } catch (error) {
      this.ctx.logger.error("drop Datas" + error);
    }
  }

  async parseConfigByPlatform(
    servicePlatform,
    platformName,
    dirnames,
    repoFileName,
    navs
  ) {
    const {
      ctx: { helper },
    } = this;
    this.articles = {};
    this.articlesAlias = {};
    for (let iNav = 0; iNav < navs.length; iNav++) {
      const nav = navs[iNav];
      const navRoute = `/${servicePlatform}/${nav.route}`;
      const navId = helper.crypto(servicePlatform + platformName + navRoute);
      const navInfo = {
        id: navId,
        title: nav.title,
        name: nav.route,
        route: navRoute,
        redirect: "",
        platform: platformName,
        servicePlatform,
        type: "nav",
        layout: nav.layout || "common", // 默认布局文件名都使用跟servicePlatform相同名字
        sort: typeof nav.sort === "number" ? nav.sort : iNav,
      };
      const nSlidebar = nav.slidebar;
      if (nSlidebar) {
        for (let iSbar = 0; iSbar < nSlidebar.length; iSbar++) {
          const sbar = nSlidebar[iSbar];
          const isHttpLink = /^https?/.test(sbar.route);
          const slidebarRoute = isHttpLink
            ? sbar.route
            : `${navInfo.route}/${sbar.route}`;
          const slidebarId = helper.crypto(
            servicePlatform + platformName + slidebarRoute
          );
          const slidebarrRedirect = isHttpLink ? sbar.route : "";
          const slidebarInfo = {
            id: slidebarId,
            navId,
            title: sbar.title,
            name: sbar.route,
            route: slidebarRoute,
            redirect: slidebarrRedirect,
            platform: platformName,
            servicePlatform,
            type: "slidebar",
            sort: typeof sbar.sort === "number" ? sbar.sort : iSbar,
            islink: !!sbar.islink || false,
          };
          const sbarChildren = sbar.children;
          if (sbarChildren) {
            for (let iMd = 0; iMd < sbarChildren.length; iMd++) {
              const iMdCfg = sbarChildren[iMd];
              const articleOpt =
                typeof iMdCfg === "string" ? { link: iMdCfg } : iMdCfg;
              const mdFilePath = path.join(repoFileName, articleOpt.link);
              const isHttpLink = /^https?/.test(articleOpt.link);
              if (isHttpLink) {
                const aId = helper.crypto(
                  servicePlatform + platformName + articleOpt.link
                );
                await this.ctx.model.Articles.create({
                  id: aId,
                  title: iMdCfg.title || articleOpt.link,
                  navId,
                  slidebarId,
                  route: articleOpt.link,
                  platform: platformName,
                  servicePlatform,
                  sort: iMd,
                });
              } else if (articleOpt.link) {
                const filename = path.basename(mdFilePath).replace(".md", "");
                const article = {
                  navId,
                  navRoute: nav.route,
                  slidebarId,
                  platform: platformName,
                  servicePlatform,
                  filePath: mdFilePath,
                  sort: iMd,
                  name: filename,
                  route: `${slidebarRoute}/${filename}`,
                };
                iMdCfg.title && (article.title = iMdCfg.title); // 配置有传title就用title
                this.articles[filename] = article;
                // 配置有传alias就用来特殊处理，只有H5解析A标签用到
                iMdCfg.alias && (this.articlesAlias[iMdCfg.alias] = article);
                // 保存第一个md的路由到他们的redirect字段
                if (iMd === 0 && !slidebarInfo.redirect) {
                  slidebarInfo.redirect = article.route;
                  if (iSbar === 0 && !navInfo.redirect) {
                    navInfo.redirect = article.route;
                  }
                }
              }
            }
          }
          // 保存sliderbar
          try {
            await this.ctx.model.Navs.create(slidebarInfo);
          } catch (error) {
            this.ctx.logger.error("create slidebarInfo" + error);
          }
        }
        // 保存nav
        try {
          await this.ctx.model.Navs.create(navInfo);
        } catch (error) {
          this.ctx.logger.error("create navInfo" + error);
        }
      }
    }
    // 开始编译文章。 每篇文章的超链接可能是其他文章，所有文章改成在这里处理
    if (platformName !== "public") {
      // 公有的也合并进来, 但不解析
      const publicArticles = await this.ctx.model.Articles.find({
        platform: "public",
      });
      publicArticles.forEach((art) => {
        const filename = art.route.split("/").pop();
        this.articles[filename] = {
          route: art.route,
          platform: platformName,
          isPublic: true,
        };
      });
    }
    for (const artKey in this.articles) {
      const article = this.articles[artKey];
      if (!article.isPublic) {
        await this.parseMarkdown(article, dirnames);
      }
    }
  }

  async getNavs(servicePlatform, platform) {
    const { ctx } = this;
    const navs = await ctx.model.Navs.find({
      $or: [
        {
          platform,
        },
        {
          platform: "public",
        },
      ],
      servicePlatform,
      type: "nav",
    })
      .sort({ sort: 1 })
      .select("_id title route redirect platform sort");
    const sortKey = [];
    const result = navs.reduce((res, nav) => {
      res[`${nav.route}`] = nav;
      !sortKey.includes(nav.route) && sortKey.push(nav.route);
      if (nav.platform !== "public" && res[`${nav.route}`]) {
        const redirect = res[`${nav.route}`].redirect;
        Object.assign(nav, { redirect });
      }
      return res;
    }, {});

    return sortKey.map((key) => result[key]);
  }

  async getLayout() {
    const { ctx } = this;
    const layouts = ctx.model.Navs.aggregate([
      {
        $match: {
          type: "nav",
          platform: {
            $ne: "public",
          },
        },
      },
      {
        $project: {
          layout: 1,
          name: 1,
          platform: 1,
          servicePlatform: 1,
        },
      },
    ]);
    return layouts;
  }

  async getSlidebars(nid) {
    const { ctx } = this;
    const nav = await ctx.model.Navs.findById(nid);
    const navRouteReg = new RegExp(`^${nav.route}`);
    const slidebars = await ctx.model.Navs.find({
      $or: [
        {
          navId: nav.id,
        },
        {
          platform: "public",
          route: {
            $regex: navRouteReg,
          },
        },
      ],
      type: "slidebar",
    })
      .sort({ sort: 1 })
      .select("_id id title route islink redirect"); // platform
    const mds = await ctx.model.Articles.find({
      $or: [
        {
          navId: nav.id,
        },
        {
          platform: "public",
        },
      ],
    })
      .sort({ sort: 1 })
      .select("_id slidebarId title route");
    //  platform anchors content yamlOption
    const result = slidebars.map((slidebar) => {
      const children = mds
        .filter((md) => md.slidebarId === slidebar.id)
        .map((md) => ({
          id: md._id,
          title: md.title,
          route: md.route,
          islink: true,
          isslidebar: false,
        }));
      if (slidebar.islink) {
        children.shift();
      }
      return {
        id: slidebar.id,
        title: slidebar.title,
        route: slidebar.route,
        redirect: slidebar.redirect,
        children,
        islink: slidebar.islink,
        isslidebar: true,
      };
    });
    return result;
  }

  async getActicle(id) {
    return await this.ctx.model.Articles.findOne({
      _id: id,
    }).select("_id slidebarId title route platform anchors content yamlOption");
  }

  async getActicleByRoute(route, platform) {
    return await this.ctx.model.Articles.findOne({
      route,
      $or: [
        {
          platform,
        },
        {
          platform: "public",
        },
      ],
    }).select("_id slidebarId title route platform anchors content yamlOption");
  }

  async parseMarkdown(currentNode, dirnames) {
    const filePath = this.joinBaseDir(currentNode.filePath);
    const context = await fs.readFileSync(filePath, {
      encoding: "utf8",
    });
    const yamlParse = matter(context);
    // yaml 解析出来的配置
    currentNode.yamlOption = yamlParse.data;
    // mdToVue vue文件字符串
    const { $, html } = markdownCompiler.call(
      {
        _compilation: {
          __vueMarkdownOptions__: {
            preventExtract: true,
            raw: true,
            currentNode,
            htmlParse: ($) => {
              // 处理锚点，没有id的就生成一个
              this.resolveAnchor($);
              // 处理a标签超链接
              this.resolveAHref($, currentNode, dirnames);
              // 处理/images开头的图片资源
              this.resolveImages($, currentNode);
            },
          },
        },
      },
      yamlParse.content
    );
    // 收集锚点
    const { title, anchors } = await this.collectData($);
    if (!currentNode.title) {
      currentNode.title = title;
    }
    // 解析的md内容
    const articleId = crypto
      .createHash("md5")
      .update(currentNode.filePath + currentNode.platform)
      .digest("hex");
    const Article = {
      id: articleId,
      filePath: currentNode.filePath,
      navId: currentNode.navId,
      slidebarId: currentNode.slidebarId,
      yamlOption: currentNode.yamlOption,
      title: currentNode.title,
      name: currentNode.name,
      route: currentNode.route,
      content: html,
      mdContent: context,
      anchors,
      platform: currentNode.platform,
      servicePlatform: currentNode.servicePlatform,
    };
    await this.ctx.model.Articles.create(Article);
    // 收集搜索数据
    await this.collectSearchData(currentNode, $);
    return Article;
  }

  // 处理锚点，没有id的就生成一个
  resolveAnchor($) {
    let anchorIdx = 0;
    $("h1, h2, h3").each((i, dom) => {
      const $dom = $(dom);
      const text = $(dom).text();
      if (!dom.attribs.id && !$dom.attr(":id")) {
        if (!/{{.*}}/.test(text)) {
          $dom.attr("id", `doc_${++anchorIdx}`);
        }
      }
    });
  }

  // 处理md文件的超链接
  resolveAHref($, currentNode, dirnames) {
    const configbaseURL = this.app.config.nuxtConfig.router.base;
    const baseURL = configbaseURL
      ? configbaseURL.substr(0, configbaseURL.length - 1)
      : "";
    $("a").each((i, dom) => {
      let { href } = dom.attribs;
      if (href) {
        // http、https的加个target
        if (/^https?:/.test(href)) {
          const target = $(dom).attr("target");
          if (!target) {
            $(dom).attr("target", "_blank");
          }
        } else {
          const dirReg = new RegExp(`\/?(${dirnames.join("|")})`);
          const idx = href.lastIndexOf("/");
          idx === 0 && (href = href.replace(/^\//, "")); // /开头的删掉
          const idx1 = href.indexOf("#");
          let hash = null;
          if (idx === -1 || idx === 0) {
            let mdfilename = null;
            if (idx1 === -1) {
              mdfilename = href; // 没#
            } else {
              const arr = href.split("#");
              mdfilename = arr[0]; // 有#
              hash = arr[1];
            }
            mdfilename = mdfilename.replace(".md", "").replace(".html", "");
            const article =
              this.articles[mdfilename] || this.articlesAlias[mdfilename];
            if (article) {
              // hash 会触发浏览器的滚动，覆盖了自定义的滚动方法
              const newHref = hash
                ? `${baseURL}${article.route}?platform=${article.platform}#${hash}`
                : `${baseURL}${article.route}?platform=${article.platform}`;
              $(dom).attr("href", newHref);
            }
          } else if (dirReg.test(href)) {
            // 跟从svn cp过来的文件夹名匹配得上的
            if (href.charAt(0) !== "/") {
              // href 开头不是/的需要给补上
              $(dom).attr("href", `${baseURL}/${currentNode.servicePlatform}${currentNode.platform}/${href}`);
            } else {
              $(dom).attr("href", `${baseURL}/${currentNode.servicePlatform}${currentNode.platform}${href}`);
            }
          }
        }
      }
    });
  }

  resolveImages($, currentNode) {
    const baseURL = this.app.config.nuxtConfig.router.base || "/";
    const baseSrc = `${baseURL}${currentNode.servicePlatform}${currentNode.platform}`;
    $("img").each((i, dom) => {
      let { src } = dom.attribs;
      if (src && /^\/images/.test(src)) {
        $(dom).attr("src", `${baseSrc}${src}`);
      } else if (/^\.\/images/.test(src)) {
        src = src.replace(".", "");
        $(dom).attr("src", `${baseSrc}${src}`);
      }
    });
  }

  createAnchor($, dom) {
    const $dom = $(dom);
    const id = $dom.attr("id");
    const label = $dom.text();
    return {
      id: id || label,
      label,
      tag: dom.name,
      children: [],
    };
  }

  async collectData($) {
    const anchors = [];
    let anchor = {};
    let zhTitle = null;
    const createAnchor = this.createAnchor.bind(this, $);
    $("h1, h2, h3").each((i, dom) => {
      const level = /\h(\d+)/i.exec(dom.name)[1];
      switch (level) {
        case "1":
          if (!zhTitle) {
            zhTitle = $(dom).text();
          }
          break;
        case "2":
          anchor = createAnchor(dom);
          anchors.push(anchor);
          break;
        case "3":
          if (anchor) {
            anchor.children && anchor.children.push(createAnchor(dom));
          }
          break;
        case "4":
          // 本来是抓取123的，现在1不需要，3改成4先放着
          if (anchor && anchor.children && anchor.children.length) {
            const len = anchor.children.length;
            const cAnchor = anchor.children[len - 1];
            if (cAnchor) {
              cAnchor.children.push(createAnchor(dom));
            } else {
              anchor.children.push(createAnchor(dom));
            }
          }
          break;
      }
    });
    return {
      title: zhTitle,
      anchors,
    };
  }

  async collectSearchData(
    { name, title, route, navRoute, platform, servicePlatform },
    $
  ) {
    const ob = {
      anchorId: "",
      title: "",
      navRoute, // navRoute
      platform,
      servicePlatform,
    };
    const tags = ["h1", "h2", "h3"];
    const currNodeQuery = tags.join(",");
    let currNode = $($(currNodeQuery).get(0));
    try {
      while (currNode && currNode[0] && currNode.prop("nodeName")) {
        const tag = currNode.prop("nodeName").toLocaleLowerCase();
        const domtext = currNode.text();
        const text = domtext ? domtext.replace(/^\s+|\s+$/g, "") : "";
        if (tags.includes(tag)) {
          ob.anchorId = currNode.attr("id");
          ob.title = currNode.text();
          ob.crumbs = title === ob.title ? ob.title : `${title} > ${ob.title}`;
        } else if (text) {
          const context = Object.assign({ tag, content: text, route }, ob);
          this.ctx.model.Datas.create(context);
        }
        currNode = currNode.next();
      }
    } catch (error) {
      this.ctx.logger.error(
        `collectSearchData: name -> ${name}, currNode[0] -> ${currNode[0]}, currNodeText -> ${currNode.text}, `
      );
    }
  }

  async search({ category, platform, text, skip, pagesize }) {
    const { ctx } = this;
    const texts = text
      .replace(/^\s+|\s+$/g, "")
      .split(" ")
      .join("|");
    const reg = new RegExp(`(${texts}+)`, "ig");
    return await ctx.model.Datas.find({
      $and: [
        {
          $or: [
            {
              title: reg,
            },
            {
              content: reg,
            },
          ],
        },
        {
          $or: [
            {
              platform,
            },
            {
              platform: "public",
            },
          ],
        },
      ],
      servicePlatform: category,
    })
      .skip(skip)
      .limit(pagesize)
      .select(
        "_id anchorId title crumbs content route platform servicePlatform"
      );
  }
}

module.exports = DocumentsService;
