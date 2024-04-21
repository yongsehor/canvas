<template>
  <div id="playlistgroup">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :border="false"
      fixed
      @click-left="$router.go(-1)"
      class="navbar"
    >
      <template #left>
        <van-icon name="arrow-left" class="icon" />
        <div class="title">歌单广场</div>
      </template>
    </van-nav-bar>
    <!-- 歌单主体 -->
    <div class="playlistBody">
      <!-- 标题部份 -->
      <div class="title">
        <div class="txt">{{ cat }}</div>
        <div class="screen" @click="show = !show">
          <van-icon name="filter-o" class="icon" />
          <span>筛选</span>
        </div>
      </div>
      <!-- 歌单列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getPlayList(cat)"
      >
        <div class="playlists">
          <div
            class="playlistItem"
            v-for="(pl, index) in playlists"
            :key="index"
            @click="toplaylistdetail(pl.id)"
          >
            <div class="coverImg">
              <van-image class="img" :src="pl.coverImgUrl" fit="cover" />
              <div class="playcount">
                <van-icon name="play" class="icon" />
                <span>{{ pl.playCount | formatNumber }}</span>
              </div>
            </div>
            <div class="name van-multi-ellipsis--l2">
              {{ pl.name }}
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 弹出层 -->
    <van-popup
      v-model="show"
      position="bottom"
      closeable
      close-icon="close"
      class="popup"
    >
      <div class="title">所有精品歌单</div>
      <div class="all">
        <div
          :class="['allBtn', '全部' === cat ? 'class2' : 'class1']"
          @click="changeCat('全部')"
        >
          全部精品
        </div>
      </div>
      <div class="Tags">
        <div
          v-for="tag in Tags"
          :key="tag.id"
          :class="[
            'tag',
            tag.name === cat ? 'class2' : 'class1',
            'van-ellipsis',
          ]"
          @click="changeCat(tag.name)"
        >
          {{ tag.name }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { _getPlayListCatlist, _getTopPlayList } from "../network/playlist";
export default {
  data() {
    return {
      active: 0,
      show: false,
      // 热门歌单分类列表
      Tags: [],
      // 歌单标题标签
      cat: "全部",
      offset: 0,
      page: 1,
      loading: false,
      finished: false,
      // 歌单列表
      playlists: [],
    };
  },
  methods: {
    init() {
      this.getPlaylistCatlists();
    },
    // 获取所有歌单分类
    async getPlaylistCatlists() {
      let { data } = await _getPlayListCatlist();
      this.Tags = data.sub;
    },
    // 获取网友精选碟歌单
    async getPlayList(cat) {
      let offset = (this.page - 1) * 50;
      let { data } = await _getTopPlayList(cat, offset);
      if (data.code === 200) {
        this.page++;
        for (let i = 0; i < data.playlists.length; i++) {
          this.playlists.push(data.playlists[i]);
        }
        this.loading = false;
        if (data.playlists.length < 50) this.finished = true;
      }
    },
    // 更改筛选条件
    changeCat(n) {
      this.cat = n;
      this.finished = false;
      this.before = "";
      this.playlists = [];
      this.show = false;
      this.page = 1;
      // 由于使用了van-list 所以切换后需要移动一下滚动条
      // 才能请求新的数据
      document.documentElement.scrollTop += 1;
    },
    // 跳转歌单详情页
    toplaylistdetail(id) {
      this.$router.push({ path: "/playlistdetail", query: { id } });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
#playlistgroup {
  background-color: #fff;
  .navbar {
    background-color: #fff;
    .title,
    .icon {
      color: #000;
    }
    .title {
      margin-left: 10px;
      font-size: 15px;
    }
  }
  .playlistBody {
    .title {
      position: fixed;
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      z-index: 2;
      box-sizing: content-box;
      background-color: #fff;
      top: 46px;
      .txt {
        margin-left: 20px;
      }
      .screen {
        margin-right: 20px;
        > .icon {
          margin-right: 6px;
        }
      }
    }
    .playlists {
      margin-top: 86px;
      display: grid;
      grid-template-columns: repeat(3, 31%);
      justify-content: center;
      .playlistItem {
        padding: 10px;
        .coverImg {
          position: relative;
          .img {
            border-radius: 8px;
            overflow: hidden;
          }
          .playcount {
            position: absolute;
            color: #fff;
            font-size: 10px;
            padding: 1px 6px;
            background-color: rgba(0, 0, 0, 0.3);
            top: 4px;
            right: 4px;
            border-radius: 10px;
            display: flex;
            align-items: center;
          }
          .icon {
            font-size: 12px;
            margin-right: 2px;
          }
        }
        .name {
          font-size: 12px;
        }
      }
    }
  }
  .popup {
    height: 460px;
    .class1 {
      color: #000;
      background-color: #f0f0f0;
    }
    .class2 {
      color: #fff;
      background-color: #0078d7;
    }
    .title {
      font-size: 15px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      letter-spacing: 2px;
    }
    .all {
      .allBtn {
        height: 36px;
        font-size: 13px;
        letter-spacing: 2px;
        text-align: center;
        line-height: 36px;
        border-radius: 30px;
        width: 90%;
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }
    .Tags {
      height: 320px;
      overflow: scroll;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(4, 25%);
      justify-items: center;
      .tag {
        margin-top: 10px;
        height: 30px;
        width: 80%;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        border-radius: 15px;
        padding: 0 10px;
        box-sizing: border-box;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
