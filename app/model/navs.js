module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const NavsSchema = new Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    navId: String,
    title: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    // 给slidebar用的，（true = 可点）的话route就等于配置的第一个md的路由
    islink: {
      type: Boolean,
      default: false,
    },
    // 页面布局选项
    layout: {
      type: String,
      default: "",
    },
    // 页面路由
    route: String,
    // 重定向路由，例如slidebar定向到第一个article
    redirect: String,
    // 平台 把字段都加上改动最小
    // platformId: String,
    platform: String,
    servicePlatform: String,
    // 类型（navs, slidebar）：横竖导航栏都放这个表
    type: String,
    sort: Number,
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model("Navs", NavsSchema, "navs");
};
