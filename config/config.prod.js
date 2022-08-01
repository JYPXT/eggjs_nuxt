const path = require("path");
const join = (dir) => path.join(__dirname, "..", dir);
module.exports = {
  logger: {
    dir: join("logs/prod"),
  },
};
