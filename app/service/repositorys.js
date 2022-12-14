"use strict";

const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const rimraf = require("rimraf");
const { Service } = require("egg");
const { response } = require("../extend/helper");

class RepositorysService extends Service {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir, "docs");
  }

  async getRepositorys(servicePlatform) {
    const { ctx } = this;
    const repositorys = await ctx.model.Repositorys.find({
      servicePlatform,
    });
    const repos = repositorys.map((repo) => {
      let fullRepo = ["childDir", "repositoryName", "branchName"].reduce(
        (res, key) => {
          if (repo[key]) {
            res += ` --${key}=${repo[key]}`;
          }
          return res;
        },
        repo.repo
      );
      return {
        id: repo.id,
        sort: repo.sort,
        active: repo.active,
        platform: repo.platform,
        repo: repo.repo,
        servicePlatform: repo.servicePlatform,
        fullRepo: fullRepo,
      };
    });
    // const repositorys = await ctx.model.Repositorys.aggregate([
    //   {
    //     $lookup: {
    //       from: "platforms",
    //       localField: "platform",
    //       foreignField: "_id",
    //       as: "platform",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$platform",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       id: 1,
    //       name: 1,
    //       sort: 1,
    //       repo: 1,
    //       active: 1,
    //       // platform: 1,
    //       platform: {
    //         name: 1,
    //         category: 1,
    //       },
    //       // platformid: "$platform._id",
    //       // platformname: "$platform.name",
    //       // category: "$platform.category",
    //     },
    //   },
    //   {
    //     $match: {
    //       "platform.category": category,
    //     },
    //   },
    // ]);
    return repos;
  }

  isGit(repo) {
    return /\.git$/gi.test(repo);
  }

  async createRepository(
    servicePlatform,
    platform,
    repo,
    repositoryName,
    branchName,
    childDir,
    sort
  ) {
    const {
      ctx,
      ctx: { helper },
    } = this;
    const id = helper.crypto(`${servicePlatform}${repo}${childDir}`);
    const isgit = this.isGit(repo);
    if (isgit) {
      await ctx.service.git.pullRepo(
        repo,
        id,
        repositoryName,
        branchName,
        childDir
      );
    } else {
      await ctx.service.svn.pullRepo(repo, id);
    }
    return await ctx.model.Repositorys.create({
      id,
      servicePlatform,
      platform,
      repo,
      sort,
      repositoryName: isgit ? repositoryName : "",
      branchName: isgit ? branchName : "",
      childDir: isgit ? childDir : "",
      config: {},
    });
  }

  async updateRepository(id) {
    const { ctx } = this;
    try {
      const data = await ctx.model.Repositorys.findOne({ id });
      const { repo, repositoryName, branchName, childDir } = data;
      try {
        if (this.isGit(repo)) {
          await ctx.service.git.updateRepo(
            id,
            repositoryName,
            branchName,
            childDir
          );
        } else {
          await ctx.service.svn.updateRepo(id);
        }
        return { status: 204, message: "????????????" };
      } catch (error) {
        ctx.logger.error(`????????????: ${error}`);
        return { status: 503, message: "????????????" };
      }
    } catch (error) {
      ctx.logger.error(`????????????: ${error}`);
      return { status: 400, message: "????????????" };
    }
  }

  async deleteRepository(id) {
    const { ctx } = this;
    try {
      const data = await ctx.model.Repositorys.findOne({ id });
      const filePath = this.joinBaseDir(data.id);
      await ctx.model.Repositorys.deleteOne({ id });
      await rimraf.sync(filePath);
      if (data.active) {
        // ????????????????????? ?????????????????????????????????
        const { servicePlatform, platform } = data;
        await ctx.service.documents.clearCollectionByPlatform(
          servicePlatform,
          platform
        );
      }
    } catch (error) {
      ctx.logger.error(`????????????: ${error}`);
      return "????????????";
    }
    return "????????????";
  }

  // async deleteRepository(id) {
  //   const { ctx } = this;
  //   try {
  //     const data = await ctx.model.Repositorys.findOne({ id }).populate({
  //       path: "platform",
  //       select: "_id",
  //     });
  //     const filePath = this.joinBaseDir(data.id);
  //     await ctx.model.Repositorys.deleteOne({ id });
  //     await rimraf.sync(filePath);
  //     if (data.active) {
  //       // ????????????????????? ?????????????????????????????????
  //       await ctx.service.documents.clearCollectionByPlatform(data.platform);
  //     }
  //   } catch (error) {
  //     ctx.logger.error(`????????????: ${error}`);
  //     return "????????????";
  //   }
  //   return "????????????";
  // }

  async parseConfig(id) {
    const { ctx } = this;
    const data = await ctx.model.Repositorys.findOneAndUpdate(
      { id: id },
      { $set: { active: true } }
    );
    if (!data) {
      return { status: 400, message: "????????????" };
    }
    const repoFileName = data.childDir ? `${id}/${data.childDir}` : id;
    try {
      const filePath = this.joinBaseDir(repoFileName, "config.js");
      // require?????????????????????
      delete require.cache[require.resolve(filePath)];
      const config = require(filePath);
      ctx.logger.info(`??????????????? ${JSON.stringify(config)}`);
      // ??????
      let dirnames = [];
      const { servicePlatform, platform } = data;
      try {
        const dest = path.join(
          this.app.baseDir,
          `resources/assets/${servicePlatform}${platform}`
        );
        // ?????????????????????
        try {
          const deststat = await fs.statSync(dest);
          if (deststat.isDirectory()) {
            await rimraf.sync(dest);
          }
        } catch (error) {
          await fs.mkdirSync(dest);
        }
        const entry = this.joinBaseDir(repoFileName);
        const filesInfos = await this.cpfile([
          { entry, dest, isNeedCurrDirFile: false },
        ]);
        dirnames = filesInfos.map((info) => info.filename);
      } catch (error) {
        console.log(error);
      }
      try {
        // ????????????????????? ?????????????????????????????????
        await ctx.service.documents.clearCollectionByPlatform(
          servicePlatform,
          platform
        );
        // ?????????????????????????????????
        await ctx.service.documents.parseConfigByPlatform(
          servicePlatform,
          platform,
          dirnames,
          repoFileName,
          config.navs
        );
        await ctx.model.Repositorys.updateMany(
          {
            servicePlatform,
            platform,
            active: true,
            _id: {
              $ne: data._id,
            },
          },
          {
            $set: { active: false },
          }
        );
        return { message: "????????????" };
      } catch (error) {
        const msg = "????????????";
        ctx.logger.error(`${msg}: ${error}`);
        return { message: `${msg}: ${error}` };
      }
    } catch (error) {
      const msg = `parseConfig: ${error}`;
      ctx.logger.error(msg);
      return { message: msg };
    }
  }

  async cpfile(arrs) {
    const filesInfo = [];
    for (let i = 0; i < arrs.length; i++) {
      const { entry, dest, isNeedCurrDirFile } = arrs[i];
      const files = await fs.readdirSync(entry);
      for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const filePath = path.join(entry, filename);
        const fileDest = path.join(dest, filename);
        const stat = await fs.statSync(filePath);
        if (stat.isDirectory()) {
          // ??????????????????cp  eg: .svn
          if (!/^\./.test(filename)) {
            filesInfo.push({
              filename,
              entry: filePath,
              dest: fileDest,
              isNeedCurrDirFile: true, // ???????????????????????????????????????
            });
            fs.mkdirSync(fileDest, { recursive: true });
          }
        } else if (isNeedCurrDirFile) {
          await fs.copyFileSync(filePath, fileDest);
        }
      }
    }
    if (filesInfo.length > 0) {
      const dirnames = await this.cpfile(filesInfo);
      filesInfo.push(...dirnames);
    }
    return filesInfo;
  }
}

module.exports = RepositorysService;
