import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 导入初始化样式表
import "../src/assets/css/reset.css";
import "../src/assets/css/icon.css";
// 导入响应式组件
import "amfe-flexible";
// 导入VantUI框架
import Vant from "vant";
import "vant/lib/index.css";
import "vant/lib/index.less";
Vue.use(Vant);
// 导入vant的 懒加载 弹出框 轻提示 组件
import { Lazyload, Dialog, Toast, Notify } from "vant";
Vue.use(Lazyload);
Vue.prototype.$msg = Toast;
Vue.prototype.$dialog = Dialog;
Vue.prototype.$notify = Notify;
//引入全局过滤器
import filters from "./assets/js/format.js";
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]));
// 导入Vuex
import store from "./store";

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();

// 注册全局组件
import Loading from "./components/Loading.vue";
Vue.component("loading", Loading);

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem("token");
  if (to.matched.some((r) => r.meta.isUserLogin)) {
    if (token) {
      next();
    } else {
      Toast.fail("您尚未登录 请先登录");
      next({
        path: "/index",
        param: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
