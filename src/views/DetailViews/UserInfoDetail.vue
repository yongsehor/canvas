<template>
  <div id="userinfodetial">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      :class="navbarClass"
      @click-left="$router.go(-1)"
    >
      <template #left>
        <van-icon name="arrow-left" size="1.4em" class="nb_icon" />
      </template>
      <template #title>
        <div class="nb_title">
          <div class="t_info">
            <div class="username">{{ profile.nickname }}</div>
            <div class="userfansCount">
              {{ profile.followeds | formatNumber }} 粉丝
            </div>
          </div>
          <div
            class="t_btn"
            style="color: #9d9d9d; background-color: #e6e6e6"
            v-if="profile.followed"
            @click="follow(profile.userId, 0)"
          >
            已 关 注
          </div>
          <div
            class="t_btn"
            style="color: #fff; background-color: #5282e7"
            v-else
            @click="follow(profile.userId, 1)"
          >
            关 注
          </div>
        </div>
      </template>
      <template #right>
        <van-icon name="more-o" size="1.6em" class="nb_icon" />
      </template>
    </van-nav-bar>
    <!-- 主体内容 -->
    <div class="userMessage" :style="backgroundImage">
      <div class="um_info">
        <van-image class="avatr" :src="profile.avatarUrl" />
        <div class="info">
          <div class="username">{{ profile.nickname }}</div>
          <div class="count">
            <div>
              {{ profile.follows }}
              <span class="txt">关注</span>
            </div>
            <div>
              {{ profile.followeds | formatNumber }}
              <span class="txt">粉丝</span>
            </div>
            <div>Lv.{{ level }}</div>
          </div>
          <div class="signature van-ellipsis">
            {{ profile.signature }}
          </div>
          <div class="btn">
            <div
              class="gz_ed"
              v-if="profile.followed"
              @click="follow(profile.userId, 0)"
            >
              已关注
            </div>
            <div class="gz" v-else @click="follow(profile.userId, 1)">
              + 关注
            </div>
            <div class="sx">私 信</div>
          </div>
        </div>
      </div>
      <van-tabs
        v-model="active"
        :background="tabsbgcolor"
        offset-top="46px"
        sticky
        color="#5282E7"
        class="tabs"
      >
        <van-tab title="主页">
          <div class="tab_div baseinfo">
            <div class="title">基本信息</div>
            <div class="when">
              村龄：{{ createDays }}年（{{
                profile.createTime | formatDate(4)
              }}注册）
            </div>
            <div class="when" v-if="profile.gender === 0">性别：保密</div>
            <div class="when" v-if="profile.gender === 1">性别：男</div>
            <div class="when" v-if="profile.gender === 2">性别：女</div>
          </div>
          <div class="tab_div musicinfo">
            <div class="title">音乐品味</div>
            <div class="mi_item">
              <van-icon name="bar-chart-o" class="my-icon" />
              <div class="info">
                <div class="i_title">听歌排行</div>
                <div class="dep">累计听歌{{ listenSongs }}首</div>
              </div>
            </div>
            <div class="mi_item" @click="toPlayListDetail(userLikesPlist.id)">
              <van-icon name="like" class="my-icon" />
              <div class="info">
                <div class="i_title">{{ userLikesPlist.name }}</div>
                <div class="dep">
                  {{ userLikesPlist.trackCount }}首，播放{{
                    userLikesPlist.playCount
                  }}次
                </div>
              </div>
            </div>
          </div>
          <div class="tab_div playlistcreate">
            <div class="title">
              创建的歌单<span class="s_title"
                >({{ profile.playlistCount - 1 }}个歌单，被收藏{{
                  profile.playlistBeSubscribedCount
                }}次)</span
              >
            </div>
            <div
              class="mi_item"
              v-for="items in userCreatedPlist"
              :key="items.id"
              @click="toPlayListDetail(items.id)"
            >
              <div class="pic">
                <van-image :src="items.coverImgUrl" class="pic_img" />
              </div>
              <div class="info">
                <div class="i_title van-ellipsis">
                  {{ items.name }}
                </div>
                <div class="dep van-ellipsis">{{ items.trackCount }}首</div>
              </div>
            </div>
          </div>
          <div class="tab_div playlistsub">
            <div class="title">
              收藏的歌单<span class="s_title"
                >( {{ userSubPlist.length }} )</span
              >
            </div>
            <div
              class="mi_item"
              v-for="items in userSubPlist"
              :key="items.id"
              @click="toPlayListDetail(items.id)"
            >
              <div class="pic">
                <van-image :src="items.coverImgUrl" class="pic_img" />
              </div>
              <div class="info">
                <div class="i_title van-ellipsis">
                  {{ items.name }}
                </div>
                <div class="dep van-ellipsis">
                  {{ items.trackCount }}首，by
                  {{ items.creator.nickname }}，播放{{
                    items.playCount | formatNumber
                  }}次
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab>
          <template #title>
            动态
            <span class="tabnum">{{ profile.eventCount }}</span>
          </template>
          <div class="event">
            <div class="empty" v-if="profile.eventCount === 0">
              <van-empty description="暂无动态哦" />
            </div>
            <div v-else>
              <event :uid="uid" />
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <br />
    </div>
    <!-- 加载组件 -->
    <loading />
  </div>
