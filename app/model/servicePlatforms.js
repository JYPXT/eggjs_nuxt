module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ServicePlatformsSchema = new Schema({
    id: Schema.Types.ObjectId,
    label: String,
    name: {
      type: String,
      required: true,
      unique: true,
    },
    route: {
      type: String,
      required: true,
      unique: true,
    },
    platforms: [
      {
        name: String,
        sort: Number,
      },
    ],
    siteHome: String,
    siteLogin: String,
    siteRegister: String,
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model(
    "ServicePlatforms",
    ServicePlatformsSchema,
    "servicePlatforms"
  );
};
