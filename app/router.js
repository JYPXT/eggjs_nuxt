"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  const {
    servicePlatforms,
    member,
    repositorys,
    platforms,
    documents,
    pdf,
  } = controller;

  router.get("/api/v1/documents/search", documents.search);
  router.get("/api/v1/platforms", platforms.getPlatforms);
  // router.get("/api/v1/platforms", repositorys.getPlatforms);
  router.get("/api/v1/layout", documents.getLayout);
  router.get("/api/v1/navs", documents.getNavs);
  router.get("/api/v1/navs/:id/slidebars", documents.getSlidebars);
  router.get("/api/v1/articles/query", documents.getActicleByRoute);
  router.get("/api/v1/articles/:id", documents.getActicle);

  router.post("/api/v1/login", member.login);

  // apiserve走鉴权
  router.get(
    "/apiserve/v1/servicePlatforms",
    servicePlatforms.getServicePlatforms
  );
  router.get(
    "/apiserve/v1/servicePlatform/:category",
    servicePlatforms.getServicePlatformByCategory
  );

  router.post(
    "/apiserve/v1/servicePlatforms/create",
    servicePlatforms.createServicePlatforms
  );

  router.get(
    "/apiserve/v1/servicePlatforms/platforms",
    servicePlatforms.getPlatforms
  );

  router.get(
    "/apiserve/v1/servicePlatforms/getFirstPlatform",
    servicePlatforms.getFirstPlatform
  );

  router.get(
    "/apiserve/v1/repositorys/:id/parseConfig",
    repositorys.parseConfig
  );
  router.get("/apiserve/v1/repositorys", repositorys.getRepositorys);
  router.post("/apiserve/v1/repositorys", repositorys.createRepository);
  router.put("/apiserve/v1/repositorys/:id", repositorys.updateRepository);
  router.delete("/apiserve/v1/repositorys/:id", repositorys.deleteRepository);

  router.get("/apiserve/v1/pdf", pdf.generatePDF);
  router.get("/apiserve/v1/pdf/download", pdf.download);
};
