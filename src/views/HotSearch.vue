<template>
  <div class="hotbox">
    <div class="title">热搜榜</div>
    <div class="hotdetial">
      <div
        class="hotedetialitem"
        v-for="(item, index) in hotDetail"
        :key="item.id"
        @click="toSearch(item.searchWord)"
      >
        <span class="itemlever">{{ index + 1 }}</span>
        <span class="itemname">{{ item.searchWord }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { _getHotDetail } from "../network/search";

export default {
  data() {
    return {
      hotDetail: [],
    };
  },
  methods: {
    // 搜索
    toSearch(val) {
      this.$router.push({
        path: "/search/searchConent",
        query: { val },
      });
    },
    // 获取热搜榜
    async getHotdetail() {
      let { data } = await _getHotDetail();
      if (data.code === 200) this.hotDetail = data.data;
    },
  },
  mounted() {
    this.getHotdetail();
  },
};
</script>

<style lang="less" scoped>
.hotbox {
  margin: 0 16px;
  .title {
    font-size: 14px;
    height: 54px;
    line-height: 54px;
  }
  .hotdetial {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .hotedetialitem {
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      .itemlever {
        color: #ccc;
        padding-right: 14px;
      }
      .itemname {
        color: #757575;
      }
      &:nth-of-type(-n + 3) {
        .itemlever {
          color: #ec4141;
        }
        .itemname {
          color: #000;
        }
      }
    }
  }
}
</style>