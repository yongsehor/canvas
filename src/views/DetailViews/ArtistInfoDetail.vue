<template>
  <div id="artist">
    <!-- 头部导航栏组件 -->
    <van-nav-bar
      :border="false"
      fixed
      class="navbar"
      :style="{ backgroundColor: bgColor }"
      @click-left="$router.go(-1)"
    >
      <template #left>
        <van-icon name="arrow-left" class="icon" :style="{ color: color }" />
        <div class="artist_name" :style="{ opacity: opacity }">
          {{ artist.name }}
        </div>
      </template>
      <template #right>
        <div class="my-icon icon" :style="{ color: color }">&#xe6f8;</div>
      </template>
    </van-nav-bar>
    <!-- 歌手信息卡 -->
    <div
      class="artistInfo"
      :style="{ backgroundImage: 'url(' + artist.cover + ')' }"
    >
      <div class="artist_card">
        <van-image :src="artist.cover" class="avatar" round fit="cover" />
        <div class="info">
          <div class="name">
            <div class="nickname">{{ artist.name }}</div>
            <van-image
              v-if="identify"
              class="indenfity"
              :src="identify.imageUrl"
            />
          </div>
          <div class="count" v-if="isIn">
            <div class="follow">
              <span class="num">{{ artist_profile.follows }} </span>关注
            </div>
            <div class="fans">
              <span class="num"
                >{{ artist_profile.followeds | formatNumber }} </span
              >粉丝
            </div>
            <div class="level">
              <span class="num">Lv {{ level }}</span>
            </div>
          </div>
          <div v-if="identify" class="dep">{{ identify.imageDesc }}</div>
        </div>
        <div class="btn">
          <div v-if="isIn">
            <div class="fo" v-if="artist_profile.followed">已关注</div>
            <div class="fo1" v-else>关注 +</div>
          </div>
          <div class="cloud">
            <div class="my-icon">&#xe622;</div>
            <div class="txt">云圈</div>
          </div>
          <div v-if="isIn" class="m my-icon">&#xe638;</div>
        </div>
      </div>
    </div>
    <!-- 标签页 -->
    <van-tabs
      v-model="active"
      class="tabs"
      background="#F5F5F5"
      color="#0078D7"
      sticky
      animated
      offset-top="46px"
    >
      <van-tab title="主页">
        <div class="tab_item">
          <div class="title">艺人百科</div>
          <div class="count_item">
            <div class="rank" v-if="rank">
              <div class="count">{{ rank.rank }}</div>
              <div class="type">
                <span v-if="rank.type == 1">华语榜排名</span>
                <span v-if="rank.type == 2">欧美榜排名</span>
                <span v-if="rank.type == 3">韩国榜排名</span>
                <span v-if="rank.type == 4">日本榜排名</span>
              </div>
            </div>
            <div class="rank" v-else>
              <div class="count">-</div>
              <div class="type">暂无</div>
            </div>
            <div class="read">
              <div class="count">59万</div>
              <div class="type">云圈阅读量</div>
            </div>
          </div>
          <div class="info">
            <div class="name">艺人名：{{ artist.name }}</div>
            <div class="sex" v-if="artist_profile.gender == 0">性别：保密</div>
            <div class="sex" v-else-if="artist_profile.gender == 1">
              性别：男
            </div>
            <div class="sex" v-else-if="artist_profile.gender == 2">
              性别：女
            </div>
            <div class="sex" v-else>性别：妹有数据QAQ自己想</div>
          </div>
          <div class="briefDesc" v-if="artist.briefDesc">
            歌手简介：{{ artist.briefDesc }}
          </div>
          <div class="briefDesc" v-if="isIn">
            个人简介：{{ artist_profile.signature }}
          </div>
        </div>
        <div class="simi">
          <div class="title">相似歌手</div>
          <div class="singers">
            <div class="singer" v-for="artist in simiArtists" :key="artist.id">
              <van-image class="avatar" round :src="artist.picUrl" />
              <div class="name van-ellipsis">{{ artist.name }}</div>
              <div class="fansCount">{{ artist.musicSize }} 首作品</div>
              <div class="fo_btn1" v-if="artist.followed">已关注</div>
              <div class="fo_btn" v-else>+ 关注</div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="歌曲">
        <div class="songList">
          <div class="title">
            <van-icon name="play-circle" class="title_icon" color="#1095C5" />
            <div class="t_txt">热门50首</div>
            <van-icon name="star-o" class="title_icon" />
            <van-icon name="wap-nav" class="title_icon" />
          </div>
          <div class="item" v-for="(song, index) in topSongs" :key="song.id">
            <div class="item_index">{{ index + 1 }}</div>
            <div class="item_txt">
              <div class="t_songname van-ellipsis">
                {{ song.name }}
                <span class="othername" v-if="song.tns">
                  ({{ song.tns[0] }})
                </span>
              </div>
              <div class="t_songby van-ellipsis">
                <span v-for="(ar, index) in song.ar" :key="index">
                  <span v-if="index === song.ar.length - 1">
                    {{ ar.name }}
                  </span>
                  <span v-else>{{ ar.name }} / </span>
                </span>
                -
                {{ song.al.name }}
              </div>
            </div>
            <van-icon
              class-prefix="my-icon"
              :class="{ item_icon: true, nomv: !song.mv }"
              name="mv"
            />
            <van-icon
              class-prefix="my-icon"
              class="item_icon"
              name="col_ellipsis"
            />
          </div>
          <div class="more">
            <div>全部歌曲</div>
            <van-icon name="arrow" class="more_icon" />
          </div>
        </div>
      </van-tab>
      <van-tab>
        <template #title>
          专辑 <span class="number">{{ artist.albumSize }}</span>
        </template>
        <div class="albumList">
          <div class="title">按发行时间排序</div>
          <van-list
            v-model="al_loading"
            :finished="al_finished"
            finished-text="没有更多了"
            @load="getAlbum(id)"
          >
            <div
              class="album_item"
              v-for="album in albums"
              :key="album.id"
              @click="toAlbumDetail(album.id)"
            >
              <div class="album_coverPic">
                <div class="bg"></div>
                <van-image :src="album.picUrl" />
              </div>
              <div class="album_info">
                <div class="album_name">{{ album.name }}</div>
                <div class="album_time">
                  {{ album.publishTime | formatDate(2) }} {{ album.size }}首
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab>
        <template #title>
          MV <span class="number">{{ artist.mvSize }}</span>
        </template>
        <van-list
          v-model="mv_loading"
          :finished="mv_finished"
          finished-text="没有更多了"
          @load="getMv(id)"
        >
          <div class="mvList">
            <div class="mv_item" v-for="(mv, index) in mvs" :key="index">
              <div class="mv_pic">
                <div class="bg">
                  <van-image class="image" fit="cover" :src="mv.imgurl16v9" />
                </div>
                <div class="pic">
                  <van-image class="image" :src="mv.imgurl16v9" />
                </div>
                <div class="mvicon">MV</div>
                <div class="time">{{ mv.duration | formatDuration }}</div>
              </div>
              <div class="mv_info">
                <div class="name van-multi-ellipsis--l2">{{ mv.name }}</div>
                <div class="playcount">
                  <span
                    ><span class="my-icon">&#xe6b3;</span
                    >{{ mv.playCount | formatNumber }}</span
                  >
                  <span class="pushtime">{{ mv.publishTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab v-if="isIn">
        <template #title>
          动态 <span class="number">{{ eventCount }}</span>
        </template>
        <event :uid="uid" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  _getArtistTopSongs,
  _getArtistDetail,
  _getSimiArtist,
  _getArtistAlbum,
  _getMv,
  _getEvent,
} from "../../network/artist";
import { _getUserDetail } from "../../network/getUserInfo";
import Event from "../../components/Event.vue";
export default {
  data() {
    return {
      // 导航栏的样式
      bgColor: "transparent",
      opacity: 0,
      color: "#fff",
      // tabs
      active: 0,
      //  歌手id
      id: this.$route.query.id,
      // 用户id（用于获取用户动态
      uid: 0,
      // 歌手信息
      artist: {},
      // 由于接口返回的歌手信息并不完善，所以再次请求了拥有网易云帐号的歌手的信息
      artist_profile: {},
      // 歌手等级
      level: 0,
      // 标识
      identify: "",
      // 热门50首
      topSongs: [],
      // 动态数量
      eventCount: 0,
      // 排名
      rank: {},
      // 是否在网易云有账号
      isIn: false,
      // 相似歌手列表
      simiArtists: [],
      // 专辑列表
      albums: [],
      al_loading: false,
      al_finished: false,
      al_page: 0,
      al_offset: 0,
      // mv列表
      mvs: [],
      mv_loading: false,
      mv_finished: false,
      mv_page: 0,
      mv_offset: 0,
    };
  },
  methods: {
    // 初始化页面
    init(id) {
      this.getTopSongs(id);
      this.getArtistDetail(id);
      this.getSimi(id);
    },
    // 获取歌手热门50首
    async getTopSongs(id) {
      let { data } = await _getArtistTopSongs(id);
      if (data.code === 200) this.topSongs = data.songs;
    },
    // 获取歌手详情
    async getArtistDetail(id) {
      let { data: res } = await _getArtistDetail(id);
      if (res.code === 200) {
        this.artist = res.data.artist;
        this.rank = res.data.artist.rank;
        this.eventCount = res.data.eventCount;
        if (res.data.identify) this.identify = res.data.identify;
        if (res.data.user) {
          this.isIn = true;
          let { data: user } = await _getUserDetail(res.data.user.userId);
          this.uid = user.profile.userId;
          this.level = user.level;
          this.artist_profile = user.profile;
        } else {
          this.isIn = false;
        }
      } else {
        return this.$msg.fail(res.message || res.msg);
      }
    },
    // 获取相似歌手
    async getSimi(id) {
      let { data } = await _getSimiArtist(id);
      if (data.code === 200) this.simiArtists = data.artists;
    },
    // 获取歌手专辑
    async getAlbum(id) {
      this.al_page++;
      this.al_offset = (this.al_page - 1) * 30;
      let { data } = await _getArtistAlbum(id, this.al_offset);
      if (data.code === 200) {
        for (let i = 0; i < data.hotAlbums.length; i++) {
          this.albums.push(data.hotAlbums[i]);
        }
        this.al_loading = false;
        if (data.hotAlbums.length < 30) this.al_finished = true;
      }
    },
    // 获取歌手mv
    async getMv(id) {
      this.mv_page++;
      this.mv_offset = (this.mv_page - 1) * 10;
      let { data } = await _getMv(id, this.mv_offset);
      if (data.code === 200) {
        for (let i = 0; i < data.mvs.length; i++) {
          this.mvs.push(data.mvs[i]);
        }
        this.mv_loading = false;
        if (data.mvs.length < 10) this.mv_finished = true;
      }
    },
    // 滑动动效
    _scroll() {
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop > 350) {
        this.bgColor = "#F5F5F5";
        this.opacity = 1;
        this.color = "#000";
      } else {
        this.bgColor = "transparent";
        this.opacity = 0;
        this.color = "#fff";
      }
    },
    // 跳转到专辑详情
    toAlbumDetail(id) {
      this.$router.push({ path: "/albumDetail", query: { id } });
    },
  },
  components: {
    Event,
  },
  mounted() {
    window.addEventListener("scroll", this._scroll);
    this.init(this.id);
  },
};
</script>

