import { mapState, mapActions, mapMutations } from "vuex";
export default {
  provide() {
    return {
      clickToAnchor: this.clickToAnchor,
    };
  },
  data() {
    return {
      lockScrollTimer: null,
      timer: null,
      prevTop: 0,
    };
  },
  computed: {
    ...mapState({
      isOutputPdf: "isOutputPdf",
      servicePlatform: "servicePlatform",
      platformSwitch: "platformSwitch",
      platform: "platform",
      platforms: "platforms",
      navs: "navs",
      slidebars: "slidebars",
      article: "article",
      anchorActive: "anchorActive",
      positions: "positions",
    }),
    container() {
      return document.querySelector("html");
    },
    pageContainerPt() {
      return this.$refs.pageContainer
        ? getComputedStyle(this.$refs.pageContainer).paddingTop
        : 124;
    },
    anchorScrollbar() {
      return this.$refs.anchorScrollbar;
    },
  },
  mounted() {
    this.rmWrapScroll();
    this.addWrapScroll();
    this.setPositions();
  },
  destroyed() {
    this.rmWrapScroll();
  },
  watch: {
    "$route.hash": {
      immediate: true,
      handler: "changeAnchor",
    },
  },
  methods: {
    ...mapActions(["setPositions"]),
    ...mapMutations(["setAnchorActive"]),
    addWrapScroll() {
      window.addEventListener("scroll", this.wrapScrollEvt);
    },
    rmWrapScroll() {
      window.removeEventListener("scroll", this.wrapScrollEvt);
    },
    lockScroll(time) {
      time = time || 50;
      this.timer = true;
      this.lockScrollTimer && clearTimeout(this.lockScrollTimer);
      this.lockScrollTimer = setTimeout(() => {
        this.timer = false;
      }, time);
    },
    wrapScrollEvt() {
      if (this.timer) return;
      this.lockScroll();
      // 用IntersectionObserver做更好, 但是IE全不支持
      const winih = window.innerHeight;
      const dis_8 = winih / 8; // 距离顶部nav还有多少触发
      const dis_2 = winih / 2;
      const {
        positions,
        anchorScrollbar,
        container: { scrollHeight, scrollTop },
      } = this;
      const sTop = scrollTop + parseInt(this.pageContainerPt);
      // 判断方向
      // const direction = this.prevTop < sTop ? "down" : "up";
      // this.prevTop = sTop;
      const pos1 = positions[0];
      if (pos1 && scrollTop < pos1.height) {
        this.setAnchorActive(pos1.id);
        return;
      }
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const posNext = positions[i + 1];
        const c1 = sTop > pos.top - dis_8;
        const c2 = posNext && sTop < posNext.top - dis_8;
        if ((c1 && c2) || (!posNext && c1)) {
          this.setAnchorActive(pos.id);
          break;
        }
      }
      // 侧边栏跟随滚动
      if (anchorScrollbar) {
        const persents = sTop / scrollHeight;
        const wrap = anchorScrollbar.wrap;
        const wrapsh = wrap.scrollHeight;
        wrap.scrollTop = Math.floor(wrapsh * persents) - dis_2;
      }
    },
    clickToAnchor({ id }) {
      this.lockScroll();
      window.location.hash = id;
      // const { path, query } = this.$router.history.current;
      // const newQuery = JSON.parse(JSON.stringify(query));
      // newQuery.anchor = id;
      // this.$router.push({ path, query: newQuery });
    },
    changeAnchor() {
      if (!process.client) return;
      const id = this.$router.history.current.hash;
      setTimeout(() => {
        id && this.toAnchor(id);
      }, 0);
    },
    toAnchor(id) {
      const {
        container,
        pageContainerPt,
        $refs: { pages },
      } = this;
      // const dom = pages.$el.querySelector(`#${id}`);
      const dom = pages.$el.querySelector(id);
      const top = this.scrollIntoView(container, dom);
      const scrollTop = top - parseInt(pageContainerPt);
      const distanceScroll = Math.abs(container.scrollTop - scrollTop);
      // 锁了，不然会被滚动再触发一次
      // 因为有动画，需要根据距离调整锁定的时间，时长毫秒数大概是滚动差 / 12
      this.lockScroll(distanceScroll / 4 + 250);
      container.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: "smooth",
      });
      const anchorActive = id.replace("#", "");
      this.setAnchorActive(anchorActive);
    },
    scrollIntoView(container, selected) {
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
    },
  },
};
