const path = require("path");
const join = (dir) => path.join(__dirname, "..", dir);

module.exports = {
  NODE_ENV: "development",
  logger: {
    dir: join("logs/dev"),
  },
  ignoreDirs: ["app/nuxt"],
  wkhtmltopdf: {
    // command: "D:\\tool\\wkhtmltopdf\\bin\\wkhtmltopdf",
    command: "E:\\wkhtmltopdf\\bin\\wkhtmltopdf",
  },
};
