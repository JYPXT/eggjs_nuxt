const resolve = require("path").resolve;
const resolveDirname = (dir) => resolve(__dirname, "..", dir);

module.exports = {
  loading: resolveDirname("resources/components/loading.vue"), // false,
  telemetry: false,

  server: {
    // host: "0.0.0.0",
  },

  alias: {
    "@img": resolveDirname("resources/internalAssets/img"),
    "@mixins": resolveDirname("resources/mixins"),
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "文档",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/internalAssets/style/rest.css",
    "@/internalAssets/style/style.css",
    "@/internalAssets/style/github.css",
    "element-ui/lib/theme-chalk/index.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/axios",
    "@/plugins/apis",
    "@/plugins/element-ui",
    "@/plugins/util",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // "@nuxtjs/eslint-module",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    credentials: true,
  },

  // proxy: {
  //   "^/api": {
  //     target: "http://127.0.0.1:7001",
  //     secure: false,
  //   },
  // },

  privateRuntimeConfig: {
    axios: {
      baseURL: "http://127.0.0.1:7001",
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
  ],

  /*
   ** Server Middleware
   */
  // serverMiddleware: {
  //   '/api': '~/api'
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    postcss: {
      plugins: {
        // "postcss-preset-env": {
        //   stage: 3,
        //   features: {
        //     "nesting-rules": true,
        //   },
        // },
        "postcss-url": true,
        "postcss-nested": {},
      },
    },
  },

  srcDir: resolveDirname("resources"),

  router: {},
};
