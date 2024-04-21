<template>
  <div id="user">
    <!-- 头部导航栏区域 -->
    <van-nav-bar
      class="navBar"
      fixed
      :border="false"
      :style="{ backgroundColor: backgroundColor }"
    >
      <template #left>
        <van-icon name="wap-nav" class="icon" @click="showPopup" />
      </template>
      <template #title>
        <div class="navBarUserInfo" :style="{ opacity: opacity }">
          <van-image class="nb_userPic" :src="accountData.avatarUrl" />
          <div class="nb_userName">{{ accountData.nickname }}</div>
        </div>
      </template>
    </van-nav-bar>
    <div class="UserInfobody">
      <!-- 用户信息区 -->
      <div class="userInfo" @click="toUserInfoDetailPage(accountData.userId)">
        <van-image class="userPic" :src="accountData.avatarUrl" />
        <div class="userText">
          <div class="userName">{{ accountData.nickname }}</div>
          <div class="userLeve">Lv.{{ userLevel }}</div>
        </div>
        <van-icon name="arrow" class="ui_icon" />
      </div>
      <!-- 功能区 -->
      <div class="menuGird">
        <div class="grid_item">
          <van-icon name="music-o" class="u_icon" />
          <div class="text">本地 / 下载</div>
        </div>
        <div class="grid_item">
          <van-icon class-prefix="my-icon" name="cloud" class="u_icon" />
          <div class="text">云盘</div>
        </div>
        <div class="grid_item">
          <van-icon class-prefix="my-icon" name="buy" class="u_icon" />
          <div class="text">已购</div>
        </div>
        <div class="grid_item">
          <van-icon class-prefix="my-icon" name="historyPlay" class="u_icon" />
          <div class="text">最近播放</div>
        </div>
        <div class="grid_item">
          <van-icon name="friends-o" class="u_icon" />
          <div class="text">我的好友</div>
        </div>
        <div class="grid_item">
          <van-icon name="star-o" class="u_icon" />
          <div class="text">收藏和赞</div>
        </div>
        <div class="grid_item">
          <van-icon class-prefix="my-icon" name="blog" class="u_icon" />
          <div class="text">我的博客</div>
        </div>
        <div class="grid_item">
          <van-icon name="plus" class="u_icon" color="#ccc" />
          <div class="text">更多音乐应用</div>
        </div>
      </div>
      <!-- 我喜欢的音乐 -->
      <div class="likeMusicBox" @click="toPlayListDetail(userLikePlayList.id)">
        <van-image class="lmb_pic" :src="userLikePlayList.coverImgUrl" />
        <div class="lmb_txt">
          <div class="title">我喜欢的音乐</div>
          <div class="num">{{ userLikePlayList.trackCount }}首</div>
        </div>
        <div class="lmn_xdicon">
          <van-icon class-prefix="my-icon" name="likemodel" class="lmb_icon" />
          <span class="txt">心动模式</span>
        </div>
      </div>
    </div>
    <!-- 歌单功能区 -->
    <van-tabs
      v-model="active"
      scrollspy
      sticky
      offset-top="46"
      color="#5282E7"
      :background="tabBackground"
    >
      <van-tab title="创建歌单">
        <div class="buildSongListBox">
          <div class="title">
            <div class="t_txt">
              创建歌单（{{ createdPlaylistCount - 1 }}个）
            </div>
            <div class="t_memu">
              <van-icon name="plus" />
              <van-icon
                class-prefix="my-icon"
                class="more"
                name="col_ellipsis"
              />
            </div>
          </div>
          <div
            class="body"
            v-for="playListItem in userCreatePlayList"
            :key="playListItem.index"
            @click="toPlayListDetail(playListItem.id)"
          >
            <van-image class="b_SL_pic" :src="playListItem.coverImgUrl" />
            <div class="b_SL_txt">
              <div class="t_title van-ellipsis">{{ playListItem.name }}</div>
              <div class="t_sonNum">{{ playListItem.trackCount }}首</div>
            </div>
            <div class="b_SL_more">
              <van-icon class-prefix="my-icon" name="col_ellipsis" />
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="收藏歌单">
        <div class="buildSongListBox">
          <div class="title">
            <div class="t_txt">收藏歌单（{{ subPlaylistCount }}个）</div>
            <div class="t_memu">
              <van-icon name="plus" />
              <van-icon
                class-prefix="my-icon"
                class="more"
                name="col_ellipsis"
              />
            </div>
          </div>
          <!-- 循环体 -->
          <div
            class="body"
            v-for="playListItem in userSubPlayList"
            :key="playListItem.index"
            @click="toPlayListDetail(playListItem.id)"
          >
            <van-image class="b_SL_pic" :src="playListItem.coverImgUrl" />
            <div class="b_SL_txt">
              <div class="t_title van-ellipsis">{{ playListItem.name }}</div>
              <div class="t_sonNum van-ellipsis">
                {{ playListItem.trackCount }}首 By
                {{ playListItem.creator.nickname }}
              </div>
            </div>
            <div class="b_SL_more">
              <van-icon class-prefix="my-icon" name="col_ellipsis" />
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="歌单助手">
        <div class="gedangzhushou">
          <div class="title">
            <div class="t_txt">歌单助手</div>
          </div>
          <div class="gdzsBody">
            <div class="body_title">你可以从歌单中选出</div>
            <div class="gdzsContentBody">
              <ul class="gdzsUl" :class="{ marquee_top: animate }">
                <li v-for="item in autoLunboText" :key="item.index">
                  适合
                  <span class="bg" :class="item.bg1">{{ item.first }}</span>
                  听的
                  <span class="bg" :class="item.bg2">{{ item.second }}</span>
                </li>
              </ul>
            </div>
            <div class="button">
              <van-button
                round
                size="small"
                type="info"
                color="linear-gradient(to right, #ff6034, #ee0a24)"
                onclick="javascript: alert('没想到吧这是假的，无事发生');"
              >
                <span>试试看</span></van-button
              >
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 底部导航栏 -->
    <tab-bar></tab-bar>
    <!-- 弹出层组件 -->
    <sidebar ref="popup" />
    <loading />
  </div>
