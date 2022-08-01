"use strict";

const path = require("path");
const { Service } = require("egg");

class ServicePlatformsService extends Service {
  async getServicePlatforms() {
    try {
      return await this.ctx.model.ServicePlatforms.find();
    } catch (error) {
      this.ctx.logger.error("getServicePlatforms" + error);
    }
  }

  async getFirstPlatform() {
    const data = await this.getServicePlatforms();
    return data.length > 0 ? data[0].name : null;
  }

  async getServicePlatformByCategory(category) {
    try {
      return await this.ctx.model.ServicePlatforms.findOne({
        name: category,
      });
    } catch (error) {
      this.ctx.logger.error("getServicePlatformByCategory" + error);
    }
  }

  async createServicePlatforms({
    label,
    name,
    route,
    siteHome,
    siteLogin,
    siteRegister,
  }) {
    const servicePlatform = {
      label: label || name,
      name,
      route,
      siteHome: siteHome || "",
      siteLogin: siteLogin || "",
      siteRegister: siteRegister || "",
    };
    try {
      await this.ctx.model.ServicePlatforms.create(servicePlatform);
      return "create success";
    } catch (error) {
      this.ctx.logger.error("createServicePlatforms" + error);
      return "create fail";
    }
  }
}

module.exports = ServicePlatformsService;
