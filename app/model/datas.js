module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // 数据库表的映射
  const DatasSchema = new Schema({
    // _id: {
    //   // Schema.Types.ObjectId
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    id: String,
    navRoute: String,
    platform: String,
    servicePlatform: String,
    tag: String,
    anchorId: String,
    title: {
      type: String,
      default: "",
    },
    crumbs: {
      type: String,
      default: "",
    },
    content: String,
    route: {
      type: String,
      default: "",
    },
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
  return mongoose.model("Datas", DatasSchema, "datas");
};