</template>

<script>
import TabBar from "../components/TabBar.vue";
import Sidebar from "../components/Sidebar.vue";
import { _getUserInfo, _getUserSubCount, _getUserLv } from "../network/user.js";
import { _getUserPlayListByid } from "../network/playlist.js";
export default {
  data() {
    return {
      active: 0,
      opacity: "0",
      tabBackground: "transparent",
      backgroundColor: "transparent",
      createdPlaylistCount: "",
      subPlaylistCount: "",
      userLevel: "",
      accountData: {},
      userLikePlayList: {},
      userCreatePlayList: [],
      userSubPlayList: [],
      autoLunboText: [
        {
          first: "晚上",
          second: "日语",
          bg1: "Green",
          bg2: "Red",
        },
        {
          first: "开车",
          second: "DJ",
          bg1: "Green",
          bg2: "Blue",
        },
        {
          first: "聚会",
          second: "氛围歌",
          bg1: "Blue1",
          bg2: "Red",
        },
        {
          first: "起床",
          second: "温柔系歌曲",
          bg1: "Blue",
          bg2: "Blue1",
        },
      ],
      animate: false,
    };
  },
  methods: {
    // 跳转歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
    // 控制弹出层的显示和隐藏
    showPopup() {
      this.$refs.popup.show = true;
    },
    // 控制头部导航栏中的用户信息的显示与隐藏
    handleScrollByHearBarUserInfo() {
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop > 60) {
        this.backgroundColor = "#ffffff";
        this.opacity = "1";
      } else {
        this.backgroundColor = "transparent";
        this.opacity = "0";
      }
      if (scrollTop > 300) {
        this.tabBackground = "#ffffff";
      } else {
        this.tabBackground = "transparent";
      }
    },
    // 获取 用户信息 歌单收藏数量 等级等数据
    async getSomethingData() {
      this.$store.commit("showLoading");

      let { data: accountRes } = await _getUserInfo();
      let { data: subcountRes } = await _getUserSubCount();
      let { data: levelRes } = await _getUserLv();
      if (subcountRes.code === 200) {
        this.createdPlaylistCount = subcountRes.createdPlaylistCount;
        this.subPlaylistCount = subcountRes.subPlaylistCount;
      }
      if (levelRes.code === 200) this.userLevel = levelRes.data.level;
      if (accountRes.code === 200) {
        this.accountData = accountRes.profile;
        // 获取到用户信息之后获取歌单信息
        this.getUserPlayList(this.accountData.userId);
      }

      this.$store.commit("hiddenLoading");
    },
    // 获取用户歌单
    async getUserPlayList(id) {
      let { data } = await _getUserPlayListByid(id);
      if (data.code === 200) {
        for (let i = 0; i < data.playlist.length; i++) {
          if (data.playlist[i].specialType === 5) {
            this.userLikePlayList = data.playlist[i];
          } else if (data.playlist[i].userId === id) {
            this.userCreatePlayList.push(data.playlist[i]);
          } else {
            this.userSubPlayList.push(data.playlist[i]);
          }
        }
      }
    },
    // 歌单助手文字自动轮播
    textAutoLunbo() {
      this.animate = true;
      setTimeout(() => {
        this.autoLunboText.push(this.autoLunboText[0]);
        this.autoLunboText.shift();
        this.animate = false;
      }, 500);
    },
    toUserInfoDetailPage(id) {
      this.$router.push({
        path: "userinfo",
        query: { id },
      });
    },
  },
  components: {
    TabBar,
    Sidebar,
  },
  mounted() {
    window.addEventListener("scroll", this.handleScrollByHearBarUserInfo);
    this.getSomethingData();
  },
  created() {
    setInterval(this.textAutoLunbo, 1000);
  },
};
</script>

