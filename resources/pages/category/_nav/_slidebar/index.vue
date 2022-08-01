<script>
export default {
  async asyncData({ $apis, redirect, route }) {
    const category = route.name.split("-")[0];
    const platforms = await $apis.getPlatforms(category);
    if (!platforms || platforms.length === 0) {
      redirect({ name: "404" });
      return;
    }
    const platform =
      route.query.platform || (platforms[0] && platforms[0].value);
    if (platform) {
      const platf = platforms.find((plat) => plat.value === platform);
      redirect({ path: platf.route, query: { platform } });
    }
  },
  render() {
    return <div></div>;
  }
};
</script>