<style lang="less" scoped>
#artist {
  .navbar {
    // transition: all 0.3s ease-in-out;
    .artist_name {
      font-size: 16px;
      color: #000;
      margin-left: 10px;
    }
    .icon {
      font-size: 16px;
    }
  }
  .artistInfo {
    height: 400px;
    background-position: top;
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    .artist_card {
      width: 340px;
      // min-height: 180px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 56%;
      transform: translate(-50%, 0);
      border-radius: 15px;
      position: relative;
      .avatar {
        width: 70px;
        height: 70px;
        border: 4px solid #fff;
        position: absolute;
        left: 50%;
        top: -37px;
        transform: translate(-50%, 0);
      }
      .info {
        .name {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 50px;
          .nickname {
            font-size: 18px;
          }
          .indenfity {
            width: 15px;
            height: 15px;
            margin-left: 6px;
          }
        }
        .count {
          display: grid;
          height: 28px;
          line-height: 28px;
          grid-template-columns: repeat(3, 33.33%);
          text-align: center;
          font-size: 12px;
          color: #969799;
          .num {
            color: #000;
          }
        }
        .dep {
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          text-align: center;
          color: #969799;
        }
      }
      .btn {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        .fo {
          border-radius: 20px;
          height: 26px;
          line-height: 26px;
          width: 66px;
          font-size: 10px;
          background-color: #f2f2f2;
          color: #787878;
          text-align: center;
        }
        .fo1 {
          border-radius: 20px;
          height: 26px;
          width: 66px;
          font-size: 12px;
          background-color: #5282e7;
          color: #fff;
          line-height: 26px;
          text-align: center;
        }
        .cloud {
          margin: 0 8px;
          height: 26px;
          width: 66px;
          font-size: 10px;
          border-radius: 20px;
          border: 1px solid #cacaca;
          box-sizing: border-box;
          line-height: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          .my-icon {
            font-size: 16px;
            margin-right: 5px;
          }
        }
        .m {
          width: 26px;
          height: 26px;
          text-align: center;
          line-height: 28px;
          border-radius: 50%;
          border: 1px solid #ccc;
          font-size: 10px;
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
  .tabs {
    background-color: #f5f5f5;
    .number {
      font-size: 8px;
    }
  }
  .tab_item {
    margin: 20px auto;
    width: 340px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 20px;
    box-sizing: border-box;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
    .count_item {
      display: grid;
      height: 80px;
      grid-template-columns: repeat(2, 50%);
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #d5d5d5;
      .count {
        font-size: 18px;
      }
      .type {
        margin-top: 4px;
        font-size: 11px;
        color: #939393;
      }
    }
    .info {
      margin: 20px 0;
      > div {
        font-size: 12px;
        height: 30px;
        color: #7a7a7a;
        line-height: 30px;
      }
    }
    .briefDesc {
      font-size: 12px;
      color: #7a7a7a;
      line-height: 20px;
    }
  }
  .simi {
    margin: 30px auto;
    padding: 10px 10px;
    width: 340px;
    height: 184px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 10px;
    .title {
      height: 30px;
      line-height: 20px;
      font-size: 14px;
    }
    .singers {
      display: flex;
      align-items: center;
      overflow-x: auto;
      .singer {
        flex: 1;
        flex-basis: 96px;
        flex-shrink: 0;
        width: 96px;
        margin-left: 11px;
        padding: 10px 0;
        border-radius: 10px;
        background-color: rgba(220, 220, 220, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
        }
        .name,
        .fansCount {
          width: 90px;
          text-align: center;
          height: 20px;
          line-height: 20px;
        }
        .name {
          margin-top: 10px;
          font-size: 12px;
        }
        .fansCount {
          font-size: 10px;
          color: #6a6a6a;
        }
        .fo_btn {
          margin-top: 4px;
          border: 1px solid #5383e8;
          color: #5383e8;
          width: 56px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 10.6px;
        }
        .fo_btn1 {
          margin-top: 4px;
          border: 1px solid #c6c6c6;
          color: #545454;
          width: 56px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          border-radius: 15px;
          font-size: 10.6px;
        }
      }
    }
  }
  .songList {
    margin-top: 10px;
    .title {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .t_txt {
        width: 280px;
        font-size: 14px;
      }
      .title_icon {
        font-size: 18px;
        margin: 0 4px;
        color: #939393;
      }
    }
    .item {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-around;
      .item_index {
        width: 20px;
        font-size: 16px;
        color: #939393;
        text-align: center;
      }
      .item_txt {
        width: 270px;
        .t_songname {
          font-size: 14px;
          .othername {
            color: #939393;
          }
        }
        .t_songby {
          font-size: 11px;
          margin-top: 2px;
          color: #939393;
        }
      }
      .item_icon {
        font-size: 16px;
        color: #1499ee;
      }
      .nomv {
        color: rgba(147, 147, 147, 0.2);
      }
    }
    .more {
      height: 30px;
      font-size: 14px;
      color: #787878;
      display: flex;
      align-items: center;
      justify-content: center;
      .more_icon {
        margin-left: 10px;
      }
    }
  }
  .albumList {
    .title {
      height: 30px;
      font-size: 12px;
      line-height: 20px;
      padding-left: 10px;
    }
    .album_item {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: relative;
      .album_coverPic {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        overflow: hidden;
        .bg {
          width: 50px;
          height: 50px;
          background-color: #000;
          border-radius: 50%;
          position: absolute;
          top: 4px;
        }
      }
      .album_info {
        width: 300px;
        .album_name {
          font-size: 15px;
        }
        .album_time {
          font-size: 12px;
          color: #969799;
          margin-top: 4px;
        }
      }
    }
  }
  .mvList {
    border-radius: 10px;
    display: grid;
    grid-template-columns: repeat(2, 46%);
    justify-content: space-around;
    .mv_item {
      border-radius: 15px;
      overflow: hidden;
      margin: 10px 0;
    }
    .mv_pic {
      height: 200px;
      position: relative;
      .bg {
        .image {
          filter: blur(6px);
          height: 200px;
        }
      }
      .pic {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        overflow: hidden;
        width: 160px;
        .image {
          width: 160px;
        }
      }
      .mvicon {
        position: absolute;
        left: 50%;
        top: 6%;
        transform: translateX(-50%);
        background-color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        width: 40px;
        height: 20px;
        line-height: 20px;
        border-radius: 15px;
        font-weight: bold;
        text-align: center;
        color: rgba(78, 78, 78, 0.5);
      }
      .time {
        position: absolute;
        bottom: 4px;
        right: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    .mv_info {
      padding: 14px 10px;
      box-sizing: border-box;
      height: 80px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .name {
        height: 40px;
        font-size: 12px;
      }
      .playcount {
        padding-top: 6px;
        height: 16px;
        color: #969799;
        font-size: 9.6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .my-icon {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>