import { request } from "./req.js";

export function _getAlbum(id) {
  return request({
    url: "/album",
    params: { id },
  });
}

export function _getAlbumDetailDynamic(id) {
  return request({
    url: "/album/detail/dynamic",
    params: { id },
  });
}

export function _albumSub(id, t) {
  return request({
    url: "/album/sub",
    params: { id, t },
  });
}
