<template>
  <div>
    <van-tabs animated swipeable>
      <van-tab title="综 合">
        <composited :keyword="keyword" />
      </van-tab>
      <van-tab title="单 曲">
        <songs-search :keyword="keyword" />
      </van-tab>
      <van-tab title="歌 单">
        <playlist-search :keyword="keyword" />
      </van-tab>
      <van-tab title="专 辑">
        <album-search :keyword="keyword" />
      </van-tab>
      <van-tab title="歌 手">
        <artist-search :keyword="keyword" />
      </van-tab>
      <van-tab title="用 户">
        <user-search :keyword="keyword" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Composited from "../components/SearcConentComp/Composited.vue";
import SongsSearch from "../components/SearcConentComp/SongsSearch.vue";
import AlbumSearch from "../components/SearcConentComp/AlbumSearch.vue";
import PlaylistSearch from "../components/SearcConentComp/PlaylistSearch.vue";
import ArtistSearch from "../components/SearcConentComp/ArtistSearch.vue";
import UserSearch from "../components/SearcConentComp/UserSearch.vue";
import { _getSearchdata } from "../network/search";
export default {
  data() {
    return {
      keyword: this.$route.query.val,
    };
  },
  methods: {},
  components: {
    Composited,
    SongsSearch,
    AlbumSearch,
    PlaylistSearch,
    ArtistSearch,
    UserSearch,
  },
  mounted() {
    this.$emit("backKeyw", this.keyword);
  },
};
</script>

<style lang="less" scoped>
</style>