module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RepositorysSchema = new Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    // platform: {
    //   type: String, // Schema.Types.ObjectId,
    //   ref: "Platforms",
    // },
    servicePlatform: String,
    platform: String,
    route: String,
    sort: Number,
    repo: String,
    repositoryName: String, 
    branchName: String,
    childDir: String, // 给git指定获取子文件夹
    config: Object,
    active: {
      type: Boolean,
      default: false,
    },
    username: String,
    password: String,
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model("Repositorys", RepositorysSchema, "repositorys");
};
