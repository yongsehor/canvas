<template>
  <div id="app">
    <router-view />
    <play-music
      v-if="$route.path !== '/personalfm'"
      :class="[
        $route.path === '/index' ||
        $route.path === '/search/hotSearch' ||
        $route.path === '/user'
          ? 'bottom50'
          : 'bottom0',
      ]"
    />
    <!-- 当全局播放器显示时占位 -->
    <div
      v-show="
        $store.state.isMusicPlayPlaceholder && $route.path !== '/personalfm'
      "
      class="placeholder"
    ></div>
  </div>
</template>

<script>
import PlayMusic from "./components/PlayMusic/PlayMusic.vue";
export default {
  components: {
    PlayMusic,
  },
};
</script>

<style lang="less">
#app {
  background-color: #f5f5f5;
  .bottom50 {
    z-index: 99;
    height: 60px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 50px;
    transition: all 0.2s ease-in;
  }
  .bottom0 {
    z-index: 99;
    height: 60px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    transition: all 0.2s ease-in;
  }
  .placeholder {
    width: 100px;
    height: 60px;
  }
}
</style>
