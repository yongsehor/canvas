<template>
  <div class="parentComment">
    <div class="headerBox">
      <div class="h_item">
        <div class="hb_pic">
          <van-image class="img" :src="ownerUserinfo.avatarUrl" round />
        </div>
        <div class="hb_content">
          <div class="info">
            <div class="userinfo">
              <div class="username">{{ ownerUserinfo.nickname }}</div>
              <div class="sendtime">
                {{ ownerComment.time | formatDate(3) }}
              </div>
            </div>
            <div class="likeinfo">
              <div class="count">{{ ownerComment.likedCount }}</div>
              <van-icon name="good-job-o" />
            </div>
          </div>
          <div class="commentTxt">
            {{ ownerComment.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="pc_title">全部回复</div>
    <div class="pc_body">
      <van-list
        finished-text="没有更多了"
        v-model="pl_loading"
        :finished="pl_finished"
        @load="getParentCommentDetail(comment_id, pl_id, time)"
        :key="comment_id"
      >
        <div
          class="pc_item"
          v-for="items in commentsList"
          :key="items.commentId"
        >
          <van-image class="hb_pic" :src="items.user.avatarUrl" round />
          <div class="hb_content">
            <div class="info">
              <div class="userinfo">
                <div class="username">{{ items.user.nickname }}</div>
                <div class="sendtime">{{ items.time | formatDate(3) }}</div>
              </div>
              <div class="likeinfo">
                <div class="count">{{ items.likedCount }}</div>
                <van-icon name="good-job-o" />
              </div>
            </div>
            <div class="commentTxt">
              <div class="content">
                {{ items.content }}
              </div>
              <div
                class="beReplied"
                v-if="items.beReplied[0].beRepliedCommentId !== comment_id"
              >
                <div v-if="items.beReplied[0].content">
                  <span class="beuser"
                    >@{{ items.beReplied[0].user.nickname }}</span
                  >
                  <span>{{ items.beReplied[0].content }}</span>
                </div>
                <div v-else>
                  <span>该评论已删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { _getparentComment } from "../../network/comment";
export default {
  data() {
    return {
      // 歌单id
      pl_id: this.playlistid,
      // 评论id
      comment_id: this.targetId,
      // 评论资源类型
      commentType: this.comment_type,
      // 楼层回复总数
      totalCount: 0,
      // 父级评论的评论信息
      ownerComment: {},
      // 父级评论的评论者消息
      ownerUserinfo: {},

      // 分页参数，每一页的最后一项的事件
      time: "",
      // 楼层评论列表
      commentsList: [],
      pl_loading: false,
      pl_finished: false,
    };
  },
  props: ["targetId", "playlistid", "comment_type"],
  methods: {
    // 获取头部的评论信息
    async getheaderBoxMsg(comment_id, pl_id) {
      let { data: res } = await _getparentComment(
        comment_id,
        pl_id,
        this.commentType
      );
      if (res.code !== 200) return this.$msg.fail(res.message);
      this.ownerComment = res.data.ownerComment;
      this.ownerUserinfo = res.data.ownerComment.user;
      this.totalCount = res.data.totalCount;
      this.sendCount();
    },
    // 获取评论列表信息
    async getParentCommentDetail(comment_id, pl_id, time) {
      let { data: res } = await _getparentComment(
        comment_id,
        pl_id,
        this.commentType,
        time
      );
      if (res.code !== 200) return this.$msg.fail(res.message);
      this.time = res.data.time;
      // 保存这次查询出来的评论列表中最后一条数据的time,用于下次查询
      for (let i = 0; i < res.data.comments.length; i++) {
        this.commentsList.push(res.data.comments[i]);
      }
      // 加载状态结束
      this.pl_loading = false;
      // 如果取出来的数据不足20条 说明数据全部加载完成
      if (res.data.comments.length < 20) {
        this.pl_finished = true;
      }
    },
    // 向父组件发送参数
    sendCount() {
      this.$emit("getcount", this.totalCount);
    },
  },
  // 监听评论id的变化
  watch: {
    targetId(newId, oldId) {
      this.commentsList = [];
      this.comment_id = newId;
      this.time = "";
      this.pl_finished = false;
      this.getheaderBoxMsg(this.comment_id, this.pl_id);
    },
  },
  mounted() {
    this.getheaderBoxMsg(this.comment_id, this.pl_id);
  },
};
</script>

<style lang="less" scoped>
.parentComment {
  height: 600px;
  background-color: #ccc;
  .headerBox,
  .pc_body {
    background-color: #fff;
  }
  .pc_title {
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    background-color: #fff;
    margin-top: 6px;
    padding-left: 6px;
  }
  .pc_item {
    padding: 6px 0;
  }
  .h_item,
  .pc_item {
    display: grid;
    grid-template-columns: 16% 84%;
    .hb_pic {
      margin-left: 8px;
      width: 40px;
      height: 40px;
    }
    .hb_content {
      .info {
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .userinfo {
          .username {
            font-size: 14px;
          }
          .sendtime {
            margin-top: 4px;
            color: #a5a5a5;
            font-size: 10px;
          }
        }
        .likeinfo {
          display: flex;
          font-size: 12px;
          color: #a5a5a5;
          margin-right: 12px;
          align-items: center;
          height: 16px;
          .count {
            padding-right: 4px;
          }
        }
      }
      .commentTxt {
        font-size: 14.6px;
        padding: 2px 6px 4px 0;
        margin-top: 6px;
        .beReplied {
          margin-top: 4px;
          background-color: rgba(230, 230, 230, 0.1);
          font-size: 11.6px;
          color: #9d9d9d;
          padding: 5.6px 8px;
          border-left: 3px solid #c6c6c6;
          .beuser {
            color: #1b78fb;
            padding-right: 4px;
          }
        }
      }
    }
  }
}
</style>