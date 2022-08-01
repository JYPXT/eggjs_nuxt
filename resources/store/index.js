// const root =
//   typeof window !== "undefined"
//     ? window
//     : typeof global !== "undefined"
//     ? global
//     : typeof self !== "undefined"
//     ? self
//     : {};
// console.log(root);
const scrollIntoView = (container, selected) => {
  if (!container) return;
  if (!selected) {
    container.scrollTop = 0;
    return;
  }
  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  return top;
};

const getPositions = (elems, positions) => {
  const container = document.querySelector("html");
  elems.forEach(({ id, children }) => {
    const elem = document.querySelector("#" + id);
    if (elem) {
      const top = scrollIntoView(container, elem);
      positions.push({ id, top, height: elem.offsetHeight });
      if (children && children.length > 0) {
        getPositions(children, positions);
      }
    }
  });
};

export const state = () => ({
  servicePlatform: "",
  isOutputPdf: false,
  isOauth: false,
  layouts: [],
  platformSwitch: [],
  platforms: [],
  platform: "",
  navs: [],
  nav: null,
  slidebars: [],
  article: {
    yamlOption: {},
    anchors: [],
  },
  anchorActive: "",
  positions: [],
});

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, app }) {
    try {
      const cookies = req.headers.cookie.split(";").reduce((res, co) => {
        const str = co.split("=");
        if (str) {
          res[str[0].replace(/^\s+|\s+$/, "")] = str[1];
        }
        return res;
      }, {});
      if (cookies.docssessionid) {
        commit("setIsOauth", true);
      }
      if (cookies.isOutputPdf) {
        commit("setIsOutputPdf", true);
      }
    } catch (error) {}
    const urls = req.url.split("/");
    const servicePlatform = urls[1];
    // const cnav = urls[2];
    commit("setServicePlatform", servicePlatform);
    await dispatch("getLayouts", { app });
    // await dispatch("getPlatforms", { app, servicePlatform, cnav });
  },
  async getLayouts({ commit }, { app }) {
    const layouts = await app.$apis.getLayouts();
    commit("setLayouts", layouts);
  },
  async getPlatforms({ commit }, { app }) {},
  setArticle({ commit, dispatch }, article) {
    commit("setArticle", article);
    dispatch("setPositions");
  },
  setPositions({ state, commit }) {
    typeof window !== "undefined" &&
      setTimeout(() => {
        const positions = [];
        getPositions(state.article.anchors, positions);
        commit("setPositions", positions);
      }, 0);
  },
};

export const mutations = {
  setIsOutputPdf(state, isOutputPdf) {
    state.isOutputPdf = isOutputPdf;
  },
  setIsOauth(state, isOauth) {
    state.isOauth = isOauth;
  },
  setLayouts(state, layouts) {
    state.layouts = layouts;
  },
  setServicePlatform(state, servicePlatform) {
    state.servicePlatform = servicePlatform;
  },
  setPlatforms(state, platforms) {
    state.platforms = platforms;
    platforms[0] && (state.platform = platforms[0].name);
    const platformSwitch = [
      {
        label: "平台",
        options: [],
      },
      {
        label: "框架",
        options: [],
      },
      {
        label: "",
        options: [],
      },
    ];
    const idxs = ["platform", "framework", "server"];
    platforms.forEach((plat) => {
      const { type } = plat;
      const idx = idxs.indexOf(type);
      platformSwitch[idx].options.push(plat);
    });
    state.platformSwitch = platformSwitch.filter((ps) => ps.options.length > 0);
  },
  setPlatform(state, platform) {
    state.platform = platform;
  },
  setNavs(state, navs) {
    state.navs = navs;
  },
  setNav(state, nav) {
    state.nav = nav;
  },
  setSlidebars(state, slidebars) {
    state.slidebars = slidebars;
  },
  setArticle(state, article) {
    if (
      article &&
      Object.prototype.toString.call(article) === "[object Object]"
    ) {
      state.article = Object.assign(state.article, article);
      const { anchors } = article;
      if (anchors && anchors.length > 0) {
        state.anchorActive = anchors[0].id;
      } else {
        state.anchorActive = "";
      }
    } else {
      state.article = {
        yamlOption: {},
        anchors: [],
      };
    }
  },
  setPositions(state, positions) {
    state.positions = positions;
  },
  setAnchorActive(state, anchorId) {
    state.anchorActive = anchorId;
  },
};