</template>

<script>
import {
  _getUserDetail,
  _getUserPlayListByid,
} from "../../network/getUserInfo";
import { _follow } from "../../network/user";
import Event from "../../components/Event.vue";
export default {
  data() {
    return {
      // tab item 索引
      active: 0,
      // 用户创建日期
      createDays: 0,
      // tab背景颜色
      tabsbgcolor: "transparent",
      // 导航栏类名
      navbarClass: "navbar1",
      // 用户id
      uid: Number(this.$route.query.id),
      // 背景图片
      backgroundImage: "",
      // 用户详细信息
      profile: {},
      // 用户等级
      level: 0,
      // 用户喜欢的音乐歌单
      userLikesPlist: {},
      // 用户创建的歌单
      userCreatedPlist: [],
      // 用户收藏的歌单
      userSubPlist: [],
      // 听歌排行
      listenSongs: 0,
    };
  },
  components: {
    Event,
  },
  methods: {
    // 初始化页面
    init(id) {
      this.$store.commit("showLoading");
      this.getUserDetail(id);
      this.getUserPlaylist(id);
      this.$store.commit("hiddenLoading");
    },
    // 获取用户详情
    async getUserDetail(uid) {
      let { data: user } = await _getUserDetail(uid);
      if (user.code === 200) {
        this.level = user.level;
        this.createDays = Math.floor(user.createDays / 365);
        this.profile = user.profile;
        this.listenSongs = user.listenSongs;
        this.backgroundImage = `background-image:url(${user.profile.backgroundUrl})`;
      }
    },
    // 获取用户歌单
    async getUserPlaylist(uid) {
      let { data: userpl } = await _getUserPlayListByid(uid);
      if (userpl.code === 200) {
        for (let i = 0; i < userpl.playlist.length; i++) {
          if (userpl.playlist[i].specialType === 5) {
            this.userLikesPlist = userpl.playlist[i];
          } else if (userpl.playlist[i].userId === uid) {
            this.userCreatedPlist.push(userpl.playlist[i]);
          } else {
            this.userSubPlist.push(userpl.playlist[i]);
          }
        }
      }
    },
    // 关注 / 取消关注用户
    async follow(id, t) {
      let { data } = await _follow(id, t);
      if (data.code === 200) {
        this.getUserDetail(id);
        if (t === 1)
          this.$notify({ type: "success", message: data.followContent });
      } else {
        this.$msg.fail(data.msg || data.message);
      }
    },
    // 滑动相关
    handleScroll() {
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop > 380) {
        this.tabsbgcolor = "#fff";
        this.navbarClass = "navbar2";
      } else {
        this.tabsbgcolor = "transparent";
        this.navbarClass = "navbar1";
      }
    },
    // 跳转歌单详情页
    toPlayListDetail(id) {
      // 由于如果从收藏者列表跳转到用户详情列表的情况下 收藏者列表的popup还处于显示的状态下
      // 所以跳转到详情页后隐藏收藏列表
      this.$store.commit("hiddenSubPopup");
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.init(this.uid);
  },
};
</script>

