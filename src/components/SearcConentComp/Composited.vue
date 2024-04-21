<template>
  <div class="content">
    <!-- 单曲 -->
    <div class="list_div">
      <div class="s_title">单曲</div>
      <van-empty
        image="error"
        description="暂无相关的任何单曲"
        v-if="!song.songs"
      />
      <div class="songList" v-else>
        <div class="sl_item" v-for="item in song.songs" :key="item.id">
          <div class="info">
            <div class="name van-ellipsis">{{ item.name }}</div>
            <div class="by van-ellipsis">
              <span v-for="(ar, index) in item.ar" :key="index">
                <span v-if="index === item.ar.length - 1"> {{ ar.name }} </span>
                <span v-else>{{ ar.name }} / </span>
              </span>
              <span v-if="item.al.name"> - {{ item.al.name }}</span>
            </div>
          </div>
          <van-icon
            class-prefix="my-icon"
            name="col_ellipsis"
            class="ellipsis_icon"
          />
        </div>
      </div>
      <div class="s_more" v-if="song.more">
        {{ song.moreText }}
      </div>
    </div>
    <!-- 专辑 -->
    <div class="list_div">
      <div class="s_title">专辑</div>
      <van-empty
        image="error"
        description="暂无相关的任何专辑"
        v-if="!album.albums"
      />
      <div class="albumList" v-else>
        <div
          class="a_listitem"
          v-for="(item, index) in album.albums"
          :key="index"
          @click="toAlbumDetail(item.id)"
        >
          <van-image class="a_listImg" :src="item.picUrl" />
          <div class="a_listText">
            <div class="a_listName van-ellipsis">{{ item.name }}</div>
            <div class="a_listbyandtime">
              {{ item.artist.name }} {{ item.publishTime | formatDate(2) }}
            </div>
          </div>
        </div>
      </div>
      <div class="s_more" v-if="album.more">
        {{ album.moreText }}
      </div>
    </div>
    <!-- 歌单 -->
    <div class="list_div">
      <div class="s_title">歌单</div>
      <van-empty
        image="error"
        description="暂无相关的任何歌单"
        v-if="!playList.playLists"
      />
      <div class="playList" v-else>
        <div
          class="p_listitem"
          v-for="(item, index) in playList.playLists"
          :key="index"
          @click="toPlayListDetail(item.id)"
        >
          <van-image class="playListIMg" :src="item.coverImgUrl" />
          <div class="playListText">
            <div class="plt_name van-ellipsis">{{ item.name }}</div>
            <div class="plt_sm van-ellipsis">
              {{ item.trackCount }}首
              <span v-if="item.creator">by {{ item.creator.nickname }}</span>
              播放{{ item.playCount | formatNumber }}次
            </div>
          </div>
        </div>
      </div>
      <div class="s_more" v-if="playList.more">
        {{ playList.moreText }}
      </div>
    </div>
    <!-- 歌手 -->
    <div class="list_div">
      <div class="s_title">歌手</div>
      <van-empty
        image="error"
        description="暂无相关的任何歌手"
        v-if="!artist.artists"
      />
      <div class="singerList" v-else>
        <div
          class="s_listitem"
          v-for="(item, index) in artist.artists"
          :key="index"
          @click="toArtistDetail(item.id)"
        >
          <van-image
            :src="item.picUrl"
            class="s_listitemImg"
            round
            fit="cover"
          />
          <div class="s_listitemName van-ellipsis">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="s_more" v-if="artist.more">
        {{ artist.moreText }}
      </div>
    </div>
    <!-- 用户 -->
    <div class="list_div">
      <div class="s_title">用户</div>
      <van-empty
        image="error"
        description="暂无相关的任何用户"
        v-if="!user.users"
      />
      <div class="usersList" v-else>
        <div
          class="user_item"
          v-for="(item, index) in user.users"
          :key="index"
          @click="toUserInfoDetailPage(item.userId)"
        >
          <van-image :src="item.avatarUrl" class="userimg" round fit="cover" />
          <div class="userInfo">
            <div class="username van-ellipsis">
              {{ item.nickname }}
              <van-icon
                class-prefix="my-icon"
                v-if="item.gender == 1"
                color="blue"
                name="man"
              />
              <van-icon
                class-prefix="my-icon"
                v-else
                color="pink"
                name="women"
              />
            </div>
            <div class="userjianjie van-ellipsis">{{ item.signature }}</div>
          </div>
        </div>
      </div>
      <van-cell :value="user.moreText" value-class="s_more" v-if="user.more" />
    </div>
    <!-- 视频 -->
    <div class="list_div">
      <div class="s_title">视频</div>
      <van-empty
        image="error"
        description="暂无相关的任何视频"
        v-if="!video.videos"
      />
      <div class="videoList" v-else>
        <div
          class="videoItem"
          v-for="(item, index) in video.videos"
          :key="index"
        >
          <van-image :src="item.coverUrl" fit="cover" class="v_img">
            <van-icon name="play" class="icon" />
          </van-image>
          <div class="v_text">
            <div class="v_name van-ellipsis">{{ item.title }}</div>
            <div class="v_content van-ellipsis">
              {{ item.durationms | formatDuration }} | by
              {{ item.creator[0].userName }} |
              {{ item.playTime | formatNumber }}次播放
            </div>
          </div>
        </div>
      </div>
      <div class="s_more" v-if="video.more">
        {{ video.moreText }}
      </div>
    </div>
  </div>
