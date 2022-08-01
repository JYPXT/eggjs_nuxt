<template>
  <div class="not-found">
    <div class="not-found-pic">
      <img src="~@img/404.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
.not-found {
  position: relative;
  height: 100%;
  background-color: #f5f5f5;
}

.not-found-pic {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  img {
    width: 100%;
  }

  a {
    color: #3f71ff;
    font-weight: bold;
    letter-spacing: 4px;
  }
}
</style>
