import { request } from "./req.js";

// 获取轮播图数据
export function _getSwipe() {
  return request({
    url: "/banner?type=2",
  }).catch((err) => err.response);
}

// 获取推荐歌单列表数据
export function _getRecomPlayList(limit) {
  return request({
    url: `personalized`,
    params: { limit },
  }).catch((err) => err.response);
}

// 获得首页的排行榜数据
export function _getSingerRanking(type) {
  return request({
    url: `/toplist/artist`,
    params: { type },
  }).catch((err) => err.response);
}

// 获取首页中的 每日推荐 中的歌单列表
export function _getDailyRecom() {
  return request({
    url: `/recommend/songs`,
  }).catch((err) => err.response);
}
