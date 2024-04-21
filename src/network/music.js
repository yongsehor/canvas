import { request } from "./req.js";

// 根据id查询歌曲url
export function _getSongUrlsById(id) {
  return request({
    url: "/song/url",
    params: {
      id: id,
    },
  }).catch((err) => err.response);
}

/* 
  由于/playlist/detail接口返回的歌曲信息不完整
  但歌曲id是完整的 因此用歌曲id再次请求/song/detail获取歌曲详情 
*/
export function _getPlayListDetialBySongsId(ids) {
  return request({
    method: "post",
    url: `/song/detail`,
    params: { ids },
  }).catch((err) => err.response);
}

// 根据id获取歌词
export function _getLyric(id) {
  return request({
    url: "/lyric",
    params: { id },
  }).catch((err) => err.response);
}

// 调用此接口 , 传入音乐 id, 可把该音乐从私人 FM 中移除至垃圾桶
export function _trash(id) {
  return request({
    url: "/fm_trash",
    params: { id },
  }).catch((err) => err.response);
}

// 喜欢音乐
export function _like(id, like) {
  return request({
    url: "/like",
    params: { id, like },
  }).catch((err) => err.response);
}

export function _checkMusic(id) {
  return request({
    url: "/check/music",
    params: { id },
  }).catch((err) => err.response);
}
