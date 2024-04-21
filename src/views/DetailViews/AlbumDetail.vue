<template>
  <div id="albumDetail">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      class="navbar"
      @click-left="$router.go(-1)"
    >
      <template #left>
        <van-icon name="arrow-left" size="1.4em" />
        <span class="title">专辑</span>
      </template>
      <template #right>
        <div class="menu">
          <div class="my-icon">&#xe6f8;</div>
        </div>
      </template>
    </van-nav-bar>
    <!-- 头部区域内容 -->
    <div class="headerBox">
      <!-- 上半区域 信息 -->
      <div class="box_top">
        <div class="headerbox_Pic">
          <div class="bg"></div>
          <van-image :src="album.picUrl" />
        </div>
        <div class="headerbox_txt">
          <div class="album_name van-ellipsis">{{ album.name }}</div>
          <div class="album_singer" @click="singersShow = true">
            <div class="name van-ellipsis">
              歌手：
              <span v-for="(ar, index) in album.artists" :key="ar.id">
                <span v-if="index === album.artists.length - 1">
                  {{ ar.name }}
                </span>
                <span v-else> {{ ar.name }} / </span>
              </span>
            </div>
            <van-icon name="arrow" class="icon" />
          </div>
          <div class="album_time">
            发行时间：{{ album.publishTime | formatDate(2) }}
          </div>
          <div
            class="album_dep"
            v-if="album.description"
            @click="overlayshow = true"
          >
            <div class="van-ellipsis dep">
              {{ album.description }}
            </div>
            <van-icon name="arrow" class="icon" />
          </div>
          <div class="album_dep" v-else>
            <div class="van-ellipsis dep">暂无</div>
          </div>
        </div>
      </div>
      <!-- 下半区域 功能菜单 -->
      <div class="box_bottom">
        <div
          :class="{ item_div: true, subActive: isSub }"
          @click="subAlbum(id, isSub ? 0 : 1)"
        >
          <van-icon name="star-o" class="b_m_icon" />
          <div class="num" v-if="subCount == 0">收藏</div>
          <div class="num" v-else>{{ subCount | formatNumber }}</div>
        </div>
        <div class="item_div comment" @click="$store.commit('showPopup')">
          <van-icon
            class-prefix="my-icon"
            name="comment_noline"
            class="b_m_icon"
          />
          <div class="num" v-if="commentCount == 0">评论</div>
          <div class="num" v-else>{{ commentCount | formatNumber }}</div>
        </div>
        <div class="item_div share">
          <van-icon class-prefix="my-icon" name="share" class="b_m_icon" />
          <div class="num" v-if="shareCount == 0">分享</div>
          <div class="num" v-else>{{ shareCount | formatNumber }}</div>
        </div>
      </div>
    </div>
    <!-- 歌单列表区域 -->
    <div class="songList">
      <div class="song_item">
        <div class="sl_title">
          <div class="t_text">
            <van-icon name="play-circle" class="playAllicon" />播放全部
            <span class="length">( {{ songs.length }}首 )</span>
          </div>
          <div class="t_othericon">
            <van-icon class="oIcon" class-prefix="my-icon" name="download" />
            <van-icon class="oIcon" name="add-o" />
          </div>
        </div>
        <div class="sl_content">
          <div class="sl_item" v-for="(song, index) in songs" :key="song.id">
            <div class="item_index">{{ index + 1 }}</div>
            <div class="item_txt">
              <div class="t_songname van-ellipsis">
                {{ song.name }}
                <span class="othername" v-if="song.tns"
                  >({{ song.tns[0] }})</span
                >
              </div>
              <div class="t_songby van-ellipsis">
                <span v-for="(ar, index) in song.ar" :key="ar.id">
                  <span v-if="index === song.ar.length - 1">
                    {{ ar.name }}
                  </span>
                  <span v-else>{{ ar.name }} / </span>
                </span>
              </div>
            </div>
            <van-icon
              class-prefix="my-icon"
              :class="{ item_icon: true, notmv: !song.mv }"
              name="mv"
            />
            <van-icon
              class-prefix="my-icon"
              class="item_icon"
              name="col_ellipsis"
            />
          </div>
        </div>
      </div>
    </div>
    <br />
    <!-- 歌手列表层 -->
    <van-popup v-model="singersShow" class="singers">
      <div class="singer_item" v-for="artist in artists" :key="artist.id">
        <van-image :src="artist.picUrl" class="avatar" fit="cover" />
        <div class="name">{{ artist.name }}</div>
      </div>
    </van-popup>
    <!-- 歌单简介详情遮罩层 -->
    <van-overlay :show="overlayshow" @click="overlayshow = false">
      <div class="wrapper">
        <div class="block">
          <van-image class="pic" :src="album.picUrl" />
          <div class="name">{{ album.name }}</div>
          <div class="type" v-if="album.subType">
            专辑类别：{{ album.subType }}
          </div>
          <div class="by" v-if="album.company">
            发行公司：{{ album.company }}
          </div>
          <div class="description">
            {{ album.description }}
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 评论详情组件 -->
    <van-popup v-model="$store.state.isPopup" position="bottom">
      <comment-detial
        :parentId="id"
        :toCommentinfos="toCommentinfos"
        :type="3"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  _albumSub,
  _getAlbum,
  _getAlbumDetailDynamic,
} from "../../network/album";
import CommentDetial from "../../components/Detial/CommentDetial";
export default {
  data() {
    return {
      overlayshow: false,
      singersShow: false,
      id: this.$route.query.id,
      // 歌曲列表
      songs: [],
      // 歌手列表
      artists: [],
      // 专辑信息
      album: {},
      // 收藏数
      subCount: 0,
      // 评论数
      commentCount: 0,
      // 分享数
      shareCount: 0,
      // 是否收藏
      isSub: false,
      // 在评论页显示的头部信息
      toCommentinfos: {},
    };
  },
  components: {
    CommentDetial,
  },
  methods: {
    //   初始化页面
    init(id) {
      this.getAlbum(id);
      this.getAlbumDynamic(id);
    },
    // 获取专辑内容
    async getAlbum(id) {
      let { data } = await _getAlbum(id);
      if (data.code === 200) {
        // 保存专辑信息
        this.album = data.album;
        // 保存歌曲列表
        this.songs = data.songs;
        // 保存歌手列表
        this.artists = data.album.artists;
        // 保存发送给评论详情组件的部分信息
        this.toCommentinfos = {
          name: data.album.name,
          coverImgUrl: data.album.picUrl,
          artists: data.album.artists,
        };
      } else {
        console.log(data);
      }
    },
    // 获取专辑动态内容
    async getAlbumDynamic(id) {
      let { data } = await _getAlbumDetailDynamic(id);
      if (data.code === 200) {
        this.commentCount = data.commentCount;
        this.subCount = data.subCount;
        this.shareCount = data.shareCount;
        this.isSub = data.isSub;
      }
    },
    // 收藏 / 取消收藏
    async subAlbum(id, t) {
      let { data } = await _albumSub(id, t);
      if (data.code === 200) {
        if (t === 1) {
          this.$msg.success("收藏成功，请前往我的-收藏和赞中查看");
        } else {
          this.$msg.success("取消收藏成功");
        }
        this.getAlbumDynamic(id);
      }
    },
  },
  mounted() {
    this.init(this.id);
  },
};
</script>

