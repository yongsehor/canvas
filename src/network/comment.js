import { request } from "./req";

// 说明 : 调用此接口 , 传入资源类型和资源id,以及排序方式,可获取对应资源的评论
// 可选参数 :
// pageNo:分页参数,第N页,默认为1
// pageSize:分页参数,每页多少条数据,默认20
// sortType: 排序方式,1:按推荐排序,2:按热度排序,3:按时间排序
// cursor: 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time
export function _getCommentNew(id, type, pageNo, sortType, cursor) {
  return request({
    url: "/comment/new",
    params: { id, type, pageNo, sortType, cursor },
  }).catch((err) => err.response);
}

// 给评论点赞/取消点赞
export function _likeComment(id, cid, t, type) {
  return request({
    url: "/comment/like",
    params: { id, cid, t, type },
  }).catch((err) => err.response);
}

// 查看楼层评论
export function _getparentComment(parentCommentId, id, type, time) {
  return request({
    url: "/comment/floor",
    params: { parentCommentId, id, type, time },
  }).catch((err) => err.response);
}
