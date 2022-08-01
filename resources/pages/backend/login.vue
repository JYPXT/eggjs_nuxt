<template>
  <section class="login" @keypress.enter="login">
    <section class="content container">
      <!-- <img :src="`${$static}/meeting.png`" alt="" /> -->
      <div class="formbox">
        <div class="title">文档管理后台</div>
        <el-form
          class="form"
          ref="form"
          :model="form"
          :rules="rules"
          @submit.native.prevent
        >
          <!-- <el-form-item prop="username">
            <el-input
              v-model.trim="form.username"
              prefix-icon="el-icon-user"
              placeholder="账号"
              name="userName"
            ></el-input>
          </el-form-item> -->
          <el-form-item prop="password">
            <el-input
              v-model.trim="form.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="密码"
              name="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-button w-full"
              type="primary"
              @click="login"
              :loading="loading"
              >{{ loginText }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </section>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    return {
      loginText: "登录",
      loading: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        // username: { required: true, message: "账号不能为空", trigger: "blur" },
        password: { required: true, message: "密码不能为空", trigger: "blur" },
      },
    };
  },
  methods: {
    ...mapMutations(["setIsOauth"]),
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { username, password } = this.form;
          this.$axios
            .post("/api/v1/login", {
              account: password,
            })
            .then((data) => {
              this.setIsOauth(true);
              if (data) {
                this.$router.replace(`/backend/home/repo/${data}`);
              } else {
                this.$router.replace("/backend/home");
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.login {
  height: 100%;
  min-width: 1200px;
  background: #2194ff;
  .header {
    background: #ffffff;
  }
}
.container {
  width: 1200px;
  margin: 0 auto;
}
.header {
  position: relative;
  height: 76px;
  padding-top: 2px;
  box-sizing: border-box;
  border-bottom: 1px solid #42b8a4;
  .website {
    float: right;
    margin-top: 26px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
  }
  .download-center {
    float: right;
    height: 32px;
    color: #ffffff;
    font-size: 14px;
    line-height: 32px;
    background-color: $primary;
    border-radius: 3px;
    padding: 0 15px;
    border: none;
    margin: 20px 0 0;
    outline-style: none;
    cursor: pointer;
  }
}
.content {
  width: 1200px;
  height: auto;
  background-color: transparent;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -600px;
  margin-top: -216px;
}
.formbox {
  float: right;
  width: 440px;
  height: 100%;
  position: relative;
  border-radius: 5px;
  background-color: #fff;

  .title {
    font-size: 30px;
    text-align: center;
    line-height: 130px;
  }

  .form {
    box-sizing: border-box;
    padding: 0 50px;
  }

  &::v-deep {
    .el-input__inner {
      padding-left: 32px;
      &::-webkit-input-placeholder {
        color: #999999;
      }
      &::-moz-placeholder {
        /* Firefox 19+ */
        color: #999999;
      }
      &:-moz-placeholder {
        /* Firefox 18- */
        color: #999999;
      }
      &::-ms-input-placeholder {
        color: #999999;
      }
    }

    .el-input__icon {
      font-size: 20px;
    }
  }

  .login-button {
    margin-top: 40px;
    margin-bottom: 20px;
  }
}
</style>
