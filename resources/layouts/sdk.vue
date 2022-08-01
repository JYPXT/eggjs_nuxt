<template>
  <section
    id="sdkdocument"
    ref="pageApp"
    class="sdk-document"
    :class="{ isOutputPdf: isOutputPdf }"
  >
    <cr-header
      :category="servicePlatform"
      :navs="navs"
      :isshowslidebar.sync="isshowslidebar"
      @toanchor="clickToAnchor"
    />
    <section ref="pageContainer" class="page-container">
      <nav class="page-slidebar" :class="{ 'xs-hidden': !isshowslidebar }">
        <section class="switch-platform">
          <el-select
            popper-class="cr-platformor-framework-select"
            :value="platform"
            @change="changePlatform"
          >
            <template v-slot:prefix>
              <span
                :class="`plat-icon switch-platform-plat-icon ${platform}`"
              ></span>
            </template>
            <el-option-group
              v-for="group in platformSwitch"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <div class="option-label">
                  <span :class="`plat-icon ${item.value}`"></span
                  >{{ item.label }}
                </div>
              </el-option>
            </el-option-group>
          </el-select>
        </section>
        <el-scrollbar ref="slidebarScrollbar" class="scrollbar">
          <slidebar class="slidebar" :navs="slidebars" />
        </el-scrollbar>
      </nav>
      <Nuxt ref="pages" />
      <nav class="page-anchor">
        <template v-if="isShowAnchors">
          <el-scrollbar ref="anchorScrollbar" class="scrollbar">
            <anchorbar class="anchorbar" :navs="article.anchors" />
          </el-scrollbar>
        </template>
      </nav>
    </section>
  </section>
</template>

<script>
import mixin from "@/mixins/docLayout";
export default {
  mixins: [mixin],
  data() {
    return {
      isshowslidebar: false,
    };
  },
  computed: {
    isShowAnchors() {
      return this.article.yamlOption.anchors !== "false";
    },
  },
  methods: {
    changePlatform(platform) {
      window.location.href = `${this.$route.path}?platform=${platform}`;
    },
  },
};
</script>

<style lang="postcss" scoped>
.option-label {
  line-height: 34px;
}
</style>
<style lang="postcss">
.cr-platformor-framework-select {
  .el-select-dropdown__item {
    padding: 0 10px;
  }
}

.cr-platformor-framework-select .el-select-dropdown__item.selected .plat-icon,
.cr-platformor-framework-select .el-select-dropdown__item.hover .plat-icon,
.plat-icon.switch-platform-plat-icon {
  &.Web {
    background-image: url("~@img/Web1.svg");
  }
  &.Android {
    background-image: url("~@img/Android1.svg");
  }
  &.iOS {
    background-image: url("~@img/iOS1.svg");
  }
  &.macOS {
    background-image: url("~@img/macOS1.svg");
  }
  &.Windows {
    background-image: url("~@img/Windows1.svg");
  }
  &.miniprogram {
    background-image: url("~@img/miniprogram1.svg");
  }
  &.Linux {
    background-image: url("~@img/Linux1.svg");
  }
  &.Flutter {
    background-image: url("~@img/Flutter1.svg");
  }
  &.WebIE {
    background-image: url("~@img/WebIE1.svg");
  }
  &.serverside {
    background-image: url("~@img/serverside1.svg");
  }
}

.plat-icon {
  display: inline-block;
  width: 24px;
  height: 34px;
  margin-right: 8px;
  vertical-align: top;
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;

  &.Web {
    background-image: url("~@img/Web.svg");
  }
  &.Android {
    background-image: url("~@img/Android.svg");
  }
  &.iOS {
    background-image: url("~@img/iOS.svg");
  }
  &.macOS {
    background-image: url("~@img/macOS.svg");
  }
  &.Windows {
    background-image: url("~@img/Windows.svg");
  }
  &.miniprogram {
    background-image: url("~@img/miniprogram.svg");
  }
  &.Linux {
    background-image: url("~@img/Linux.svg");
  }
  &.Flutter {
    background-image: url("~@img/Flutter.svg");
  }
  &.WebIE {
    background-image: url("~@img/WebIE.svg");
  }
  &.serverside {
    background-image: url("~@img/serverside.svg");
  }
}
</style>
