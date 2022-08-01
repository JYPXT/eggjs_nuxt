"use strict";

const path = require("path");
const fs = require("fs");
const { Service } = require("egg");
const rimraf = require("rimraf");

class PlatformsService extends Service {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir, "docs");
  }

  async getPlatforms(servicePlatform, cnav) {
    const { ctx } = this;
    const activeRepos = await ctx.model.Repositorys.find({
      servicePlatform,
      active: true,
      platform: {
        $ne: "public",
      },
    });
    const servicePlatforms = await ctx.model.ServicePlatforms.findOne({
      name: servicePlatform,
    });
    const spps = JSON.parse(JSON.stringify(servicePlatforms.platforms || []));
    const reposPlatform = activeRepos.map((arepo) => ({
      platform: arepo.platform,
    }));
    const condition = {
      $or: reposPlatform,
      type: "nav",
      servicePlatform,
    };
    cnav && (condition.name = cnav);

    const navs = await ctx.model.Navs.find(condition)
      .sort({ sort: 1 })
      .select("_id platform redirect");

    return navs
      .map((n) => {
        const ob = spps.find((p) => p.name === n.platform);
        return {
          sort: ob.sort,
          label: ob.label,
          type: ob.type,
          value: n.platform,
          route: n.redirect,
        };
      })
      .sort((a, b) => a.sort - b.sort);
  }

  // async getPlatforms(servicePlatform) {
  //   const { ctx } = this;
  //   const activeRepos = await ctx.model.Repositorys.find({
  //     servicePlatform,
  //     active: true,
  //     platform: {
  //       $ne: "public",
  //     },
  //   });
  //   const result = [];
  //   for (let i = 0; i < activeRepos.length; i++) {
  //     const platform = activeRepos[i].platform;
  //     const navs = await ctx.model.Navs.find({
  //       $or: [
  //         {
  //           platform: "public",
  //         },
  //         {
  //           platform,
  //         },
  //       ],
  //       type: "nav",
  //       servicePlatform,
  //     })
  //       .sort({ sort: 1 })
  //       .select("_id platform redirect");

  //     // 按当前平台的sort排序取第一个nav
  //     // 按（当前平台 + public）总的排序, 根据route取redirect
  //     for (let n = 0; n < navs.length; n++) {
  //       const nav = navs[n];
  //       if (nav.platform === platform) {
  //         for (let n1 = 0; n1 < navs.length; n1++) {
  //           const na = navs[n1];
  //           if (na.route === nav.route) {
  //             result.push({
  //               label: platform,
  //               value: platform,
  //               route: na.redirect,
  //             });
  //             break;
  //           }
  //         }
  //         break;
  //       }
  //     }
  //   }
  //   return result;
  // }

  // async getPlatforms(category) {
  //   const { ctx } = this;
  //   const activeRepos = await ctx.model.Repositorys.aggregate([
  //     {
  //       $lookup: {
  //         from: "platforms",
  //         localField: "platform",
  //         foreignField: "_id",
  //         as: "platform",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$platform",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         id: 1,
  //         name: 1,
  //         sort: 1,
  //         repo: 1,
  //         active: 1,
  //         platform: "$platform.name",
  //         category: "$platform.category",
  //       },
  //     },
  //     {
  //       $match: {
  //         active: true,
  //         category,
  //         platform: { $ne: "public" },
  //       },
  //     },
  //   ]);

  //   const result = [];
  //   for (let i = 0; i < activeRepos.length; i++) {
  //     const platform = activeRepos[i].platform;
  //     const navs = await ctx.model.Navs.find({
  //       $or: [
  //         {
  //           platform: "public",
  //         },
  //         {
  //           platform,
  //         },
  //       ],
  //       type: "nav",
  //       servicePlatform: category,
  //     })
  //       .sort({ sort: 1 })
  //       .select("_id platform redirect");

  //     // 按当前平台的sort排序取第一个nav
  //     // 按（当前平台 + public）总的排序, 根据route取redirect
  //     for (let n = 0; n < navs.length; n++) {
  //       const nav = navs[n];
  //       if (nav.platform === platform) {
  //         for (let n1 = 0; n1 < navs.length; n1++) {
  //           const na = navs[n1];
  //           if (na.route === nav.route) {
  //             result.push({
  //               label: platform,
  //               value: platform,
  //               route: na.redirect,
  //             });
  //             break;
  //           }
  //         }
  //         break;
  //       }
  //     }
  //   }
  //   return result;
  // }

  // async createPlatform({ name, repo, sort }) {
  //   const { ctx } = this;
  //   try {
  //     await ctx.service.svn.pullRepo(repo, name);
  //   } catch (error) {
  //     ctx.logger.error(`SVN地址错误: ${error}`);
  //     return { code: 400, message: "SVN地址错误" };
  //   }
  //   const result = await ctx.model.Platforms.create({ name, repo, sort });
  //   return {
  //     data: {
  //       id: result.id,
  //       name: result.name,
  //       sort: result.sort,
  //       repo: result.repo,
  //     },
  //   };
  // }

  // async deletePlatform(id) {
  //   const { ctx } = this;
  //   try {
  //     const data = await ctx.model.Platforms.findById(id);
  //     const filePath = this.joinBaseDir(data.id);
  //     await rimraf.sync(filePath);
  //     await ctx.model.Platforms.deleteOne({ _id, id });
  //   } catch (error) {
  //     ctx.logger.error(`参数错误: ${error}`);
  //     return "参数错误";
  //   }
  //   return "删除平台成功";
  // }
}

module.exports = PlatformsService;
