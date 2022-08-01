const hljs = require("highlight.js");
const cheerio = require("cheerio");
const markdown = require("markdown-it");
const Token = require("markdown-it/lib/token");
// const crypto = require("crypto");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
const markdownContainer = require("./markdown-containers");
const markdownAttrs = require("./markdown-attrs");
loadLanguages([
  "extend",
  "insertBefore",
  "DFS",
  "html",
  "mathml",
  "svg",
  "xml",
  "ssml",
  "atom",
  "rss",
  "clike",
  "js",
  "py",
  "c",
  "cs",
  "dotnet",
  "markup",
  "javascript",
  "css",
  "java",
  "python",
  "cpp",
  "csharp",
  "dart",
  "json",
  "webmanifest",
]);
const langMap = {
  objectivec: "clike",
  oc: "clike",
  "object-c": "clike",
};

/**
 * `<pre></pre>` => `<pre v-pre></pre>`
 * `<code></code>` => `<code v-pre></code>`
 * @param  {string} str
 * @return {string}
 */
const addVuePreviewAttr = function (str) {
  return str.replace(/(<pre|<code)/g, "$1 v-pre");
};

/**
 * renderHighlight
 * @param  {string} str
 * @param  {string} lang
 */
const renderHighlight = function (str, lang) {
  lang = langMap[lang] || lang;
  const prismLang = Prism.languages[lang];
  if (!(lang && prismLang)) {
    return str;
  }
  return Prism.highlight(str, prismLang, lang);
};

/**
 * html => vue file template
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
const renderVueTemplate = function (html, opt) {
  const wrapper = opt.wrapper;
  const htmlParse = opt.htmlParse;
  const $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false,
  });

  const output = {
    style: $.html("style"),
    // get only the first script child. Causes issues if multiple script files in page.
    script: $.html($("script").first()),
  };
  let result;

  $("style").remove();
  $("script").remove();

  typeof htmlParse === "function" && htmlParse($);

  var html = $("body").html() || $.html();
  html = html.replace(/(v-pre=\"\")/g, "v-pre");

  //

  result =
    `<template><${wrapper}>` +
    html +
    `</${wrapper}></template>\n` +
    output.style +
    "\n" +
    output.script;

  return {
    $,
    html,
    vueTemplate: result,
  };
};

module.exports = function (source) {
  let parser, preprocess;
  const params = {};
  const vueMarkdownOptions = this._compilation.__vueMarkdownOptions__;
  let opts = vueMarkdownOptions
    ? Object.create(vueMarkdownOptions.__proto__)
    : {}; // inherit prototype
  let preventExtract = false;

  opts = Object.assign(opts, params, vueMarkdownOptions); // assign attributes

  if (opts.preventExtract) {
    delete opts.preventExtract;
    preventExtract = true;
  }

  if (typeof opts.render === "function") {
    parser = opts;
  } else {
    opts = Object.assign(
      {
        preset: "default",
        html: true,
        langPrefix: "language-",
        breaks: true,
        highlight: renderHighlight,
        wrapper: "div",
      },
      opts
    );

    // var plugins = opts.use;
    preprocess = opts.preprocess;

    delete opts.use;
    delete opts.preprocess;

    parser = markdown(opts.preset, opts);

    // 添加插件
    markdownContainer(parser, { currentNode: vueMarkdownOptions.currentNode });
    markdownAttrs(parser);

    // add ruler:extract script and style tags from html token content
    !preventExtract &&
      parser.core.ruler.push(
        "extract_script_or_style",
        function replace(state) {
          const tag_reg = new RegExp("<(script|style)(?:[^<]|<)+</\\1>", "g");
          const newTokens = [];
          state.tokens
            .filter((token) => token.type == "fence" && token.info == "html")
            .forEach((token) => {
              const tokens = (token.content.match(tag_reg) || []).map(
                (content) => {
                  const t = new Token("html_block", "", 0);
                  t.content = content;
                  return t;
                }
              );
              if (tokens.length > 0) {
                newTokens.push.apply(newTokens, tokens);
              }
            });
          state.tokens.push.apply(state.tokens, newTokens);
        }
      );
  }

  /**
   * override default parser rules by adding v-pre attribute on 'code' and 'pre' tags
   * @param {Array<string>} rules rules to override
   */
  function overrideParserRules(rules) {
    if (parser && parser.renderer && parser.renderer.rules) {
      const parserRules = parser.renderer.rules;
      rules.forEach(function (rule) {
        if (parserRules && parserRules[rule]) {
          const defaultRule = parserRules[rule];
          parserRules[rule] = function () {
            return addVuePreviewAttr(defaultRule.apply(this, arguments));
          };
        }
      });
    }
  }

  overrideParserRules(["code_inline", "code_block", "fence"]);

  if (preprocess) {
    source = preprocess.call(this, parser, source);
  }

  source = source.replace(/@/g, "__at__");

  const content = parser.render(source).replace(/__at__/g, "@");
  const result = renderVueTemplate(content, opts);

  if (opts.raw) {
    return result;
  } else {
    return "module.exports = " + JSON.stringify(result);
  }
};
