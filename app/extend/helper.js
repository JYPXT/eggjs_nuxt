"use strict";

const crypto = require("crypto");
const isString = (ob) => typeof ob === "string";
const isNumber = (ob) => typeof ob === "number";
const isBoolean = (ob) => typeof ob === "boolean";
const isArray = (ob) => Array.isArray(ob);
const isObject = (ob) => toString.call(ob) === "[object Object]";
const isFunction = (ob) => typeof ob === "function";
// 是否原始类型
const isPerimitive = (ob) =>
  typeof ob === "string" || typeof ob === "number" || typeof ob === "boolean";
const isEmpty = (ob) => ob === "" || ob === null || ob === undefined;
const isNotEmpty = (ob) => ob !== "" && ob !== null && ob !== undefined;
const isBlank = (ob) =>
  ob === "" ||
  ob === null ||
  ob === undefined ||
  ob === "null" ||
  ob === "undefined";
const isNotBlank = (ob) =>
  ob !== "" &&
  ob !== null &&
  ob !== undefined &&
  (ob !== "null") & (ob !== "undefined");
const clone = function (ob) {
  if (isArray(ob)) {
    const result = [];
    for (let o = 0; o < ob.length; o++) {
      result[o] = clone(ob[o]);
    }
    return result;
  } else if (isObject(ob)) {
    const result = {};
    for (const o in ob) {
      result[o] = clone(ob[o]);
    }
    return result;
  }
  return ob;
};

module.exports = {
  response(message) {
    const res = {
      message: "",
    };
    if (typeof message === "string") {
      res.message = message;
    } else {
      Object.assign(res, message);
      if (res.status) {
        this.ctx.status = res.status;
        delete res.status;
      }
    }
    return res;
  },

  // getConditionPlatformByCategory(condition, category) {
  //   const ob = {};
  //   category = category || condition.category;
  //   if (category === "sdk") {
  //     for (const key in condition) {
  //       if (key === "platform") {
  //         const ors = [
  //           {
  //             platform: "public",
  //           },
  //           {
  //             platform: condition[key],
  //           },
  //         ];
  //         ob["$or"] ? ob["$or"].push(...ors) : ob["$or"] = ors;
  //       } else if (key !== "$or") {
  //         ob[key] = condition[key];
  //       }
  //     }
  //     return ob;
  //   }
  //   return condition;
  // },

  crypto(str, type = "md5") {
    return crypto.createHash(type).update(str).digest("hex");
  },

  salt(len = 4) {
    let salt = "";
    for (let i = 0; i < len; i++) {
      const num = Math.floor(Math.random() * 36);
      salt += num.toString(36);
    }
    return salt;
  },
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isPerimitive,
  isEmpty,
  isNotEmpty,
  isBlank,
  isNotBlank,
  clone,
};