<style lang="less" scoped>
#userinfodetial {
  background-color: #f5f5f5;
  .navbar1 {
    background-color: transparent;
    .nb_title {
      width: 222px;
      color: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      transition: opacity 0.5s ease-in;
      .t_info {
        .username {
          font-size: 15.2px;
        }
        .userfansCount {
          font-size: 10px;
          color: #6f6f6f;
          text-align: left;
          height: 12px;
          line-height: 12px;
        }
      }
      .t_btn {
        height: 24px;
        width: 48px;
        line-height: 24px;
        border-radius: 15px;
        font-size: 10px;
      }
    }
  }
  .navbar2 {
    background-color: #fff;
    z-index: 10;
    .nb_title {
      width: 222px;
      color: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 1;
      transition: opacity 0.5s ease-in;
      .t_info {
        .username {
          font-size: 15.2px;
        }
        .userfansCount {
          font-size: 10px;
          color: #6f6f6f;
          text-align: left;
          height: 12px;
          line-height: 12px;
        }
      }
      .t_btn {
        background-color: #5282e7;
        color: #fff;
        height: 24px;
        width: 48px;
        line-height: 24px;
        border-radius: 15px;
        font-size: 10px;
      }
    }
    .nb_icon {
      color: #000;
    }
  }
  .userMessage {
    padding-top: 200px;
    background-repeat: no-repeat;
    background-size: 100%;
    .um_info {
      margin: 50px auto 6px;
      width: 340px;
      border-radius: 15px;
      background-color: #fff;
      position: relative;
      .avatr {
        width: 78px;
        height: 78px;
        border-radius: 50%;
        border: 4px solid #fff;
        overflow: hidden;
        position: absolute;
        left: 50%;
        top: -39px;
        transform: translateX(-50%);
      }
      .info {
        width: 100%;
        padding-top: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .username {
          font-size: 20px;
        }
        .count {
          margin-top: 6px;
          font-size: 12px;
          display: grid;
          grid-template-columns: repeat(3, 33%);
          justify-content: center;
          > div {
            text-align: center;
            line-height: 20px;
            width: 80px;
            height: 20px;
            .txt {
              color: #a4a4a4;
              margin-left: 4px;
            }
          }
        }
        .signature {
          margin-top: 6px;
          width: 300px;
          font-size: 12.6px;
          color: #a4a4a4;
          text-align: center;
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 180px;
          height: 60px;
          > div {
            width: 60px;
            height: 24px;
            font-size: 12px;
            text-align: center;
            line-height: 24px;
            border-radius: 15px;
          }
          .gz {
            color: #fff;
            background-color: #5282e7;
          }
          .gz_ed {
            color: #9d9d9d;
            background-color: #e6e6e6;
          }
          .sx {
            border: 1px solid #ccc;
          }
        }
      }
    }
    .tabs {
      .tab_div {
        background-color: #fff;
        margin: 16px auto;
        width: 340px;
        border-radius: 15px;
        padding: 16px 14px;
        box-sizing: border-box;
        .title {
          font-size: 16px;
        }
      }
      .baseinfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .when {
          font-size: 12px;
          color: #a4a4a4;
          margin-top: 10px;
        }
      }
      .musicinfo {
        .mi_item {
          height: 60px;
          display: flex;
          align-items: center;
          margin-top: 6px;
          .my-icon {
            width: 46px;
            height: 46px;
            background-color: #48abe9;
            color: #fff;
            border-radius: 5px;
            line-height: 46px;
            text-align: center;
            font-size: 20px;
          }
          .info {
            margin-left: 10px;
            .i_title {
              font-size: 14.6px;
            }
            .dep {
              font-size: 12px;
              margin-top: 4px;
              color: #919191;
            }
          }
        }
      }
      .playlistcreate,
      .playlistsub {
        .s_title {
          font-size: 12px;
          margin-left: 6px;
          color: #9d9d9d;
        }
        .mi_item {
          height: 60px;
          display: flex;
          align-items: center;
          margin-top: 6px;
          .pic {
            width: 46px;
            height: 46px;
            border-radius: 6px;
            overflow: hidden;
            .pic_img {
              width: inherit;
              height: inherit;
            }
          }
          .info {
            margin-left: 10px;
            width: 260px;
            .i_title {
              font-size: 14.6px;
            }
            .dep {
              font-size: 12px;
              margin-top: 4px;
              color: #919191;
            }
          }
        }
      }
    }
  }
  .tabnum {
    font-size: 8px;
  }
  .event {
    height: 600px;
  }
}
</style>