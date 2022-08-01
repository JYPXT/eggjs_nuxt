<template>
  <section class="manager">
    <section class="menus">
      <!-- <div class="handle-menu">
        <i class="el-icon-circle-plus-outline"></i
        ><el-button type="text">添加仓库</el-button>
      </div> -->
      <el-menu
        :default-active="defaultactive"
        text-color="#888f97"
        background-color="#1E252C"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        router
      >
        <template v-for="nav in navs">
          <el-menu-item :index="nav.route" :key="nav.route">
            <i class="el-icon-s-shop"></i>
            <span slot="title">{{ nav.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </section>
    <section class="manager-container">
      <nuxt-child></nuxt-child>
    </section>
    <!-- <el-dialog
      class="cr-dialog-v1"
      :visible.sync="modifiyManyUserVisible"
      title="添加仓库"
      width="500px"
      :close-on-click-modal="false"
    ></el-dialog> -->
  </section>
</template>

<script>
export default {
  async asyncData(context) {
    const { $axios, $route } = context;
    const servicePlatforms = await $axios.get("/apiserve/v1/servicePlatforms");
    const navs = servicePlatforms.map((o) => {
      o.route = `/backend/home/repo${o.route}`;
      return o;
    });
    const defaultactive = navs.length > 0 ? navs[0].route : "";
    return {
      navs,
      defaultactive,
    };
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="postcss" scoped>
.manager {
  position: relative;
  height: 100%;
  padding-left: 200px;
  box-sizing: border-box;
  overflow-x: hidden;

  .handle-menu {
    height: 56px;
    line-height: 56px;
    position: relative;
    -webkit-box-sizing: border-box;
    white-space: nowrap;
    color: #fff;
    text-align: center;
    > i {
      padding-right: 5px;
    }
    > button {
      color: #fff !important;
    }
  }

  .menus {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 200px;
    background-color: #1e252c;

    ::v-deep .el-menu {
      border-right: none;
    }
  }

  &-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
