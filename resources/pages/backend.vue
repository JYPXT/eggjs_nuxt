<template>
  <section class="main">
    <nuxt-child></nuxt-child>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      drawer: false,
      visible: false,
    };
  },
  computed: {
    ...mapState(["isOauth"]),
  },
  mounted() {
    if (this.isOauth) {
      if (this.$route.name === "backend-home") {
        this.$apis.getFirstPlatform().then((data) => {
          this.$router.replace(`/backend/home/repo/${data}`);
        });
      }
    } else {
      this.$router.replace("/backend/login");
    }
  },
  methods: {},
};
</script>

<style lang="postcss" scoped>
.main {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}
</style>
