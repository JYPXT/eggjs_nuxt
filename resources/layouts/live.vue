<template>
  <section
    id="conferencedocument"
    ref="pageApp"
    class="conference-document"
    :class="{ isOutputPdf: isOutputPdf }"
  >
    <cr-header
      category="live"
      :navs="navs"
      :isshowslidebar.sync="isshowslidebar"
      @toanchor="clickToAnchor"
    />
    <section ref="pageContainer" class="page-container">
      <nav class="page-slidebar" :class="{ 'xs-hidden': !isshowslidebar }">
        <el-scrollbar ref="slidebarScrollbar" class="scrollbar">
          <slidebar class="slidebar slidebar-v1" :navs="slidebars" />
        </el-scrollbar>
      </nav>
      <Nuxt ref="pages" />
      <nav class="page-anchor">
        <el-scrollbar ref="anchorScrollbar" class="scrollbar">
          <anchorbar class="anchorbar" :navs="article.anchors" />
        </el-scrollbar>
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
  methods: {},
};
</script>

<style lang="postcss" scoped>
.page-slidebar {
  padding-top: 144px;
}
</style>
