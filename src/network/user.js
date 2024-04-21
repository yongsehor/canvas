import { request } from "./req.js";

// 登录
export function _login(phone, password) {
  return request({
    url: "/login/cellphone",
    params: { phone, password },
  }).catch((err) => err.response);
}
// 获取登录状态
export function _getLoginStatus() {
  return request({
    url: `login/status`,
  }).catch((err) => err.response);
}
// 获取用户信息
export function _getUserInfo() {
  return request({
    url: `user/account`,
  }).catch((err) => err.response);
}
// 退出登陆
export function _logout() {
  return request({
    url: "/logout",
  }).catch((err) => err.response);
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export function _getUserSubCount() {
  return request({
    url: `/user/subcount`,
  }).catch((err) => err.response);
}

// 获取用户等级
export function _getUserLv() {
  return request({
    url: `/user/level`,
  }).catch((err) => err.response);
}

// 查看用户私信列表
export function _getPrivateMsg() {
  return request({
    url: `/msg/private`,
  }).catch((err) => err.response);
}

// 根据私信id获取聊天记录
export function _getPrivateMsgHistory(uid) {
  return request({
    url: `/msg/private/history`,
    params: { uid },
  }).catch((err) => err.response);
}

// 关注 / 取消关注 用户
export function _follow(id, t) {
  return request({
    url: "/follow",
    params: { id, t },
  }).catch((err) => err.response);
}