<style lang="less" scoped>
#albumDetail {
  .navbar {
    background-image: linear-gradient(
      111.3deg,
      rgba(74, 105, 187, 1) 9.6%,
      rgba(205, 77, 204, 1) 93.6%
    );
    .title {
      padding-left: 6px;
      font-size: 16px;
      color: #fff;
    }
    .menu {
      color: #fff;
      font-size: 18px;
    }
  }
  .headerBox {
    margin-top: 46px;
    position: relative;
    background-image: linear-gradient(
      111.3deg,
      rgba(74, 105, 187, 1) 9.6%,
      rgba(205, 77, 204, 1) 93.6%
    );
    .box_top {
      height: 180px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20px 10px;
      position: relative;
      .headerbox_Pic {
        width: 110px;
        height: 110px;
        border-radius: 15px;
        overflow: hidden;
        .bg {
          position: absolute;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background-color: #000;
          top: 20px;
        }
      }
      .headerbox_txt {
        width: 210px;
        .album_name {
          font-size: 16px;
          color: #fff;
        }
        .album_singer {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 14px 0;
          display: flex;
          align-items: center;
          width: 100%;
          height: 20px;
          .name {
            width: 200px;
          }
          .icon {
            margin-top: 4px;
            font-size: 12px;
          }
        }
        .album_time,
        .album_dep {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        }
        .album_dep {
          margin-top: 6px;
          display: flex;
          height: 20px;
          align-items: center;
          width: 100%;
          .dep {
            width: 140px;
          }
          .icon {
            font-size: 14px;
            margin-top: 4px;
            margin-left: 60px;
          }
        }
      }
    }
    .box_bottom {
      background-color: #fff;
      height: 40px;
      width: 70%;
      border-radius: 20px;
      box-shadow: 2px 2px 6px #ccc;
      position: absolute;
      top: 88%;
      left: 50%;
      transform: translate(-50%, -0);
      display: grid;
      grid-template-columns: repeat(3, 33.33%);
      align-items: center;
      .item_div {
        height: 24px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:nth-child(-n + 2) {
          border-right: 2px solid #ccc;
        }
        .b_m_icon {
          font-size: 18px;
          margin-right: 4px;
        }
        .num {
          font-size: 12px;
        }
      }
      .subActive {
        color: blue;
      }
    }
  }
  .songList {
    padding-top: 40px;
    background-color: #fff;
    .sl_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      .t_text {
        margin-left: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        .length {
          font-size: 12px;
          margin-left: 10px;
          color: #939393;
        }
        .playAllicon {
          font-size: 16px;
          color: #4a69bb;
          margin-right: 12px;
        }
      }
      .t_othericon {
        margin-right: 10px;
        display: flex;
        font-size: 16px;
        height: 20px;
        line-height: 20px;
        > .oIcon {
          margin: 0 6px;
        }
      }
    }
    .sl_content {
      .sl_item {
        display: flex;
        height: 50px;
        align-items: center;
        justify-content: space-around;
        .item_index {
          text-align: center;
          width: 20px;
          font-size: 14px;
          color: #939393;
        }
        .item_txt {
          width: 264px;
          .t_songname {
            font-size: 14px;
            .othername {
              color: #939393;
            }
          }
          .t_songby {
            font-size: 11px;
            margin-top: 3px;
            color: #939393;
          }
        }
        .item_icon {
          font-size: 14px;
          color: #1499ee;
        }
        .notmv {
          color: #e7e7e7;
        }
      }
    }
  }
  .singers {
    width: 260px;
    height: 90%;
    .singer_item {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      .avatar {
        width: 46px;
        height: 46px;
        margin-left: 10px;
        overflow: hidden;
      }
      .name {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
  .wrapper {
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      circle 757px at 14.6% 44.8%,
      rgba(60, 77, 115, 1) 27.7%,
      rgba(0, 194, 209, 1) 95.9%
    );
    display: flex;
    position: relative;
    .block {
      margin-top: 20%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20px;
      .pic {
        width: 160px;
        height: 160px;
        border-radius: 20px;
        overflow: hidden;
      }
      .name {
        color: #fff;
        font-size: 16px;
        margin-top: 20px;
      }
      .type,
      .by,
      .description {
        width: 100%;
        text-align: left;
        font-size: 12.6px;
        color: rgba(255, 255, 255, 0.7);
      }
      .description {
        margin-top: 10px;
        height: 260px;
        overflow: scroll;
        white-space: pre-line;
      }
      .type {
        margin: 40px 0 10px;
      }
      .by {
        margin-bottom: 4px;
      }
    }
  }
}
</style>