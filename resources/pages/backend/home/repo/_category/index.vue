<template>
  <section
    class="repo-category"
    :element-loading-text="loadingText"
    v-loading.lock="loading"
  >
    <el-row class="items" :gutter="15">
      <el-col
        class="item"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        v-for="(repository, $index) in repositorys"
        :key="repository.id"
      >
        <el-form
          class="item-box"
          :class="{ isCurrentRepo: repository.active }"
          label-width="100px"
          :model="repository"
        >
          <el-form-item label="平台:" prop="name">
            <el-input
              :value="repository.platform"
              size="medium"
              placeholder="平台"
              clearable
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="仓库地址:" prop="repo">
            <el-input
              :value="repository.fullRepo"
              size="medium"
              placeholder="SVN仓库地址"
              type="textarea"
              clearable
              readonly
            ></el-input>
          </el-form-item>
          <div class="text-right">
            <el-button
              v-show="repository.active"
              type="primary"
              size="medium"
              @click="toDocumentPage(repository)"
              ><i class="el-icon-tickets"></i
            ></el-button>
            <el-button
              v-show="repository.active"
              type="primary"
              size="medium"
              @click="pdf(repository)"
              >PDF</el-button
            >
            <el-button
              type="primary"
              size="medium"
              @click="parseConfig(repository)"
              >使用</el-button
            >
            <el-button
              type="primary"
              size="medium"
              @click="updateRepository(repository)"
              >更新</el-button
            >
            <el-button
              type="danger"
              size="medium"
              @click="delRepository(repository, $index)"
              ><i class="el-icon-delete"></i
            ></el-button>
          </div>
        </el-form>
      </el-col>
      <el-col class="item" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <el-form
          ref="form"
          class="item-box"
          label-width="100px"
          :model="form"
          :rules="rules"
        >
          <el-form-item label="平台：" prop="platformName">
            <el-select class="w-full" v-model="form.platformName" size="medium">
              <template v-for="opt in servicePlatform.platforms">
                <el-option
                  :key="opt.name"
                  :label="opt.label"
                  :value="opt.name"
                ></el-option>
              </template>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库地址:" prop="repo">
            <el-input
              v-model.trim="form.repo"
              size="medium"
              placeholder="仓库地址"
              type="textarea"
              clearable
            ></el-input>
          </el-form-item>
          <div class="text-right">
            <el-button type="primary" size="medium" @click="createRepository"
              ><i class="el-icon-plus"></i
            ></el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <div class="corners">
      <span
        class="corner"
        v-for="corner in corners"
        :key="corner.value"
        @click="clickCorner(corner)"
        >{{ corner.label }}</span
      >
    </div>

    <el-drawer
      class="drawer"
      title="说明列表"
      :visible.sync="explainVisible"
      direction="rtl"
    >
      <ul class="explain-list">
        <li>使用git指定仓库名称，分支名称，拉取子文件夹</li>
        <li>
          例如：git@github.com:cloudroomSDK/API-Demo.git --childDir=Android/docs
        </li>
        <li>--childDir=指定的子文件夹</li>
        <li>--repositoryName=仓库名称，默认origin</li>
        <li>--branchName=分支名称，默认main</li>
      </ul>
    </el-drawer>
  </section>
</template>

