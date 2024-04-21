<template>
  <div id="user">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getUsersSearch(key)"
    >
      <div
        class="user_item"
        v-for="(user, index) in userprofiles"
        :key="index"
        @click="toUserInfoDetailPage(user.userId)"
      >
        <div class="avatar">
          <van-image :src="user.avatarUrl" round fit="cover" class="pic" />
          <van-image
            v-if="user.avatarDetail"
            :src="user.avatarDetail.identityIconUrl"
            round
            fit="cover"
            class="identity"
          />
        </div>
        <div class="info">
          <div class="i_name">
            <div class="name van-ellipsis">{{ user.nickname }}</div>
            <van-icon
              class-prefix="my-icon"
              class="sex1"
              v-if="user.gender === 2"
              name="women2"
            />
            <van-icon
              class-prefix="my-icon"
              class="sex2"
              v-else-if="user.gender === 1"
              name="man2"
            />
          </div>
          <div class="i_signature" v-if="user.avatarDetail">网易音乐人</div>
          <div class="i_signature van-ellipsis" v-else>
            {{ user.signature }}
          </div>
        </div>
        <div class="follow">
          <div class="btn1" v-if="user.followed">已关注</div>
          <div class="btn2" v-else>
            <van-icon class="folow-icon" name="plus" />关注
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
      userprofiles: [],
      finished: false,
      loading: false,
      page: 0,
      offset: 0,
    };
  },
  props: ["keyword"],
  methods: {
    async getUsersSearch(key) {
      this.page++;
      this.offset = (this.page - 1) * 30;
      let { data } = await _getSearchdata(key, 1002, this.offset);
      if (data.code === 200) {
        for (let i = 0; i < data.result.userprofiles.length; i++) {
          this.userprofiles.push(data.result.userprofiles[i]);
        }
        this.loading = false;
        if (data.result.userprofiles.length < 30) this.finished = true;
      } else {
        console.log(data);
      }
    },
    // 跳转用户详情页
    toUserInfoDetailPage(id) {
      this.$router.push({ path: "/userinfo", query: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
#user {
  width: 100%;
  background-color: #fff;
  height: 520px;
  overflow: scroll;
  .user_item {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .avatar {
      width: 46px;
      height: 46px;
      position: relative;
      .pic {
        width: 46px;
        height: 46px;
      }
      .identity {
        position: absolute;
        width: 14px;
        height: 14px;
        bottom: 0;
        left: 30px;
      }
    }
    .info {
      width: 220px;
      .i_name {
        display: flex;
        align-items: center;
        .name {
          font-size: 15.4px;
        }
        .sex1 {
          font-size: 12px;
          margin-left: 6px;
          color: #f78698;
        }
        .sex2 {
          font-size: 12px;
          margin-left: 6px;
          color: #8a86f7;
        }
      }
      .i_signature {
        font-size: 11.4px;
        color: #969799;
        margin-top: 4px;
      }
    }
    .follow {
      width: 70px;
      .btn1 {
        width: 64px;
        height: 24px;
        font-size: 11.6px;
        color: #4a4a4a;
        border: 1px solid #989898;
        border-radius: 15px;
        text-align: center;
        line-height: 24px;
      }
      .btn2 {
        width: 64px;
        height: 24px;
        font-size: 11.6px;
        color: #5555e6;
        border: 1px solid #5555e6;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        .folow-icon {
          font-size: 10px;
          padding-right: 4px;
        }
      }
    }
  }
}
</style>