<script>
export default {
  name: "Anchorbar",
  inject: ["clickToAnchor"], // , "anchor"
  props: {
    navs: {
      type: Array,
      default: () => [],
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  methods: {},
  render() {
    const { level, $store } = this;
    const { anchorActive } = $store.state;
    const anchorClass = `level-${level}`;
    const style = { "padding-left": `${level * 15}px` };
    return (
      <div staticClass="anchorbar-item">
        {this.navs.map((nav, i) => (
          <div staticClass={anchorClass}>
            <div
              id={nav.id}
              staticClass="anchor-label"
              class={{ active: anchorActive === nav.id }}
              style={style}
              onClick={this.clickToAnchor.bind(this, nav)}
            >
              {nav.label}
            </div>
            {nav.children && nav.children.length > 0 ? (
              <anchorbar navs={nav.children} level={level + 1} />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    );
  },
};
</script>

<style lang="postcss" scoped>
.anchorbar {
  &-item {
    box-sizing: border-box;

    .level-1 {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #586376;
      /* color: #191919; */
      /* line-height: 28px; */
      cursor: pointer;
    }

    .level-2 {
      display: block;
      font-size: 12px;
      font-family: HelveticaNeue;
      color: #8a8a9a;
      /* line-height: 26px; */
      cursor: pointer;
    }

    .level-3 {
      display: block;
      font-size: 12px;
      font-family: HelveticaNeue;
      color: #8a8a9a;
      /* line-height: 24px; */
      cursor: pointer;
    }

    .anchor-label {
      padding: 6px 0;
      line-height: 1.2;
    }

    .level-1,
    .level-2,
    .level-3 {
      > .anchor-label {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background-color: #e8e8f2;
        }
      }
      .active {
        color: #099dfd;
        &::before {
          color: #099dfd;
          background-color: #099dfd;
        }
      }
    }
  }
}
</style>
