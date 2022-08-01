"use strict";

const path = require("path");
const { Service } = require("egg");
const SVN = require("svn-spawn");

class SvnService extends Service {
  constructor(ctx) {
    super(ctx);
    const { baseDir } = this.app;
    this.joinBaseDir = path.join.bind(null, baseDir, "docs");
    this.users = {
      // cwd //仓库存放的目录
      username: "",
      password: "",
      noAuthCache: true,
    };
    this.clients = {};
  }

  getClient(name) {
    if (!this.clients[name]) {
      this.clients[name] = new SVN(
        Object.assign({}, this.users, { cwd: this.joinBaseDir(name) })
      );
    }
    return this.clients[name];
  }

  // 拉
  async pullRepo(repository, name) {
    const client = this.getClient(name);
    return await new Promise((resolve, reject) => {
      client.checkout(repository, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // 更新
  async updateRepo(name) {
    const client = this.getClient(name);
    return await new Promise((resolve, reject) => {
      client.update((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // async getSvnInfo(client) {
  //   const data = await new Promise((resolve, reject) => {
  //     client.getInfo((err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  //   return data;
  // }

  // async getRepoStatus(client) {
  //   const data = await new Promise((resolve, reject) => {
  //     client.getStatus((err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  //   return data;
  // }

  // async getRepoLog(client) {
  //   const data = await new Promise((resolve, reject) => {
  //     client.getLog((err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  //   return data;
  // }

  // async pushRepo(client, message) {
  //   const data = await new Promise((resolve, reject) => {
  //     client.addLocal((err, data) => {
  //       console.log("all local changes has been added for commit");
  //       client.commit(message, (err, data) => {
  //         resolve("提交成功!");
  //       });
  //     });
  //   });
  //   // 单文件
  //   // client.add('relative/path/to/file', function(err, data) {
  //   //     client.commit(['commit message here', 'relative/path/to/file'], function(err, data) {
  //   //         console.log('committed one file!');
  //   //     });
  //   // });
  //   await this.updateRepo(client);
  //   return data;
  // }
}

module.exports = SvnService;
