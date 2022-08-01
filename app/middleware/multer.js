"use strict";

// 换了版本了，有空更新一下https://github.com/koajs/multer
const multer = require("koa-multer");
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'app/public/upload/');
//   },
//   filename(req, file, cb) {
//     const fileFormat = (file.originalname).split('.');
//     cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);
//   },
// });

// module.exports = multer({ storage });
module.exports = ({ savePath = "app/public/upload/" }) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, savePath);
    },
    filename(req, file, cb) {
      console.log(file);
      const fileFormat = file.originalname.split(".");
      cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);
    },
  });
  return multer(storage);
};
