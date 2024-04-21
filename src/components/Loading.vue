<template>
  <van-loading
    size="40px"
    color="#0094ff"
    class="loading"
    v-show="this.$store.state.isLoading"
  />
</template>

<script>
export default {};
</script>

<style>
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>