<template>
  <div id="UMD">
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
          <div class="txt">{{ unickname }}</div>
        </div>
      </template>
      <template #right>
        <van-icon name="ellipsis" class="icon" />
      </template>
    </van-nav-bar>
    <!-- 私信历史列表 -->
    <div class="privateHistoryList">
      <div v-for="msg in privateHistoryList" :key="msg.id">
        <div class="msgFromItem" v-if="msg.fromUser.userId !== loginId">
          <div class="timer">{{ msg.time | formatDate(6) }}</div>
          <div class="content">
            <van-image
              class="avatar"
              fit="cover"
              :src="msg.fromUser.avatarUrl"
            />
            <div class="msg">
              <div class="msgTxt">
                {{ JSON.parse(msg.msg).msg }}
              </div>
              <!-- MV -->
              <div class="mv" v-if="JSON.parse(msg.msg).type === 7">
                <van-image class="cover" :src="JSON.parse(msg.msg).mv.imgurl" />
                <div class="mvtitle">
                  <div class="mvicon">MV</div>
                  <div class="mvname van-ellipsis">
                    {{ JSON.parse(msg.msg).mv.name }}
                  </div>
                </div>
                <div class="name">
                  <span
                    v-for="(ar, index) in JSON.parse(msg.msg).mv.artists"
                    :key="ar.id"
                  >
                    <span
                      v-if="index === JSON.parse(msg.msg).mv.artists.length - 1"
                    >
                      {{ ar.name }}
                    </span>
                    <span v-else>{{ ar.name }} / </span>
                  </span>
                </div>
                <div class="playicon my-icon">&#xe60e;</div>
                <div class="mvplaycount">
                  <div class="my-icon">&#xe6b3;</div>
                  <div>
                    {{ JSON.parse(msg.msg).mv.playCount }}
                  </div>
                </div>
                <div class="myduration">
                  {{ JSON.parse(msg.msg).mv.duration | formatDuration }}
                </div>
              </div>
              <!-- 专辑 -->
              <div class="album" v-else-if="JSON.parse(msg.msg).type === 2">
                <van-image
                  class="cover"
                  fit="cover"
                  :src="JSON.parse(msg.msg).album.picUrl"
                />
                <div class="albumContent">
                  <div class="name">{{ JSON.parse(msg.msg).album.name }}</div>
                  <div class="by">
                    <span
                      v-for="(ar, index) in JSON.parse(msg.msg).album.artists"
                      :key="ar.id"
                    >
                      <span
                        v-if="
                          index === JSON.parse(msg.msg).album.artists.length - 1
                        "
                      >
                        {{ ar.name }}
                      </span>
                      <span v-else>{{ ar.name }} / </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="msgSendItem" v-else>
          <div class="timer">{{ msg.time | formatDate(6) }}</div>
          <div class="content">
            <van-image
              class="avatar"
              fit="cover"
              :src="msg.fromUser.avatarUrl"
            />
            <div class="msg">
              <div class="msgTxt">
                {{ JSON.parse(msg.msg).msg }}
              </div>
              <div class="msgType"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _getPrivateMsgHistory } from "../../network/user";
export default {
  data() {
    return {
      loginId: 0,
      uid: this.$route.query.id,
      unickname: this.$route.query.name,
      privateHistoryList: [],
    };
  },
  methods: {
    async getPrivateHistory(id) {
      let { data } = await _getPrivateMsgHistory(id);
      if (data.code === 200) this.privateHistoryList = data.msgs.reverse();
    },
  },
  mounted() {
    this.getPrivateHistory(this.uid);
    this.loginId = JSON.parse(window.localStorage.getItem("userinfo")).userId;
  },
};
</script>

<style lang="less" scoped>
#UMD {
  background-color: #fff;
  height: 100%;
  overflow: scroll;
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
        font-size: 16px;
        margin-left: 8px;
      }
    }
    .icon {
      color: #000;
      font-size: 20px;
    }
  }
  .privateHistoryList {
    margin-top: 46px;
    .msgFromItem,
    .msgSendItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
      .timer {
        background-color: #b9b9b9;
        color: #f5f5f5;
        border-radius: 15px;
        padding: 2px 6px;
        font-size: 10px;
        margin: 10px 0;
      }
      > div.content {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: start;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }
      }
    }
    .msgFromItem {
      .msg {
        background-color: #e9e9e9;
        color: #000;
        font-size: 12px;
        max-width: 280px;
        border-radius: 15px;
        padding: 10px;
      }
    }
    .msgSendItem {
      .msg {
        background-color: #548aff;
        color: #fff;
        font-size: 12px;
        max-width: 280px;
        border-radius: 15px;
        padding: 10px;
      }
    }
    .mv {
      margin-top: 10px;
      position: relative;
      .cover {
        border-radius: 10px;
        overflow: hidden;
      }
      .mvtitle {
        position: absolute;
        top: 4px;
        left: 10px;
        display: flex;
        align-items: center;
        height: 20px;
        .mvicon {
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: rgba(255, 255, 255, 1);
          padding: 0 2px;
          font-size: 8px;
        }
        .mvname {
          height: 18px;
          line-height: 18px;
          margin-left: 4px;
          color: #fff;
          width: 230px;
          font-size: 12px;
        }
      }
      .name {
        position: absolute;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        top: 26px;
        left: 10px;
      }
      .playicon {
        position: absolute;
        color: rgba(255, 255, 255, 0.6);
        font-size: 50px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .mvplaycount {
        position: absolute;
        display: flex;
        align-items: center;
        font-size: 10px;
        color: #fff;
        bottom: 10px;
        left: 10px;
        .my-icon {
          margin-right: 4px;
        }
      }
      .myduration {
        right: 10px;
        bottom: 10px;
        color: #fff;
        position: absolute;
        font-size: 10px;
      }
    }
    .album {
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 10px;
      margin-top: 10px;
      padding: 0 6px;
      .cover {
        width: 46px;
        height: 46px;
        border-radius: 10px;
        overflow: hidden;
      }
      .albumContent {
        width: 160px;
        margin-left: 10px;
        .name {
          font-size: 13px;
        }
        .by {
          font-size: 10px;
          margin-top: 4px;
          color: #939393;
        }
      }
    }
  }
}
</style>