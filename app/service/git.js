"use strict";

const path = require("path");
const { Service } = require("egg");
const git = require("gift");
const fs = require("fs");
const rimraf = require("rimraf");
const exec = require("flex-exec"); // gift用到了

class GitService extends Service {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir, "docs");
  }

  // 拉
  async pullRepo(repository, name, repositoryName, branchName, childDir) {
    const pwd = this.joinBaseDir(name);
    try {
      const pwdstat = await fs.statSync(pwd);
      if (pwdstat.isDirectory()) {
        await rimraf.sync(pwd);
      }
    } catch (error) {}
    return new Promise(async (resolve, reject) => {
      // 指定拉取子文件夹
      if (childDir) {
        await fs.mkdirSync(pwd);
        git.init(pwd, false, (err, repo) => {
          if (err) {
            throw new Error(err);
          } else {
            repo.remote_add(repositoryName, repository, (err) => {
              repo.git("config", {}, ["core.sparseCheckout", "true"], (err) => {
                fs.writeFile(
                  `${pwd}/.git/info/sparse-checkout`,
                  `${childDir}/*`,
                  (err) => {
                    if (!err) {
                      repo.pull(repositoryName, branchName, (err) => {
                        if (err) {
                          throw new Error(err);
                        } else {
                          resolve(repo);
                        }
                      });
                    }
                  }
                );
              });
            });
          }
        });
      } else {
        // clone整个仓库
        git.clone(repository, pwd, null, null, (err, repo) => {
          if (err) {
            reject(err);
          } else {
            repo.pull(repositoryName, branchName, (err) => {
              if (err) {
                throw new Error(err);
              } else {
                resolve(repo);
              }
            });
          }
        });
      }
    });
  }

  // 更新
  async updateRepo(name, repositoryName, branchName, childDir) {
    const pwd = this.joinBaseDir(name);
    const repo = git(pwd);
    return await new Promise((resolve, reject) => {
      repo.pull(repositoryName, branchName, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = GitService;
