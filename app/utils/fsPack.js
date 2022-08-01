"use strict";

const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

class FsPack {
  constructor() {}

  async getFileInfomation(entry, filename) {
    const filePath = filename ? path.join(entry, filename) : entry;
    const stat = await fs.statSync(filePath);
    const isDir = stat.isDirectory();
    if (!filename) {
      filename = filePath.split(path.sep).pop();
    }
    return {
      stat,
      filename,
      isDir,
      children: [],
    };
  }

  async getFolderInfo(entry = "", callback) {
    if (!entry) return { error: "entry path is not empty!" };
    try {
      const folderInfo = (await callback)
        ? callback(entry)
        : this.getFileInfomation(entry);
      if (!folderInfo.isDir) {
        return { error: "entry target is not folder" };
      }
      const files = await fs.readdirSync(entry);
      for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const fileInfo = await this.getFileInfomation(entry, filename);
        folderInfo.children.push(fileInfo);
      }
      return folderInfo;
    } catch (error) {
      return {};
    }
  }

  // 以ES6导出的形式保存一个对象或者数组到文件
  async saveStrToFile({ saveBaseUrl, filename }, fileObject) {
    const router = filename ? path.join(saveBaseUrl, filename) : filename;
    const fileStr = `export default ${JSON.stringify(fileObject)}`;
    await fs.writeFileSync(router, fileStr);
  }

  // 以ES6导出的形式追加一个对象到文件
  async saveStrAppendToFile({ saveBaseUrl, filename, key }, fileObject) {
    const router = filename ? path.join(saveBaseUrl, filename) : filename;
    let newFileObject = {
      [key]: fileObject,
    };
    try {
      const oldFileStr = await fs.readFileSync(router).toString();
      if (oldFileStr) {
        const str = /^export default (.*)/.exec(oldFileStr)[1];
        newFileObject = JSON.parse(str);
        if (key) {
          newFileObject[key] = fileObject;
        } else {
          throw new Error("key is not empty");
        }
      }
    } catch (error) {}
    const fileStr = `export default ${JSON.stringify(newFileObject)}`;
    await fs.writeFileSync(router, fileStr);
  }

  async clearFile() {
    // await rimraf.sync(`${destAssetsData}/*`);
    // await rimraf.sync(`${destBaseUrl}/*`);
  }

  // 深度遍历树
  AFS() {}

  // 广度遍历树
  BFS(...rest) {
    const data = rest[0] || [];
    const maxLevel = typeof rest[1] === "number" ? rest[1] : 0;
    const callback =
      typeof rest[2] === "function"
        ? rest[2]
        : typeof rest[1] === "function"
        ? rest[1]
        : function () {};

    const currData = data;
    const storeData = [];
    let level = 0;
    let index = 0;
    while (currData && (maxLevel === 0 || maxLevel >= level)) {
      const currNode = currData[index];
      callback(currNode, currData, index);
      if (currNode.children && currNode.children.length > 0) {
        storeData.push(...currNode.children);
      }
      index++;
      if (index === currData.length) {
        currData = storeData;
        storeData = [];
        index = 0;
        level++;
      }
    }
  }
}

module.exports = new FsPack();
