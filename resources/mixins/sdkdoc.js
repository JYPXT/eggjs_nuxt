import { mapState } from "vuex";

export default {
  data() {
    return {
      previewUrl: "",
      previewUrls: [],
    };
  },
  mounted() {
    const anchorId = this.$route.hash
      ? this.$route.hash.replace("#", "")
      : this.$route.query.anchor;
    if (anchorId) {
      const instance = this.$parent.$parent;
      this.$nextTick(() => {
        instance.clickToAnchor.call(instance, { id: anchorId });
      });
    }
    this.$nextTick(() => {
      const { markdownbody } = this.$refs;
      if (markdownbody) {
        const imgs = markdownbody.querySelectorAll("img");
        this.previewUrls = Array.from(imgs).map((ele) => ele.src);
        markdownbody.addEventListener("click", ({ target }) => {
          const nodeName = target.nodeName.toLocaleLowerCase();
          if (nodeName === "img") {
            this.previewUrl = target.src;
            this.$nextTick(() => {
              this.$refs.elimages.clickHandler();
            });
          }
        });
      }
    });
  },
  computed: {
    ...mapState({
      servicePlatform: "servicePlatform",
      platformSwitch: "platformSwitch",
      platform: "platform",
      platforms: "platforms",
      navs: "navs",
      slidebars: "slidebars",
      article: "article",
      anchorActive: "anchorActive",
    }),
  },
  method: {},
};
