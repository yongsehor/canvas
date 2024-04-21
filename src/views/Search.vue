<template>
  <div id="search">
    <van-search
      v-model="searchValue"
      shape="round"
      background="#ec4141"
      :placeholder="defultWorldObj.showKeyword"
      @input="SearchMsgBoxAndContentShow"
      @search="toSearchInput(searchValue)"
      show-action
    >
      <template #action>
        <span @click="toSearchInput(searchValue)">搜索</span>
        <span @click="goBack" class="back">返回</span>
      </template>
    </van-search>

    <router-view :key="$route.fullPath" @backKeyw="getBackKeyw" />

    <transition name="van-fade">
      <div v-show="isShowMsgBox" class="searchMsgBox">
        <div
          class="searchtitle van-ellipsis"
          @click="toSuggestSearch(searchValue)"
        >
          搜索 “{{ searchValue }}”
        </div>
        <div
          class="searchItem"
          v-for="(item, index) in searchSuggest"
          :key="index"
          @click="toSuggestSearch(item.keyword)"
        >
          <van-icon name="search" class="sIcon" />
          <span class="van-ellipsis">{{ item.keyword }}</span>
        </div>
      </div>
    </transition>
    <!-- 底部导航栏 -->
    <tab-bar />
  </div>
</template>

<script>
import TabBar from "../components/TabBar.vue";
import { _getDefaultHotKey, _getSuggestSearch } from "../network/search";
export default {
  data() {
    return {
      searchValue: "",
      defultWorldObj: {},
      searchSuggest: [],
      isShowMsgBox: false,
    };
  },
  components: {
    TabBar,
  },
  methods: {
    // 取到搜索的关键词
    getBackKeyw(data) {
      this.searchValue = data;
    },
    // 搜索核心方法
    toSearch(val) {
      this.$router.push({
        path: "/search/searchConent",
        query: { val },
      });
    },
    // 表单直接搜索
    toSearchInput(searchValue) {
      if (searchValue == "") {
        this.toSearch(this.defultWorldObj.realkeyword);
      } else {
        this.toSearch(searchValue);
      }
      this.isShowMsgBox = false;
    },
    // 推荐搜索选项卡搜索
    toSuggestSearch(v) {
      this.toSearchInput(v);
    },
    // 返回按钮
    goBack() {
      this.$router.go(-1);
      this.searchValue = "";
    },
    // 控制搜索框的显示和隐藏
    SearchMsgBoxAndContentShow() {
      if (this.searchValue != "") {
        this.isShowMsgBox = true;
      } else {
        this.isShowMsgBox = false;
      }
      // 获取推荐搜索
      this.getSuggestSearch(this.searchValue);
    },
    // 获取热搜默认关键词
    async getDefultSearchWorld() {
      let { data } = await _getDefaultHotKey();
      if (data.code === 200) this.defultWorldObj = data.data;
    },
    // 获取推荐搜索内容
    async getSuggestSearch(keywords) {
      if (keywords == "") return;
      let { data } = await _getSuggestSearch(keywords);
      if (data.code === 200) this.searchSuggest = data.result.allMatch;
    },
  },

  mounted() {
    this.getDefultSearchWorld();
  },
};
</script>

<style lang="less" scoped>
#search {
  position: relative;
  .searchMsgBox {
    width: 90%;
    background-color: #fff;
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 6px 2px #ccc;
    font-size: 13px;
    box-sizing: border-box;
    z-index: 2;
    .searchtitle {
      height: 46px;
      line-height: 46px;
      color: #5383e8;
      border-bottom: 1px solid #d6d6d6;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .searchItem {
      height: 46px;
      width: 100%;
      display: flex;
      align-items: center;
      color: #939399;
      border-bottom: 1px solid #d6d6d6;
      padding: 0 10px;
      box-sizing: border-box;
      .sIcon {
        font-size: 20px;
        margin-right: 4px;
      }
    }
  }
  .back {
    margin-left: 6px;
  }
}
</style>