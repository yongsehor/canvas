<template>
  <div id="PSDP">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      @click-left="$store.commit('hiddenSubPopup')"
      class="navbar"
    >
      <template #left>
        <van-icon name="arrow-left" class="t_icon" />
        <span class="title">收藏者</span>
      </template>
    </van-nav-bar>
    <div class="PSDP_body">
      <van-list
        v-model="psdp_loading"
        :finished="psdp_finished"
        finished-text="没有更多了"
        @load="getPlaylistSubscribers(id)"
      >
        <div
          class="cell"
          v-for="(items, index) in subscribersList"
          :key="index"
          @click="toUserInfoDetailPage(items.userId)"
        >
          <van-image round class="pic" :src="items.avatarUrl" />
          <div class="userInfo">
            <div class="username">
              <span class="name">{{ items.nickname }}</span>
              <van-icon
                class-prefix="my-icon"
                class="sex"
                color="blue"
                name="man2"
                v-if="items.gender === 1"
              />
              <van-icon
                class-prefix="my-icon"
                class="sex"
                color="pink"
                name="women2"
                v-if="items.gender === 2"
              />
            </div>
            <div class="userSignature van-ellipsis">{{ items.signature }}</div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { _getPlaylistSubscribers } from "../../network/playlist";
export default {
  data() {
    return {
      id: this.playlistid,
      // 收藏者列表
      subscribersList: [],
      psdp_loading: false,
      psdp_finished: false,
      page: 0,
      offset: 0,
    };
  },
  methods: {
    // 获取歌单收藏者列表
    async getPlaylistSubscribers(id) {
      this.page++;
      this.offset = (this.page - 1) * 30;
      let { data: res } = await _getPlaylistSubscribers(id, 30, this.offset);
      if (res.code === 200) {
        for (let i = 0; i < res.subscribers.length; i++) {
          this.subscribersList.push(res.subscribers[i]);
        }
        this.psdp_loading = false;
        if (res.subscribers.length < 30) {
          this.psdp_finished = true;
        }
      }
    },
    toUserInfoDetailPage(id) {
      this.$router.push({
        path: "userinfo",
        query: { id },
      });
    },
  },
  props: ["playlistid"],
  mounted() {},
};
</script>

<style lang="less" scoped>
#PSDP {
  width: 100%;
  height: 667px;
  .navbar {
    background-color: #fff;
    .t_icon {
      color: #000;
    }
    .title {
      font-size: 16px;
      margin-left: 20px;
    }
  }
  .PSDP_body {
    padding-top: 56px;
    .cell {
      margin: 4px 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      .pic {
        width: 50px;
        height: 50px;
      }
      .userInfo {
        width: 280px;
        margin-left: 10px;
        .username {
          height: 26px;
          font-size: 16px;
          line-height: 26px;
          display: flex;
          align-items: center;
          .sex {
            margin-left: 8px;
            font-size: 12px;
          }
        }
        .userSignature {
          margin-top: 2px;
          font-size: 11.6px;
          color: #909090;
        }
      }
    }
  }
}
</style>