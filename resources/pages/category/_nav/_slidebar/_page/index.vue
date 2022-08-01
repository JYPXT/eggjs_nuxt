<template>
  <section
    ref="markdownbody"
    class="page-content markdown-body"
    :class="article.yamlOption.pageClass"
  >
    <section v-html="article.content"></section>
    <el-image
      v-show="previewUrl"
      ref="elimages"
      class="elimages"
      :src="previewUrl"
      :preview-src-list="previewUrls"
    >
    </el-image>
  </section>
</template>

<script>
import sdkdocmixin from "@/mixins/sdkdoc";

export default {
  layout({ store, route }) {
    const platform = route.query.platform;
    const nav = route.params.nav;
    const category = route.name.split("-")[0];
    const ob = store.state.layouts.find((lay) => {
      const c1 = lay.name === nav && lay.servicePlatform === category;
      const c2 = platform ? lay.platform === platform : true;
      return c1 && c2;
    });
    return ob && ob.layout ? ob.layout : "common";
  },
  mixins: [sdkdocmixin],
  async fetch(context) {
    return new Promise(async (resolve, reject) => {
      const { $apis, store, redirect, route } = context;
      const servicePlatform = route.name.split("-")[0];
      let platform = route.query.platform;
      const cNav = route.params.nav;
      if (
        !store.state.platform ||
        store.state.platform !== platform ||
        !store.state.nav ||
        store.state.nav !== cNav
      ) {
        const platforms = await $apis.getPlatforms(servicePlatform, cNav);
        store.commit("setPlatforms", platforms);
        if (route.query.platform) {
          store.commit("setPlatform", route.query.platform);
        } else {
          platforms[0] && (platform = platforms[0].name);
        }
        const navs = await $apis.getNavs(servicePlatform, platform);
        store.commit("setNavs", navs);
        store.commit("setNav", cNav);
        const fNav = navs.find((nav) => route.path.includes(nav.route));
        if (fNav && fNav._id) {
          const slidebars = await $apis.getSlidebars(fNav._id);
          store.commit("setSlidebars", slidebars);
        }
      }

      try {
        const article = await $apis.getArticle(
          route.path,
          servicePlatform,
          platform
        );
        store.dispatch("setArticle", article);
        resolve();
      } catch (error) {
        const platf = store.state.platforms.find(
          (plat) => plat.value === platform
        );
        if (platf) {
          redirect({ path: platf.route, query: { platform } });
        } else {
          redirect({ name: "404" });
        }
      }
    });
  },
};
</script>