</template>

<script>
import { _getSearchdata } from "../../network/search";

export default {
  props: ["keyword"],
  data() {
    return {
      song: {},
      album: {},
      playList: {},
      artist: {},
      user: {},
      video: {},
    };
  },
  methods: {
    // 获取 <综合> 里面的数据
    async getCompositedata(keywords, type) {
      let { data: res } = await _getSearchdata(keywords, type);
      if (res.code === 200) {
        let data = res.result;
        if (data.song) this.song = data.song;
        if (data.album) this.album = data.album;
        if (data.playList) this.playList = data.playList;
        if (data.artist) this.artist = data.artist;
        if (data.user) this.user = data.user;
        if (data.video) this.video = data.video;
      } else {
        console.log(res);
      }
    },
    // 跳转歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
    toAlbumDetail(id) {
      this.$router.push({ path: "/albumDetail", query: { id } });
    },
    toArtistDetail(id) {
      this.$router.push({ path: "/artist", query: { id } });
    },
    // 跳转用户详情页
    toUserInfoDetailPage(id) {
      this.$router.push({ path: "/userinfo", query: { id } });
    },
  },
  mounted() {
    this.getCompositedata(this.keyword, "1018");
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 512px;
  overflow: scroll;
  .list_div {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 10px;
    .s_title {
      font-size: 14px;
      height: 42px;
      line-height: 42px;
      padding-left: 20px;
      letter-spacing: 5px;
      font-weight: 500;
      border-bottom: 1px solid #e9e9e9;
    }
    .s_more {
      font-size: 12px;
      text-align: center;
      color: #a4a2a2;
      height: 44px;
      line-height: 44px;
    }

    .songList {
      .sl_item {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid #e9e9e9;
        .info {
          width: 280px;
          .name {
            font-size: 13px;
          }
          .by {
            color: #939393;
            font-size: 10px;
            margin-top: 6px;
          }
        }
        .ellipsis_icon {
          color: #939393;
          font-size: 16px;
        }
      }
    }

    .playList {
      .p_listitem {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        .playListIMg {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          overflow: hidden;
        }
        .playListText {
          width: 240px;
          margin-left: 12px;
          .plt_name {
            font-size: 13px;
          }
          .plt_sm {
            margin-top: 4px;
            color: #757575;
            font-size: 10px;
          }
        }
      }
    }

    .albumList {
      .a_listitem {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        .a_listImg {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          overflow: hidden;
        }
        .a_listText {
          width: 240px;
          margin-left: 13px;
          .a_listName {
            font-size: 14px;
          }
          .a_listbyandtime {
            margin-top: 6px;
            font-size: 10px;
            color: #757575;
          }
        }
      }
    }

    .singerList {
      .s_listitem {
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        .s_listitemImg {
          width: 46px;
          height: 46px;
        }
        .s_listitemName {
          width: 240px;
          font-size: 14px;
          margin-left: 12px;
        }
      }
    }

    .usersList {
      .user_item {
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        .userimg {
          width: 46px;
          height: 46px;
        }
        .userInfo {
          width: 260px;
          margin-left: 12px;
          .username {
            font-size: 14px;
            .my-icon {
              font-size: 16px;
            }
          }
          .userjianjie {
            margin-top: 4px;
            font-size: 10px;
            color: #a4a2a2;
          }
        }
      }
    }

    .videoList {
      .videoItem {
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        .v_img {
          position: relative;
          width: 80px;
          height: 45px;
          border-radius: 5px;
          overflow: hidden;
          .icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.8);
            top: 50%;
            left: 50%;
            font-size: 32px;
            transform: translate(-50%, -50%);
          }
        }
        .v_text {
          width: 230px;
          margin-left: 10px;
          .v_name {
            font-size: 14px;
            color: #2c2c2c;
          }
          .v_content {
            margin-top: 4px;
            color: #757575;
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>