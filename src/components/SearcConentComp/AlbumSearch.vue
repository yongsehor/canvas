<template>
  <div id="album">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getAlbumsSearch(key)"
    >
      <div
        class="album_item"
        v-for="(album, index) in albums"
        :key="index"
        @click="toAlbumDetail(album.id)"
      >
        <div class="album_pic">
          <div class="bg"></div>
          <van-image :src="album.picUrl" />
        </div>
        <div class="album_info">
          <div class="album_name van-ellipsis">{{ album.name }}</div>
          <div class="album_by van-ellipsis">
            <span v-for="(ar, index) in album.artists" :key="ar.id">
              <span v-if="index === album.artists.length - 1">
                {{ ar.name }}
              </span>
              <span v-else>{{ ar.name }} / </span>
            </span>
            {{ album.publishTime | formatDate(2) }}
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
      albums: [],
      finished: false,
      loading: false,
      page: 0,
      offset: 0,
    };
  },
  props: ["keyword"],
  methods: {
    async getAlbumsSearch(key) {
      this.page++;
      this.offset = (this.page - 1) * 30;
      let { data } = await _getSearchdata(key, 10, this.offset);
      if (data.code === 200) {
        for (let i = 0; i < data.result.albums.length; i++) {
          this.albums.push(data.result.albums[i]);
        }
        this.loading = false;
        if (data.result.albums.length < 30) this.finished = true;
      } else {
        console.log(data);
      }
    },
    toAlbumDetail(id) {
      this.$router.push({ path: "/albumDetail", query: { id } });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
#album {
  width: 100%;
  background-color: #fff;
  height: 520px;
  overflow: scroll;
  .album_item {
    margin-top: 6px;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 4px;
    position: relative;
    .album_pic {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      overflow: hidden;
      margin-left: 10px;
      .bg {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #000;
        position: absolute;
        top: -0.5px;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
    .album_info {
      width: 260px;
      padding-left: 10px;
      .album_name {
        font-size: 13.6px;
      }
      .album_by {
        color: #969799;
        margin-top: 6px;
        font-size: 10px;
      }
    }
  }
}
</style>