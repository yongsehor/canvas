import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 分钟访问重复路由时报错
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  { path: "/", redirect: "/index" },
  // 首页
  { path: "/index", name:'index',component: () => import("@/views/Index.vue") },
  // 登录
  { path: "/login",name:'login', component: () => import("@/views/Login.vue") },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
