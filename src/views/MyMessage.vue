<template>
  <div id="mymessage">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      @click-left="$router.go(-1)"
      class="navbar"
    >
      <template #left>
        <div class="title">
          <van-icon name="arrow-left" class="icon" />
          <div class="txt">消息</div>
        </div>
      </template>
      <template #right>
        <van-icon name="ellipsis" class="icon" />
      </template>
    </van-nav-bar>
    <!-- 主体内容 -->
    <div class="msgBody">
      <van-notice-bar
        left-icon="volume-o"
        text="由于接口为互联网dalao资源，API不完善，所以本功能模块只有基础的数据查看功能"
      />
      <!-- 头部功能栏 -->
      <div class="headGrid">
        <div class="gridItem">
          <div class="icon" style="background-color: #fc2e55">
            <van-icon class-prefix="my-icon" name="fans" />
          </div>
          <div class="txt">粉丝</div>
        </div>
        <div class="gridItem">
          <div class="icon" style="background-color: #5bb2e8">
            <van-icon class-prefix="my-icon" name="comment" />
          </div>
          <div class="txt">评论</div>
        </div>
        <div class="gridItem">
          <div class="icon" style="background-color: #fb6852">
            <van-icon class-prefix="my-icon" name="ate" />
          </div>
          <div class="txt">@我</div>
        </div>
        <div class="gridItem">
          <div class="icon" style="background-color: #fdba27">
            <van-icon class-prefix="my-icon" name="notice" />
          </div>
          <div class="txt">通知</div>
        </div>
      </div>
      <div class="title">官方消息</div>
      <div class="gmMsg">
        <div class="avatar">
          <van-icon class-prefix="my-icon" name="newsend" />
        </div>
        <div class="content">
          <div class="name">新歌发布</div>
          <div class="msg" v-if="false">J.Flas发布了新歌</div>
        </div>
        <van-icon name="arrow" class="toIcon" />
      </div>
      <div class="title">私信对话</div>
      <div class="privateMsg">
        <div class="pmItem" v-for="(msg, index) in privateMsgs" :key="index">
          <van-image
            class="pic"
            fit="cover"
            :src="msg.fromUser.avatarUrl"
            @click="toUserInfoDetailPage(msg.fromUser.userId)"
          />
          <van-image
            v-if="msg.fromUser.avatarDetail"
            class="identity"
            :src="msg.fromUser.avatarDetail.identityIconUrl"
          />
          <div
            class="content"
            @click="
              toPrivateMsgDetail(msg.fromUser.userId, msg.fromUser.nickname)
            "
          >
            <div class="name van-ellipsis">{{ msg.fromUser.nickname }}</div>
            <div class="msg van-ellipsis">
              <span v-if="JSON.parse(msg.lastMsg).title">
                {{ JSON.parse(msg.lastMsg).title }}：
              </span>
              <span>
                {{ JSON.parse(msg.lastMsg).msg }}
              </span>
            </div>
          </div>
          <div class="info">
            <p class="time">{{ msg.lastMsgTime | formatDate(1) }}</p>
            <p class="count" v-if="msg.newMsgCount">{{ msg.newMsgCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _getPrivateMsg } from "../network/user";
export default {
  data() {
    return {
      // 私信列表
      privateMsgs: [],
    };
  },
  methods: {
    async getPrivateMsg() {
      let { data } = await _getPrivateMsg();
      if (data.code === 200) this.privateMsgs = data.msgs;
    },
    toUserInfoDetailPage(id) {
      this.$router.push({ path: "/userinfo", query: { id } });
    },
    toPrivateMsgDetail(id, name) {
      this.$router.push({ path: "/userMsgDetail", query: { id, name } });
    },
  },
  mounted() {
    this.getPrivateMsg();
  },
};
</script>

<style lang="less" scoped>
#mymessage {
  .navbar {
    background-color: #fff;
    .title {
      display: flex;
      align-items: center;
      .icon {
        font-size: 16px;
        color: #000;
      }
      .txt {
        font-size: 14px;
        margin-left: 6px;
      }
    }
    .icon {
      color: #000;
      font-size: 20px;
    }
  }
  .msgBody {
    padding-top: 46px;
    .headGrid {
      height: 120px;
      background-color: #fff;
      display: grid;
      grid-template-columns: repeat(4, 25%);
      align-items: center;
      justify-content: center;
      .gridItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          text-align: center;
          line-height: 60px;
        }
        .my-icon {
          color: #fff;
          font-size: 26px;
        }
        .txt {
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }
    .title {
      height: 36px;
      font-size: 12px;
      line-height: 36px;
      margin-left: 14px;
    }
    .gmMsg {
      height: 70px;
      padding: 0 10px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .avatar {
        width: 50px;
        height: 50px;
        line-height: 50px;
        background-color: #fa5775;
        color: #fff;
        text-align: center;
        border-radius: 50%;
        font-size: 34px;
      }
      .content {
        width: 265px;
        letter-spacing: 1px;
        .name {
          font-size: 14px;
        }
        .msg {
          font-size: 10px;
          margin-top: 4px;
          color: #939393;
        }
      }
      .toIcon {
        color: #939393;
        font-size: 16px;
      }
    }
    .privateMsg {
      background-color: #fff;
      .pmItem {
        height: 70px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
        padding: 0 10px;
        .pic {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
        }
        .identity {
          width: 16px;
          height: 16px;
          position: absolute;
          left: 47px;
          top: 44px;
        }
        .content {
          width: 190px;
          .name {
            font-size: 14px;
          }
          .msg {
            font-size: 10px;
            margin-top: 4px;
            color: #939393;
          }
        }
        .info {
          width: 90px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .time {
            font-size: 10px;
            color: #939393;
          }
          .count {
            font-size: 10px;
            border-radius: 50%;
            background-color: red;
            color: #fff;
            width: 10px;
            height: 10px;
            padding: 2px;
            text-align: center;
            line-height: 10px;
            margin-top: 6px;
          }
        }
      }
    }
  }
}
</style>