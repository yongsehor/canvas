<template>
  <div id="playlist">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getPlaylistsSearch(key)"
    >
      <div
        class="playlist_item"
        v-for="(playlist, index) in playlists"
        :key="index"
        @click="toPlayListDetail(playlist.id)"
      >
        <van-image class="i_pic" :src="playlist.coverImgUrl" />
        <div class="i_info">
          <div class="name van-ellipsis">
            {{ playlist.name }}
          </div>
          <div class="count van-ellipsis">
            {{ playlist.trackCount }}首
            <span v-if="playlist.creator">
              by {{ playlist.creator.nickname }}
            </span>
            播放{{ playlist.playCount | formatNumber }}次
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { _getSearchdata } from "../../network/search";
export default {
  data() {
    return {
      key: this.keyword,
      playlists: [],
      finished: false,
      loading: false,
      page: 0,
      offset: 0,
    };
  },
  methods: {
    async getPlaylistsSearch(key) {
      this.page++;
      this.offset = (this.page - 1) * 30;
      let { data } = await _getSearchdata(key, 1000, this.offset);
      if (data.code === 200) {
        for (let i = 0; i < data.result.playlists.length; i++) {
          this.playlists.push(data.result.playlists[i]);
        }
        this.loading = false;
        if (data.result.playlists.length < 30) this.finished = true;
      } else {
        console.log(data);
      }
    },
    // 跳转歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
  },
  props: ["keyword"],
  mounted() {},
};
</script>

<style lang="less" scoped>
#playlist {
  width: 100%;
  background-color: #fff;
  height: 520px;
  overflow: scroll;
  .playlist_item {
    height: 60px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .i_pic {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      overflow: hidden;
    }
    .i_info {
      width: 300px;
      .name {
        font-size: 14px;
      }
      .count {
        margin-top: 3px;
        font-size: 10.6px;
        color: #969799;
      }
    }
  }
}
</style>