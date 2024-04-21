<template>
  <div id="daliyrecom">
    <!-- 头部组件 -->
    <van-nav-bar
      fixed
      :border="false"
      :class="{ navbar: !isScroll, navbar_scroll: isScroll }"
    >
      <template #left>
        <van-icon name="arrow-left" class="icon" @click="$router.go(-1)" />
      </template>
      <template #title>
        <span class="title">每 日 推 荐</span>
      </template>
    </van-nav-bar>
    <div class="headerBox">
      <div class="date">{{ today }}</div>
      <div class="history">历史日推</div>
    </div>
    <div class="playall" @click="playAll(songidlist)">
      <van-icon class="icon" name="play-circle" />
      <span class="txt">播放全部</span>
    </div>
    <div class="songList">
      <div
        class="songItem"
        v-for="item in dailySongs"
        :key="item.id"
        @click="playThisMusic(item.id)"
      >
        <van-image :src="item.al.picUrl" fit="cover" class="pic" />
        <div class="info">
          <div class="title">
            <div class="name van-ellipsis">
              {{ item.name }}
              <span class="otherName" v-if="item.alia[0]">
                ({{ item.alia[0] }})
              </span>
            </div>
            <div class="reason van-ellipsis">
              {{ reasonMsg(item.id) }}
            </div>
          </div>
          <div class="artists van-ellipsis">
            <span class="artist" v-for="(ar, index) in item.ar" :key="index">
              <span v-if="index === item.ar.length - 1"> {{ ar.name }} </span>
              <span v-else> {{ ar.name }} / </span>
            </span>
            <span class="by"> - {{ item.al.name }} </span>
          </div>
        </div>
        <van-icon
          class-prefix="my-icon"
          :class="{ icon: true, notmv: !item.mv }"
          name="mv"
        />
        <van-icon class-prefix="my-icon" class="icon" name="col_ellipsis" />
      </div>
    </div>
    <!-- 加载组件 -->
    <loading />
  </div>
</template>

<script>
import { _getDailyRecom } from "../network/index.js";

export default {
  data() {
    return {
      isScroll: false,
      // 日推歌曲列表
      dailySongs: [],
      // 推荐理由列表
      recommendReasons: [],
      // 当前歌单的id列表
      songidlist: [],
    };
  },
  methods: {
    // 播放音乐
    playThisMusic(id) {
      this.$bus.$emit("playThisMusic", id);
    },
    playAll(ids) {
      this.$bus.$emit("playAll", ids);
    },
    async getDailyRecomSong() {
      this.$store.commit("showLoading");
      // 获取每日推荐歌曲
      let { data: res } = await _getDailyRecom();
      if (res.code === 200) {
        // 保存歌曲列表
        this.dailySongs = res.data.dailySongs;
        // 保存推荐理由列表
        this.recommendReasons = res.data.recommendReasons;
        // 保存日推歌单的id列表
        for (let i = 0; i < res.data.dailySongs.length; i++) {
          this.songidlist.push(res.data.dailySongs[i].id);
        }
      }

      this.$store.commit("hiddenLoading");
    },
    // 将推荐理由和歌曲匹配起来
    reasonMsg(id) {
      for (let i = 0; i < this.recommendReasons.length; i++) {
        if (this.recommendReasons[i].songId === id)
          return this.recommendReasons[i].reason;
      }
    },
    topNavigationChange() {
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop > 200) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    },
  },
  computed: {
    today: function () {
      let D = new Date();
      let m = D.getMonth() + 1;
      let d = D.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return `Day${d}/Mouth${m}`;
    },
  },
  mounted() {
    this.getDailyRecomSong();
    window.addEventListener("scroll", this.topNavigationChange);
  },
};
</script>

<style lang="less" scoped>
#daliyrecom {
  background-color: #fff;
  .navbar {
    background-color: transparent;
    .icon {
      font-size: 20px;
      margin-left: -6px;
    }
    .title {
      display: none;
    }
  }
  .navbar_scroll {
    background-image: linear-gradient(
      67.2deg,
      rgba(37, 208, 199, 1) -7.5%,
      rgba(165, 90, 240, 1) 62.7%
    );
    .icon {
      font-size: 20px;
      margin-left: -6px;
    }
    .title {
      display: block;
    }
  }
  .headerBox {
    height: 180px;
    background-image: linear-gradient(
      67.2deg,
      rgba(37, 208, 199, 1) -7.5%,
      rgba(165, 90, 240, 1) 62.7%
    );
    position: relative;
    color: #fff;
    .date {
      position: absolute;
      font-family: Verdana;
      font-size: 20px;
      bottom: 60px;
      left: 10px;
    }
    .history {
      position: absolute;
      bottom: 20px;
      left: 10px;
      font-size: 10px;
      width: 60px;
      height: 24px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      text-align: center;
      line-height: 24px;
    }
  }
  .playall {
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    margin-left: 5px;
    position: sticky;
    top: 46px;
    z-index: 2;
    .icon {
      font-size: 20px;
      color: #1499ee;
    }
    .txt {
      font-size: 14px;
      margin-left: 6px;
    }
  }
  .songList {
    .songItem {
      height: 60px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .pic {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
      }
      .info {
        .title {
          width: 250px;
          display: flex;
          .name {
            width: 200px;
            font-size: 14px;
            .otherName {
              color: #939393;
            }
          }
          .reason {
            margin-top: 3px;
            height: 14px;
            max-width: 50px;
            line-height: 14px;
            font-size: 10px;
            background-color: #fffcd7;
            color: #ceb45e;
          }
        }
        .artists {
          margin-top: 2px;
          width: 260px;
          font-size: 10px;
          color: #939393;
        }
      }
      .icon {
        font-size: 14px;
        color: #1499ee;
      }
      .notmv {
        color: rgba(147, 147, 147, 0.4);
      }
    }
  }
}
</style>