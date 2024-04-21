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
  { path: "/index", component: () => import("@/views/Index.vue") },
  // 登录
  { path: "/login", component: () => import("@/views/Login.vue") },
  // 关于
  { path: "/about", component: () => import("@/views/About.vue") },
  // 搜索
  {
    path: "/search",
    component: () => import("@/views/Search.vue"),
    redirect: "/search/hotSearch",
    children: [
      {
        path: "/search/hotSearch",
        component: () => import("@/views/HotSearch.vue"),
      },
      {
        path: "/search/searchConent",
        component: () => import("@/views/SearchConent.vue"),
      },
    ],
  },
  // 每日推荐
  {
    path: "/dailyrecom",
    meta: { isUserLogin: true },
    component: () => import("@/views/Dailyrecom.vue"),
  },
  // 我的消息
  {
    path: "/myMessage",
    meta: { isUserLogin: true },
    component: () => import("@/views/MyMessage.vue"),
  },
  // 私信详情
  {
    path: "/userMsgDetail",
    meta: { isUserLogin: true },
    component: () => import("@/views/DetailViews/UserMsgDetail.vue"),
  },
  // 个人中心
  {
    path: "/user",
    meta: { isUserLogin: true },
    component: () => import("@/views/User.vue"),
  },
  {
    path: "/artist",
    component: () => import("@/views/DetailViews/ArtistInfoDetail.vue"),
  },
  // 歌单详情
  {
    path: "/playlistDetail",
    component: () => import("@/views/DetailViews/PlayListDetail.vue"),
  },
  // 专辑详情
  {
    path: "/albumDetail",
    component: () => import("@/views/DetailViews/AlbumDetail.vue"),
  },
  // 私人fm
  {
    path: "/personalfm",
    component: () => import("@/views/PersonalFm.vue"),
  },
  // 排行榜列表详情
  {
    path: "/toplist",
    component: () => import("@/views/DetailViews/TopListDetail.vue"),
  },
  // 用户详情页面
  {
    path: "/userinfo",
    component: () => import("@/views/DetailViews/UserInfoDetail.vue"),
  },
  // 歌单广场
  {
    path: "/playlistgroup",
    component: () => import("@/views/PlayListGroup.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