<style lang="less" scoped>
#user {
  .navBar {
    position: sticky;
    transition: background-color 0.6s ease-in-out;
    top: 0;
    .icon {
      font-size: 20px;
      color: #70acff;
    }
    .navBarUserInfo {
      color: #000;
      display: flex;
      align-items: center;
      transition: opacity 0.5s ease-in;
      .nb_userPic {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
      }
      .nb_userName {
        padding-left: 8px;
        font-size: 12px;
      }
    }
  }
  .UserInfobody {
    margin: 0 12px;
    .userInfo {
      display: flex;
      align-items: center;
      height: 66px;
      padding: 0 8px;
      .userPic {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #fff;
      }
      .userText {
        width: 78%;
        padding-left: 16px;
        .userName {
          font-size: 14.5px;
          letter-spacing: 0.07em;
          font-weight: 500;
        }
        .userLeve {
          margin-top: 6px;
          width: 34px;
          height: 14px;
          line-height: 14px;
          border-radius: 20px;
          text-align: center;
          font-size: 10px;
          background-color: #fff;
        }
      }
      .ui_icon {
        font-size: 16px;
      }
    }
    .menuGird {
      margin-bottom: 14px;
      display: grid;
      grid-template-columns: repeat(4, 25%);
      background-color: #fff;
      border-radius: 16px;
      place-items: center center;
      .grid_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px 0 10px;
        .u_icon {
          color: #2379f2;
          font-size: 28px;
        }
        .text {
          margin-top: 10px;
          font-size: 11px;
          color: #898989;
        }
      }
    }
    .likeMusicBox {
      background-color: #fff;
      border-radius: 16px;
      margin-bottom: 14px;
      height: 90px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      .lmb_pic {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }
      .lmb_txt {
        width: 58%;
        padding-left: 10px;
        .title {
          font-size: 14px;
        }
        .num {
          margin-top: 4px;
          font-size: 10px;
          color: #a4a4a4;
        }
      }
      .lmn_xdicon {
        text-align: center;
        font-size: 10px;
        border-radius: 15px;
        box-sizing: border-box;
        width: 80px;
        box-shadow: 0 1px 0.5px rgba(20%, 20%, 40%, 0.5) inset;
        height: 22px;
        border: 1px solid #787878;
        display: flex;
        justify-content: center;
        align-items: center;
        .lmb_icon {
          color: #000;
          font-size: 19px;
        }
        > span.txt {
          font-size: 10px;
          margin-left: 4px;
        }
      }
    }
  }
  .buildSongListBox {
    background-color: #fff;
    padding: 10px 14px;
    .title {
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .t_txt {
        font-size: 12px;
        color: #898989;
      }
      .t_memu {
        display: flex;
        font-size: 16px;
        color: #9d9d9d;
        .more {
          margin-left: 10px;
        }
      }
    }
    .body {
      display: flex;
      margin: 10px 0px;
      align-items: center;
      width: 100%;
      position: relative;
      .b_SL_pic {
        width: 46px;
        height: 46px;
        overflow: hidden;
        border-radius: 10px;
      }
      .b_SL_txt {
        width: 260px;
        margin-left: 14px;
        .t_title {
          font-size: 13.5px;
        }
        .t_sonNum {
          margin-top: 4px;
          font-size: 10px;
          color: #a4a4a4;
        }
      }
      .b_SL_more {
        font-size: 16px;
        color: #a4a4a4;
        position: absolute;
        right: 0;
      }
    }
  }
  .gedangzhushou {
    margin-bottom: 100px;
    .title {
      margin-left: 0.37333rem;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .t_txt {
        font-size: 12px;
        color: #898989;
      }
      .t_memu {
        display: flex;
        font-size: 16px;
        color: #9d9d9d;
        .more {
          margin-left: 16px;
        }
      }
    }
    .gdzsBody {
      display: flex;
      flex-direction: column;
      align-items: center;
      .body_title {
        text-align: center;
        font-size: 12px;
        margin-top: 6px;
        color: #a4a4a4;
      }
      .gdzsContentBody {
        height: 30px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        overflow: hidden;
        margin: 16px 0;
        list-style: none;
        color: #a4a4a4;
        .marquee_top {
          transition: all 0.3s;
          margin-top: -30px;
        }
        li {
          margin-top: 10px;
        }
        .bg {
          padding: 0 4px;
          margin: 0 2px;
        }
        .Org {
          background-color: #ffe5b6;
          color: #ffb327;
        }
        .Red {
          background-color: #ffb6b6;
          color: #ff2727;
        }
        .Green {
          background-color: #ccffb6;
          color: #39ff27;
        }
        .Blue {
          background-color: #b9b6ff;
          color: #2744ff;
        }
        .Blue1 {
          background-color: #b6feff;
          color: #27c5ff;
        }
      }
    }
  }
}
</style>