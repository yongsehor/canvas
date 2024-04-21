<template>
  <div id="comment">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      @click-left="$store.commit('hiddenPopup')"
      class="navbar"
    >
      <template #left>
        <van-icon name="arrow-left" class="t_icon" />
        <span class="title">评论({{ totalItems }})</span>
      </template>
    </van-nav-bar>
    <!-- 歌单信息显示区域 -->
    <div class="playlistinfo">
      <div class="pl_header">
        <van-image class="pic" :src="toCommentinfos.coverImgUrl" />
        <div class="info">
          <div class="pl_name van-multi-ellipsis--l2">
            {{ toCommentinfos.name }}
          </div>
          <div class="pl_creator van-ellipsis" v-if="toCommentinfos.artists">
            by
            <span v-for="(ar, index) in toCommentinfos.artists" :key="ar.id">
              <span v-if="index === toCommentinfos.artists.length - 1">
                {{ ar.name }}
              </span>
              <span v-else> {{ ar.name }} / </span>
            </span>
          </div>
          <div class="pl_creator" v-else>by {{ toCommentinfos.username }}</div>
        </div>
      </div>
      <!-- 评论区主体 -->
      <!-- 1. 评论区头部  -->
      <van-sticky offset-top="36px">
        <div class="cm_head">
          <div class="h_title">评论区</div>
          <div class="h_memu">
            <div
              :class="{ active: style, m_item: true }"
              @click="sortByHot(2), (style = true)"
            >
              最热
            </div>
            <div
              :class="{ active: !style, m_item: true }"
              @click="sortByNew(3), (style = false)"
            >
              最新
            </div>
          </div>
        </div>
      </van-sticky>
      <!-- 2. 评论区主体内容 -->
      <div class="cm_body" v-if="commentslist.length !== 0">
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          finished-text="没有更多了"
          @load="getCommentPageInfo(id)"
        >
          <div
            class="cm_item"
            v-for="items in commentslist"
            :key="items.commentId"
          >
            <van-image class="userPic" :src="items.user.avatarUrl" round />
            <div class="cm_info">
              <div class="cm_top">
                <div class="nandt">
                  <div class="name">{{ items.user.nickname }}</div>
                  <div class="time">{{ items.time | formatDate(3) }}</div>
                </div>
                <div
                  class="like"
                  v-if="items.liked"
                  style="color: red"
                  @click="likeComment(items.commentId, 0)"
                >
                  <span class="count">{{ items.likedCount }}</span>
                  <span class="my-icon">&#xe61d;</span>
                </div>
                <div
                  class="like"
                  v-else
                  @click="likeComment(items.commentId, 1)"
                >
                  <span class="count">{{ items.likedCount }}</span>
                  <van-icon name="good-job" />
                </div>
              </div>
              <div class="info_body">
                {{ items.content }}
              </div>
              <div
                class="cm_bottom"
                v-if="items.showFloorComment.replyCount !== 0"
                @click="issheetShow(items.commentId, id)"
              >
                {{ items.showFloorComment.replyCount }}条回复
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <div class="cm_body" v-else><van-empty description="暂无评论" /></div>
    </div>
    <!-- 加载组件 -->
    <loading />
    <!-- 楼层评论动作面板组件 -->
    <van-action-sheet v-model="sheetShow" :title="`回复(${pc_totoalCount})`">
      <div class="content">
        <parent-comment-detail
          :playlistid="id"
          :targetId="targetId"
          :comment_type="comment_type"
          @getcount="getPctotal($event)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { _getCommentNew, _likeComment } from "../../network/comment";
