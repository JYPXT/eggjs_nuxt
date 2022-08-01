const markdownIt = require("markdown-it");
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
loadLanguages(["html", "js", "css", "java", "python", "cpp", "csharp", "dart"]);

const renderHighlight = function (str, lang) {
  const prismLang = Prism.languages[lang];
  if (!(lang && prismLang)) {
    return "";
  }
  return Prism.highlight(str, prismLang, lang);
};

const md = markdownIt("default", {
  preset: "default",
  html: true,
  langPrefix: "language-",
  breaks: true,
  highlight(str, lang) {
    var lang = lang || "js";
    // return `<div class='language-${lang}'>${renderHighlight(str, lang)}</div>`;
    return renderHighlight(str, lang);
  },
  wrapper: "div",
});

module.exports.markdownRender = (str) => md.render(str);
module.exports.markdownRenderInline = (str) => md.renderInline(str);
