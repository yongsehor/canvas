<template>
  <div id="index">
    <!-- 头部组件 -->
    <!-- <van-nav-bar fixed placeholder :border="false" class="navbar">
      <template #title> 绘制 </template>
    </van-nav-bar> -->
    <canvasPge/>
  </div>
</template>

<script>
import canvasPge from "../components/Index/canvasPge.vue";

export default {
  components: {
    canvasPge
  },
};
</script>

<style lang="less" scoped>
#index {
  background-color: #fff;
  .navbar {
    .menuicon {
      color: #fff;
      font-size: 18px;
    }
    .searchicon {
      font-weight: 900;
      font-size: 20px;
    }
  }
}
</style>