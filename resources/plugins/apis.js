export default function ({ $axios }, inject) {
  const apis = {
    // 获取ServicePlatform name 获取详情
    getServicePlatform(name) {
      return $axios.get(`/apiserve/v1/servicePlatform/${name}`);
    },
    getFirstPlatform() {
      return $axios.get("/apiserve/v1/servicePlatforms/getFirstPlatform");
    },
    // 根据ServicePlatform name 获取仓库列表
    getRepositorys(category) {
      return $axios.get("/apiserve/v1/repositorys", {
        params: {
          category,
        },
      });
    },
    // 创建仓库
    createRepository(data) {
      return $axios.post("/apiserve/v1/repositorys", data);
    },
    // 更新仓库
    updateRepository(id) {
      return $axios.put(`/apiserve/v1/repositorys/${id}`);
    },
    // 删除仓库
    delRepository(id) {
      return $axios.delete(`/apiserve/v1/repositorys/${id}`);
    },
    // 根据配置编译
    parseRepositoryConfig(id) {
      return $axios.get(`/apiserve/v1/repositorys/${id}/parseConfig`);
    },
    // 页面
    getLayouts() {
      return $axios.get("/api/v1/layout");
    },
    getPlatforms(servicePlatform, nav) {
      return $axios.get("/api/v1/platforms", {
        params: { servicePlatform, nav },
      });
    },
    getNavs(servicePlatform, platform) {
      return $axios.get("/api/v1/navs", {
        params: { platform, servicePlatform },
      });
    },
    getSlidebars(id) {
      return $axios.get(`/api/v1/navs/${id}/slidebars`);
    },
    getArticle(route, servicePlatform, platform) {
      return $axios.get(`/api/v1/articles/query`, {
        params: {
          route,
          servicePlatform,
          platform,
        },
      });
    },
    searchDocument(condition, platform) {
      return $axios.get("/api/v1/documents/search", {
        params: { ...condition, platform },
      });
    },
  };

  inject("apis", apis);
}
