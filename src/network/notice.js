import { request } from "./req";

export function _getPrivate(offset) {
  return request({
    url: "/msg/private",
    params: { offset },
  }).catch((err) => err.reponse);
}

export function _getPrivateHistory(id, before) {
  return request({
    url: "/msg/private/history",
    params: { id, before },
  }).catch((err) => err.reponse);
}
