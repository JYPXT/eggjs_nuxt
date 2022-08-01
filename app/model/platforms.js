module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PlatformsSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    _id: {
      type: String,
      // required: true,
      // unique: true,
      // alias: "id",
    },
    name: String,
    domain: {
      type: String,
    },
    category: {
      type: String,
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
  return mongoose.model("Platforms", PlatformsSchema, "platforms");
};