import ParentCommentDetail from "./ParentCommentDetail.vue";
export default {
  data() {
    return {
      id: this.parentId,
      // 评论类型
      comment_type: this.type,
      style: true,
      sheetShow: false,
      // 总评论数
      totalItems: 0,
      // 评论列表
      commentslist: [],
      // 控制评论列表的加载
      listFinished: false,
      listLoading: false,
      // 分页参数,第N页,默认为1
      pageNo: 1,
      // 排序方式
      sortT: 2,
      // 上一条数据的time
      cursor: "",
      // 当前点击的评论id
      targetId: 0,
      // 楼层评论总数
      pc_totoalCount: 0,
    };
  },
  props: ["parentId", "toCommentinfos", "type"],
  methods: {
    async getCommentPageInfo(id) {
      this.listLoading = true;
      // 根据id获取评论列表
      if (this.sortT === 2) {
        let { data: comments } = await _getCommentNew(
          id,
          this.comment_type,
          this.pageNo,
          2
        );
        if (comments.code === 200) {
          this.totalItems = comments.data.totalCount;
          // 当获取到的评论数===20时候，证明这波取到的数据依然足够一页，需要页数++
          if (comments.data.comments.length === 20) {
            for (let i = 0; i < 20; i++) {
              this.commentslist.push(comments.data.comments[i]);
            }
            this.pageNo++;
          }
          // 当获取到的评论数<20时候，证明这波取到的数据不够一页，就是最后一页，
          // 说明数据已经全部加载完毕 直接全部push进列表 并且将listFinshied设置为true
          if (comments.data.comments.length < 20) {
            for (let i = 0; i < comments.data.comments.length; i++) {
              this.commentslist.push(comments.data.comments[i]);
            }
            this.listFinished = true;
          }
          // console.log(this.commentslist);
        } else {
          this.$msg.fail(comments.msg);
        }
      }
      if (this.sortT === 3) {
        let { data: comments } = await _getCommentNew(
          id,
          this.comment_type,
          this.pageNo,
          3,
          this.cursor
        );
        if (comments.code === 200) {
          this.totalItems = comments.data.totalCount;
          // 当获取到的评论数===20时候，证明这波取到的数据依然足够一页，需要页数++
          if (comments.data.comments.length === 20) {
            for (let i = 0; i < 20; i++) {
              this.commentslist.push(comments.data.comments[i]);
            }
            this.pageNo++;
            this.cursor = comments.data.cursor;
          }
          // 当获取到的评论数<20时候，证明这波取到的数据不够一页，就是最后一页，
          // 说明数据已经全部加载完毕 直接全部push进列表 并且将listFinshied设置为true
          if (comments.data.comments.length < 20) {
            for (let i = 0; i < comments.data.comments.length; i++) {
              this.commentslist.push(comments.data.comments[i]);
            }
            this.listFinished = true;
          }
          // console.log(this.commentslist);
        } else {
          this.$msg.fail(comments.msg);
        }
      }
      this.listLoading = false;
    },
    // 点赞/取消点赞
    async likeComment(cid, t) {
      let { data } = await _likeComment(this.parentId, cid, t, this.type);
      if (data.code !== 200) return this.$msg.fail(data.msg);
      if (this.sortT === 2) {
        this.sortByHot(2);
      } else {
        this.sortByNew(3);
      }
    },
    // 最热排序
    sortByHot(t) {
      this.pageNo = 1;
      this.sortT = t;
      this.cursor = "";
      this.commentslist = [];
      this.listFinished = false;
      this.getCommentPageInfo(this.id);
    },
    // 最新排序
    sortByNew(t) {
      this.pageNo = 1;
      this.sortT = t;
      this.cursor = "";
      this.commentslist = [];
      this.listFinished = false;
      this.getCommentPageInfo(this.id);
    },
    issheetShow(targetId, playlistid) {
      this.sheetShow = true;
      this.targetId = targetId;
    },
    // 接收子组件传过来的值
    getPctotal(d) {
      this.pc_totoalCount = d;
    },
  },
  components: {
    ParentCommentDetail,
  },
  mounted() {
    this.getCommentPageInfo(this.id);
  },
};
</script>

<style lang="less" scoped>
#comment {
  background-color: #e0e0e0;
  width: 100%;
  height: 667px;
  .navbar {
    background: #fff;
    .t_icon {
      color: #000;
      font-size: 16px;
    }
    .title {
      font-size: 17px;
      margin-left: 20px;
    }
  }
  .playlistinfo {
    margin-top: 46px;
    .pl_header {
      display: flex;
      height: 90px;
      align-items: center;
      background-color: #fff;
      .pic {
        width: 70px;
        height: 70px;
        border-radius: 6px;
        overflow: hidden;
        margin: 0 10px;
      }
      .info {
        width: 260px;
        .pl_name {
          font-size: 15px;
        }
        .pl_creator {
          margin-top: 4px;
          font-size: 12px;
          color: #8a8a8a;
          .username {
            color: #1919ff;
          }
        }
      }
    }
    .cm_head {
      margin-top: 10px;
      background-color: #fff;
      display: flex;
      height: 36px;
      align-items: center;
      justify-content: space-between;
      font-size: 12.6px;
      padding: 0 6px;
      font-weight: 600;
      .h_memu {
        display: flex;
        color: #8a8a8a;
        .m_item {
          margin: 0 10px;
        }
        .active {
          color: #000;
        }
      }
      .active {
        color: #000;
      }
    }
    .cm_body {
      background-color: #fff;
      .cm_item {
        display: grid;
        grid-template-columns: 16% 84%;
        justify-items: center;
        padding-top: 10px;
        .userPic {
          width: 40px;
          height: 40px;
        }
        .cm_info {
          padding: 0 16px 4px 4px;
          .cm_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 300px;
            height: 40px;
            .nandt {
              .name {
                font-size: 14.8px;
                color: #636363;
              }
              .time {
                font-size: 10px;
                margin-top: 2px;
                color: #c4c4c4;
              }
            }
            .like {
              font-size: 13.2px;
              color: #a5a5a5;
              .count {
                font-size: 12px;
                margin-right: 4px;
              }
            }
          }
          .info_body {
            margin: 4px 0;
            font-size: 14.6px;
          }
          .cm_bottom {
            height: 20px;
            line-height: 20px;
            font-size: 12.2px;
            color: #0074e8;
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 600px;
  }
}
</style>