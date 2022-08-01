"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  jwt: {
    enable: true,
    package: "egg-jwt",
  },

  validate: {
    enable: true,
    package: "egg-validate",
  },

  mongoose: {
    enable: true,
    package: "egg-mongoose",
  },
};
