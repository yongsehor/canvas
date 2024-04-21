import { request } from "./req.js";

// 获取所有榜单
export function _getToplist() {
  return request({
    url: `/toplist`,
  }).catch((err) => err.response);
}
// 获取所有榜单内容摘要
export function _getAllToplistDetail() {
  return request({
    url: `/toplist/detail`,
  }).catch((err) => err.response);
}
