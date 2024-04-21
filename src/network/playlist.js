import { request } from "./req.js";

// 根据歌单id查找歌单详情
export function _getPlayListDetialById(id) {
  return request({
    url: "/playlist/detail",
    params: { id },
  }).catch((err) => err.response);
}

// 收藏or取消收藏 歌单
export function _subPlayList(t, id) {
  return request({
    url: `/playlist/subscribe`,
    params: { t, id },
  }).catch((err) => err.response);
}

// 根据用户id获取用户歌单信息
export function _getUserPlayListByid(uid) {
  return request({
    url: `/user/playlist`,
    params: { uid },
    withCredentials: true,
  });
}

export function _getplaylistDetailDynamic(id) {
  return request({
    url: "/playlist/detail/dynamic",
    params: { id },
  }).catch((err) => err.response);
}

// 获取歌单收藏者
export function _getPlaylistSubscribers(id, limit, offset) {
  return request({
    url: "/playlist/subscribers",
    params: { id, limit, offset },
  }).catch((err) => err.response);
}

// 获取歌单分类
export function _getPlayListCatlist() {
  return request({
    url: "/playlist/catlist",
  }).catch((err) => err.response);
}
// 获取热门歌单分类
export function _getPlayListHotCatlist() {
  return request({
    url: "/playlist/hot",
  }).catch((err) => err.response);
}
// 获取歌单 ( 网友精选碟 )
export function _getTopPlayList(cat, offset) {
  return request({
    url: "/top/playlist",
    params: { cat, offset },
  }).catch((err) => err.response);
}
// 获取精品歌单标签列表
export function _getPlaylistHighqualityTags() {
  return request({
    url: "/playlist/highquality/tags",
  }).catch((err) => err.response);
}

// 获取精品歌单
export function _getTopPlaylistHighquality(cat, before) {
  return request({
    url: "/top/playlist/highquality",
    params: { cat, limit: 60, before },
  }).catch((err) => err.response);
}
