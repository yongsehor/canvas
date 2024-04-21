<template>
  <van-tabbar v-model="active" active-color="#ee0a24" route>
    <van-tabbar-item icon="home-o" to="/index">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/search/hotSearch">搜索</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style>
</style>