const markdownItAttrs = require("markdown-it-attrs");

module.exports = (md) => {
  md.use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: "${",
    rightDelimiter: "}",
    allowedAttributes: [], // ["class", "id"], // empty array = all attributes are allowed
  });
};
