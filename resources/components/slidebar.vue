<script>
export default {
  name: "Slidebar",
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
  render() {
    const slidebarLevel = `level-${this.level}`;
    const {
      path,
      query: { platform },
    } = this.$route;
    return (
      <div staticClass="slidebar-item">
        {this.navs.map((nav) => (
          <div
            class={[
              slidebarLevel,
              {
                active:
                  nav.isslidebar && nav.islink
                    ? path === nav.redirect
                    : path === nav.route,
              },
            ]}
          >
            {!nav.islink ? (
              <div id={"s" + nav.id} class="slidebar-label">
                {nav.title || nav.name}
              </div>
            ) : /^https?/.test(nav.route) ? (
              <a
                href={nav.route}
                target="_blank"
                id={"s" + nav.id}
                staticClass="slidebar-label slidebar-label-hover"
              >
                {nav.title || nav.name}
              </a>
            ) : (
              <NuxtLink
                to={{
                  path: nav.isslidebar ? nav.redirect : nav.route,
                  query: { platform },
                }}
              >
                <div
                  id={"s" + nav.id}
                  staticClass="slidebar-label slidebar-label-hover"
                >
                  {nav.title || nav.name}
                </div>
              </NuxtLink>
            )}
            {nav.children && nav.children.length > 0 ? (
              <slidebar navs={nav.children} level={this.level + 1} />
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

<style lang="postcss">
.slidebar {
  &-item {
    padding-left: 10px;
    box-sizing: border-box;

    .level-1,
    .level-1 a {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: #151515;
      /* color: #191919; */
      /* line-height: 28px; */
      box-sizing: border-box;
      & ~ .level-1 {
        margin-top: 20px;
      }
    }

    .level-2,
    .level-2 a {
      display: block;
      font-size: 14px;
      font-family: HelveticaNeue;
      color: #586376;
      /* line-height: 26px; */
      box-sizing: border-box;
    }

    .slidebar-label {
      padding: 6px 0;
      &.slidebar-label-hover:hover {
        color: #099dfd;
        cursor: pointer;
      }
    }

    .level-1,
    .level-2 {
      &.active .nuxt-link-active,
      &.active .slidebar-label {
        color: #099dfd;
      }
    }

    /* 路由上有hash值匹不到精确的 */
    /* .nuxt-link-exact-active {
      color: #099dfd;
    }
    .nuxt-link-active {
    } */
  }
}

.slidebar-v1 {
  .level-1,
  .level-1 a {
    & ~ .level-1 {
      margin-top: 6px;
    }
  }

  .slidebar-label {
    padding: 4px 0;
  }
}
</style>