<script>
export default {
  async asyncData({ $apis, route }) {
    const { category } = route.params;
    const servicePlatform = await $apis.getServicePlatform(category);
    const repositorys = await $apis.getRepositorys(category);
    return {
      servicePlatform,
      repositorys,
    };
  },
  data() {
    return {
      loading: false,
      loadingText: "",
      form: {
        platformName: "",
        repo: "",
      },
      repositorys: [],
      rules: {
        platformName: [
          {
            required: true,
            message: "平台不能为空",
            trigger: "blur",
          },
        ],
        repo: [
          {
            required: true,
            message: "仓库地址不能为空",
            trigger: "blur",
          },
        ],
      },
      corners: [
        {
          label: "说明",
          value: "explain",
        },
      ],
      explainVisible: false,
      platform: {},
      addPlatformVisible: false,
      platformRules: {
        name: [
          {
            required: true,
            message: "平台名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    "$route.params.category": {
      immediate: true,
      handler: "changeCategory",
    },
  },
  methods: {
    clickCorner({ value }) {
      switch (value) {
        case "explain":
          this.explainVisible = true;
          break;
      }
    },
    changeCategory() {
      this.$nextTick(() => {
        const platforms = this.servicePlatform.platforms;
        if (platforms) {
          this.form = {
            platformName: platforms.length > 0 ? platforms[0].name : "",
            repo: "",
          };
          setTimeout(() => {
            this.$refs.form && this.$refs.form.clearValidate();
          }, 20);
        }
      });
    },
    async parseConfig(repository) {
      try {
        const result = await this.$apis.parseRepositoryConfig(repository.id);
        const servicePlatform = this.$route.params.category;
        const repositorys = await this.$apis.getRepositorys(servicePlatform);
        this.repositorys = repositorys;
        this.$message.success(result.data.message);
      } catch (error) {
        this.$message.info("解析失败");
      }
    },
    createRepository() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { repositorys } = this;
          const len = repositorys.length;
          const sort = len > 0 ? repositorys[len - 1].sort + 1 : 0;
          const servicePlatform = this.$route.params.category;
          const repoArgs = this.form.repo.replace(/\s*/g, "").split("--");
          const repo = repoArgs[0];
          const params = repoArgs.slice(1).reduce((res, co) => {
            const str = co.split("=");
            if (str) {
              res[str[0].replace(/^\s+|\s+$/, "")] = str[1];
            }
            return res;
          }, {});

          const form = Object.assign(
            {
              sort,
              servicePlatform,
              platformName: this.form.platformName,
              repo,
              repositoryName: "origin",
              branchName: "main",
            },
            params
          );

          try {
            this.loadingText = "拉取仓库中~";
            this.loading = true;
            await this.$apis.createRepository(form);
            const servicePlatform = this.$route.params.category;
            const repositorys = await this.$apis.getRepositorys(
              servicePlatform
            );
            this.repositorys = repositorys;
            this.$refs.form.resetFields();
            this.loading = false;
          } catch (error) {
            console.log(error);
            this.loading = false;
          }
        }
      });
    },
    toDocumentPage({ servicePlatform, platform }) {
      window.open(`/${servicePlatform}?platform=${platform}`);
    },
    edit({ id }) {
      this.$router.push({ path: `/backend/editor/${id}` });
    },
    async updateRepository({ id }) {
      try {
        await this.$apis.updateRepository(id);
        this.$message.success("更新成功");
      } catch (error) {
        this.$message.info("更新失败");
      }
    },
    async delRepository({ id }, idx) {
      try {
        await this.$confirm("删除平台会把对应的文件也删除", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        try {
          await this.$apis.delRepository(id);
          this.repositorys.splice(idx, 1);
          this.$message.success("删除成功");
        } catch (error) {
          this.$message.info("删除失败");
        }
      } catch (error) {
        this.$message.info("已取消删除");
      }
    },
    async pdf(repo) {
      const { servicePlatform, platform } = repo;
      this.loadingText = "生成PDF中~";
      this.loading = true;
      try {
        await this.$axios.get("/apiserve/v1/pdf", {
          params: {
            platform,
            category: servicePlatform,
          },
        });
        this.loading = false;
        window.open(
          `/apiserve/v1/pdf/download?platform=${platform}&category=${servicePlatform}`
        );
      } catch (err) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.items {
  padding: 30px 45px;
  box-sizing: border-box;
}

.item {
  text-align: center;
  margin-bottom: 12px;
}

.item-box {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 210px;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 15%), 0 -1px 2px 0 rgb(0 0 0 / 15%);
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 15%), 0 -2px 4px 0 rgb(0 0 0 / 15%);
  }
  &.isCurrentRepo::before {
    content: "";
    position: absolute;
    top: -30px;
    left: -30px;
    border-width: 30px;
    border-color: transparent red transparent transparent;
    border-style: solid;
    border-radius: 30px;
    transform: rotate(45deg);
  }

  .add {
    font-size: 50px;
    color: #cca9a9;
    line-height: 170px;
  }
}

.corners {
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 2000;
}

.corner {
  display: block;
  line-height: 30px;
  color: #fff;
  font-size: 14px;
  border-radius: 20px 0 0 20px;
  padding: 0 20px 0 10px;
  background-color: #ffcd2c;
  margin-top: 10px;
  cursor: pointer;
  transition: transform 0.3s ease-out;
  transform: translate(10px, 0);
  &:nth-child(1) {
    background-color: #409eff;
  }
  &:nth-child(2) {
    background-color: #67c23a;
  }
  &:nth-child(3) {
    background-color: #ffcd2c;
  }
  &:nth-child(4) {
    background-color: #f56c6c;
  }
  &:nth-child(5) {
    background-color: #e6a23c;
  }
  &:hover {
    transform: translate(0px, 0);
  }
}

.platformform {
  width: 70%;
  margin: 0 auto;
}

.explain-list {
  padding: 10px;

  li {
    margin-bottom: 10px;
  }
}
</style>
