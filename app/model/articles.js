module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ArticlesSchema = new Schema({
    // id: String,
    id: {
      type: String,
      required: true,
      unique: true,
      // alias: "id"
    },
    navId: String,
    slidebarId: String,
    filePath: String,
    yamlOption: {
      type: Map,
      of: String,
    },
    title: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    route: String,
    // platformId: String,
    platform: String,
    servicePlatform: String,
    content: String,
    mdContent: String,
    anchors: Array,
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
  return mongoose.model("Articles", ArticlesSchema, "articles");
};
