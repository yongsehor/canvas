<template>
  <div id="toplistdetail">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      class="navbar"
      @click-left="$router.go(-1)"
    >
      <template #left>
        <van-icon name="arrow-left" color="#000" />
        <div class="title">排行榜</div>
      </template>
    </van-nav-bar>
    <div class="toplistbody">
      <!-- 官方榜 -->
      <div class="GMlist">
        <div class="title">官方榜</div>
        <div class="gmlist_body">
          <div
            class="list_item"
            v-for="item in GMlist"
            :key="item.id"
            @click="toplaylistdetail(item.id)"
          >
            <div class="i_pic">
              <van-image class="i_pic" :src="item.coverImgUrl" />
              <div class="i_updatetime">{{ item.updateFrequency }}</div>
            </div>
            <ul class="i_songlist">
              <li
                v-for="(songs, index) in item.tracks"
                :key="songs.index"
                class="van-ellipsis"
              >
                {{ index + 1 }}.{{ songs.first }} - {{ songs.second }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 云音乐榜单 -->
      <div class="Cloudlist">
        <div class="title">云音乐榜单</div>
        <div class="CL_body">
          <div
            class="cl_item"
            v-for="item in Cloudlist"
            :key="item.id"
            @click="toplaylistdetail(item.id)"
          >
            <div class="cl_pic">
              <van-image class="img" :src="item.coverImgUrl" />
              <div class="update">{{ item.updateFrequency }}</div>
            </div>
            <div class="cl_name">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <!-- 其他榜单 -->
      <div class="Otherlist">
        <div class="title">其他榜单</div>
        <div class="CL_body">
          <div
            class="cl_item"
            v-for="item in OtherList"
            :key="item.id"
            @click="toplaylistdetail(item.id)"
          >
            <div class="cl_pic">
              <van-image class="img" :src="item.coverImgUrl" />
              <div class="update">{{ item.updateFrequency }}</div>
            </div>
            <div class="cl_name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <loading />
  </div>
</template>

<script>
import { _getAllToplistDetail } from "../../network/toplist";
export default {
  data() {
    return {
      GMlist: [],
      Cloudlist: [],
      OtherList: [],
    };
  },
  methods: {
    // 获取排行榜信息
    async getTopliData() {
      this.$store.commit("showLoading");
      // 获取所有榜单内容摘要
      let { data } = await _getAllToplistDetail();
      //   console.log(data.list);
      if (data.code === 200) {
        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i].tracks.length !== 0) {
            this.GMlist.push(data.list[i]);
          } else if (data.list[i].userId === 1) {
            this.Cloudlist.push(data.list[i]);
          } else {
            this.OtherList.push(data.list[i]);
          }
        }
      }
      this.$store.commit("hiddenLoading");
    },
    // 跳转到歌单详情
    toplaylistdetail(id) {
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
  },
  mounted() {
    this.getTopliData();
  },
};
</script>

<style lang="less" scoped>
#toplistdetail {
  .navbar {
    background-color: #fff;
    z-index: 999;
    .title {
      color: #000;
      font-size: 16px;
      padding-left: 20px;
    }
  }
  .toplistbody {
    margin-top: 46px;
    background-color: #fff;
    padding: 10px 20px;
    .GMlist {
      .title {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
      }
      .gmlist_body {
        .list_item {
          margin: 6px 0;
          display: flex;
          height: 100px;
          justify-content: space-between;
          align-items: center;
          .i_pic {
            position: relative;
            width: 96px;
            height: 96px;
            border-radius: 15px;
            overflow: hidden;
            .i_updatetime {
              position: absolute;
              font-size: 10px;
              color: #fff;
              bottom: 6px;
              left: 10px;
            }
          }
          .i_songlist {
            width: 230px;
            font-size: 12px;
            > li {
              letter-spacing: 0.1em;
              color: #767676;
              margin: 8px 0;
            }
          }
        }
      }
    }
    .Otherlist,
    .Cloudlist {
      .title {
        margin-top: 20px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
      }
      .CL_body {
        display: grid;
        grid-template-columns: repeat(3, 33.33%);
        .cl_item {
          width: 96px;
          margin: 10px 0;
          display: flex;
          flex-direction: column;
          .cl_pic {
            position: relative;
            width: 96px;
            height: 96px;
            border-radius: 15px;
            overflow: hidden;
            .img {
              width: inherit;
              height: inherit;
            }
            .update {
              position: absolute;
              color: #fff;
              font-size: 10px;
              left: 6px;
              bottom: 6px;
              z-index: 99;
              background-color: rgba(0, 0, 0, 0.3);
              border-radius: 15px;
              padding: 2px 6px;
            }
          }
          .cl_name {
            padding-top: 8px;
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>