import { request } from "./req";
// 歌手详情
export function _getArtistDetail(id) {
  return request({
    url: "/artist/detail",
    params: { id },
  }).catch((err) => err.reponse);
}
/* 获取歌手单曲
说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲 */
export function _getArtists(id) {
  return request({
    url: "/artists",
    params: { id },
  }).catch((err) => err.reponse);
}
// 歌手热门50首
export function _getArtistTopSongs(id) {
  return request({
    url: "/artist/top/song",
    params: { id },
  }).catch((err) => err.reponse);
}
// 歌手全部歌曲
export function _getArtistSongs(id) {
  return request({
    url: "/artist/songs",
    params: { id },
  }).catch((err) => err.reponse);
}
// 获取歌手专辑
export function _getArtistAlbum(id, offset) {
  return request({
    url: "/artist/album",
    params: { id, offset },
  }).catch((err) => err.reponse);
}
// 获取歌手描述
export function _getArtistDesc(id) {
  return request({
    url: "/artist/desc",
    params: { id },
  }).catch((err) => err.reponse);
}
// 获取相似歌手
export function _getSimiArtist(id) {
  return request({
    url: "/simi/artist",
    params: { id },
  }).catch((err) => err.reponse);
}
// 获取歌手mv
export function _getMv(id, offset) {
  return request({
    url: "/artist/mv",
    params: { id, offset },
  }).catch((err) => err.reponse);
}

// 获取歌手（用户）动态
export function _getEvent(uid, lasttime) {
  return request({
    url: "/user/event",
    params: { uid, lasttime },
  }).catch((err) => err.reponse);
}
