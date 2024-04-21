import { request } from "./req.js";

// 获取私人fm里面的数据
export function _getPersonalFm() {
  return request({
    url: `/personal_fm`,
  }).catch((err) => err.response);
}
