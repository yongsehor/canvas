<template>
  <div id="artist">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getArtistsSearch(key)"
    >
      <div
        class="ar_item"
        v-for="(artist, index) in artists"
        :key="index"
        @click="toArtistDetail(artist.id)"
      >
        <div class="ar_avatar">
          <van-image :src="artist.img1v1Url" round fit="cover" class="pic" />
        </div>
        <div class="ar_name van-ellipsis">
          {{ artist.name }}
          <span v-if="artist.alia" class="name">( {{ artist.alia[0] }} )</span>
          <span v-else-if="artist.trans" class="name"
            >( {{ artist.trans }} )</span
          >
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
      artists: [],
      finished: false,
      loading: false,
      page: 0,
      offset: 0,
    };
  },
  props: ["keyword"],
  methods: {
    async getArtistsSearch(key) {
      this.page++;
      this.offset = (this.page - 1) * 30;
      let { data } = await _getSearchdata(key, 100, this.offset);
      if (data.code === 200) {
        for (let i = 0; i < data.result.artists.length; i++) {
          this.artists.push(data.result.artists[i]);
        }
        this.loading = false;
        if (data.result.artists.length < 30) this.finished = true;
      } else {
        console.log(data);
      }
    },
    toArtistDetail(id) {
      this.$router.push({ path: "/artist", query: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
#artist {
  width: 100%;
  background-color: #fff;
  height: 520px;
  overflow: scroll;
  .ar_item {
    height: 60px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    .ar_avatar {
      margin-left: 10px;
      width: 46px;
      height: 46px;
      .pic {
        width: 46px;
        height: 46px;
      }
    }
    .ar_name {
      width: 240px;
      margin-left: 10px;
      font-size: 15px;
      .name {
        color: #969799;
        margin-left: 4px;
      }
    }
  }
}
</style>