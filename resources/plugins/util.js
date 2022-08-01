import Vue from "vue";

const isString = (ob) => typeof ob === "string";
const isNumber = (ob) => typeof ob === "number";
const isBoolean = (ob) => typeof ob === "boolean";
const isArray = (ob) => ob.isArray();
const isObject = (ob) =>
  Object.prototype.toString.call(ob) === "[object Object]";
const isFunction = (ob) => typeof ob === "function";
// 是否原始类型
const isPerimitive = (ob) =>
  typeof ob === "string" || typeof ob === "number" || typeof ob === "boolean";
const isBlank = (ob) => ob === "" || ob === null || ob === undefined;
const isNotBlank = (ob) => ob !== "" && ob !== null && ob !== undefined;
const clone = (ob) => {
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

const random = (len, unit = 10) => {
  let str = "";
  while (len) {
    len--;
    str += Math.floor(Math.random() * unit).toString(unit);
  }
  return str;
};

const parseURL = (url) => {
  const urlObj = {
    protocol: /^(.+)\:\/\//,
    host: /\:\/\/(.+?)[\?\#\s\/]/,
    path: /\w(\/.*?)[\?\#\s]/,
    query: /\?(.+?)[\#\/\s]/,
    hash: /\#(\w+)\s$/,
  };
  url += " ";
  function formatQuery(str) {
    return str.split("&").reduce(function (a, b) {
      const arr = b.split("=");
      a[arr[0]] = arr[1];
      return a;
    }, {});
  }
  for (const key in urlObj) {
    const pattern = urlObj[key];
    urlObj[key] =
      key === "query"
        ? pattern.exec(url) && formatQuery(pattern.exec(url)[1])
        : pattern.exec(url) && pattern.exec(url)[1];
  }
  return urlObj;
};

const trim = (val) =>
  typeof val === "string" ? val.replace(/^\s+|\s+$/g, "") : val;

const replaceProto = (val) =>
  typeof val === "string" && location.protocol === "https:"
    ? val.replace("http:", "https:")
    : val;

// 搬了elementui的方法过来
const scrollIntoView = (container, selected) => {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  // container 容器
  // selected 当前选中的option
  // top: 选中的元素滚动高度。 bottom：选中的元素滚动高度的底
  // viewRectTop: 当前容器滚动高度。 viewRectBottom：当前容器滚动高度的底
  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  // const bottom = top + selected.offsetHeight;
  // const viewRectTop = container.scrollTop;
  // const viewRectBottom = viewRectTop + container.clientHeight;
  // if (top < viewRectTop) {
  //   container.scrollTop = top; // 当元素在容器之上，将它滚到最前面
  // } else if (bottom > viewRectBottom) {
  //   container.scrollTop = bottom - container.clientHeight;
  // }
  container.scrollTop = top;
};

const $util = {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isPerimitive,
  isBlank,
  isNotBlank,
  clone,
  random,
  parseURL,
  trim,
  replaceProto,
  scrollIntoView,
};

Object.assign(Vue.prototype, { $util });

export default $util;
