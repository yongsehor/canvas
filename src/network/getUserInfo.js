import { request } from "./req.js";
// 获取用户详情
export function _getUserDetail(uid) {
  return request({
    url: "/user/detail",
    params: { uid },
  });
}

// 根据用户id获取用户歌单信息
export function _getUserPlayListByid(uid) {
  return request({
    url: `/user/playlist`,
    params: { uid },
  });
}
