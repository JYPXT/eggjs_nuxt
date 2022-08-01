<template>
  <section class="header-container">
    <header class="crheader">
      <section class="crheader-container container">
        <img
          class="logo"
          src="//cdn1.cloudroom.com/page/static/images/common/logo.png"
          alt=""
          @click="toSite"
        />
        <section class="crheader-content xs-hidden">
          <search-panel
            class="search-panel"
            :category="category"
            @searchPosition="searchPosition"
          />
        </section>
        <button type="button" class="crheader-login xs-hidden">
          <span @click="toLogin">登录</span>/<span @click="toRegister"
            >注册</span
          >
        </button>
        <span class="crheader-menu xs-visible-inline-block" @click="toggleNav">
          <i :class="[isshownav ? 'el-icon-close' : 'el-icon-menu']"></i>
        </span>
      </section>
    </header>
    <nav class="nav">
      <div class="container nav-items" :class="{ 'xs-hidden': !isshownav }">
        <nuxt-link
          v-for="nav in navs"
          :key="nav.id"
          :class="{ active: $route.path.includes(nav.route) }"
          class="nav-item"
          :to="addPlatformQuery(nav.redirect)"
          @click.native="toggleNav"
          >{{ nav.title }}</nuxt-link
        >
      </div>
      <section class="container nav-mcontent hidden xs-visible">
        <span class="nav-menu xs-visible-inline-block" @click="toggleSlidebar">
          <i :class="[isshowslidebar ? 'el-icon-close' : 'el-icon-s-fold']"></i>
        </span>
        <search-panel
          class="search-panel"
          :category="category"
          @searchPosition="searchPosition"
        />
      </section>
    </nav>
  </section>
</template>

<script>
export default {
  props: {
    defaultPlatform: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "sdk",
    },
    navs: {
      type: Array,
      default: () => [],
    },
    isshowslidebar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isshownav: false,
      siteInfo: {
        sdk: {
          home: "//sdk.cloudroom.com",
          login: "//sdk.cloudroom.com/mgr_sdk/login.html",
          register: "//sdk.cloudroom.com/mgr_sdk/register.html",
        },
        conf: {
          home: "//www.cloudroom.com",
          login: "//www.cloudroom.com/mgr/manager/login",
          register: "//www.cloudroom.com/mgr/manager/register",
        },
      },
    };
  },
  methods: {
    toSite() {
      const { category, siteInfo } = this;
      const info = siteInfo[category];
      info && window.open(info.home);
    },
    toLogin() {
      const { category, siteInfo } = this;
      const info = siteInfo[category];
      info && window.open(info.login);
    },
    toRegister() {
      const { category, siteInfo } = this;
      const info = siteInfo[category];
      info && window.open(info.register);
    },
    toggleNav() {
      this.isshownav = !this.isshownav; // 移动端用的
    },
    toggleSlidebar() {
      this.$emit("update:isshowslidebar", !this.isshowslidebar);
    },
    addPlatformQuery(url) {
      const platform = this.$route.query.platform;
      const ob = this.$util.parseURL(url);
      if (!ob.query) {
        return `${url}?platform=${platform}`;
      } else if (ob.query.platform) {
        return `${url}platform=${platform}`;
      } else {
        return url;
      }
    },
    // 搜索定位
    searchPosition(item) {
      const currentPlat = this.$route.query.platform;
      const anchorId = item.anchorId;
      if (item.route === this.$route.path && currentPlat === item.platform) {
        this.$emit("toanchor", { id: anchorId });
      } else {
        this.$router.push(`${item.route}?platform=${currentPlat}#${anchorId}`);
      }
    },
  },
};
</script>
