import { request } from "./req.js";

// 获取默认的热搜关键词
export function _getDefaultHotKey() {
  return request({
    url: `search/default`,
  }).catch((err) => err.response);
}

// 获取推荐搜索内容
export function _getSuggestSearch(keywords) {
  return request({
    url: `search/suggest`,
    params: { keywords, type: "mobile" },
  }).catch((err) => err.response);
}

// 获取热搜榜
export function _getHotDetail() {
  return request({
    url: `search/hot/detail`,
  }).catch((err) => err.response);
}

/* 获取搜索结果 */
// 获取搜索结果中的数据
export function _getSearchdata(keywords, type, offset) {
  return request({
    url: `search`,
    params: { keywords, type, offset },
  });
}
