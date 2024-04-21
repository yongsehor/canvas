import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 加载组件
    isLoading: false,
    // 歌单/专辑/私人FM中的歌曲的评论组件
    isPopup: false,
    // 歌单收藏者列表组件
    isSubPopup: false,
    // 全局播放器中的歌曲的评论组件
    isSongCommentPopup: false,
    isMusicPlayPlaceholder: false,
  },
  mutations: {
    showLoading(state) {
      state.isLoading = true;
    },
    hiddenLoading(state) {
      state.isLoading = false;
    },
    showPopup(state) {
      state.isPopup = true;
    },
    hiddenPopup(state) {
      state.isPopup = false;
    },
    showSubPopup(state) {
      state.isSubPopup = true;
    },
    hiddenSubPopup(state) {
      state.isSubPopup = false;
    },
    showisSongCommentPopup(state) {
      state.isSongCommentPopup = true;
    },
    hiddenisSongCommentPopup(state) {
      state.isSongCommentPopup = false;
    },
    showMusicPlayPlaceholder(state) {
      state.isMusicPlayPlaceholder = true;
    },
    hiddenMusicPlayPlaceholder(state) {
      state.isMusicPlayPlaceholder = false;
    },
  },
  actions: {},
  getters: {},
  modules: {},
});
