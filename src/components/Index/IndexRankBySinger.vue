<template>
  <div id="ranking">
    <div class="title">
      <div class="title_name">歌手热度榜</div>
      <router-link tag="div" class="more" to="/toplist"> 更 多 </router-link>
    </div>
    <van-tabs v-model="active" class="tabs" animated sticky offset-top="46">
      <van-tab title="中国">
        <div class="rank">
          <div
            class="rankItem"
            v-for="(item, index) in artistsByChina"
            :key="index"
            @click="toArtistDetail(item.id)"
          >
            <div class="rankNum">{{ index + 1 }}</div>
            <van-image fit="cover" class="img" :src="item.img1v1Url" />
            <div class="info">
              <div class="name">
                {{ item.name }}
                <span class="trans" v-if="item.trans !== ''">
                  ({{ item.trans }})</span
                >
              </div>
              <div class="hotcount">
                <van-icon name="fire-o" class="icon" />
                <span>{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="欧美">
        <div class="rank">
          <div
            class="rankItem"
            v-for="(item, index) in artistByEuropeAndAmerica"
            :key="index"
            @click="toArtistDetail(item.id)"
          >
            <div class="rankNum">{{ index + 1 }}</div>
            <van-image fit="cover" class="img" :src="item.img1v1Url" />
            <div class="info">
              <div class="name">
                {{ item.name }}
                <span class="trans" v-if="item.trans !== ''">
                  ({{ item.trans }})</span
                >
              </div>
              <div class="hotcount">
                <van-icon name="fire-o" class="icon" />
                <span>{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="韩国">
        <div class="rank">
          <div
            class="rankItem"
            v-for="(item, index) in artistByKorea"
            :key="index"
            @click="toArtistDetail(item.id)"
          >
            <div class="rankNum">{{ index + 1 }}</div>
            <van-image fit="cover" class="img" :src="item.img1v1Url" />
            <div class="info">
              <div class="name">
                {{ item.name }}
                <span class="trans" v-if="item.trans !== ''">
                  ({{ item.trans }})</span
                >
              </div>
              <div class="hotcount">
                <van-icon name="fire-o" class="icon" />
                <span>{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="日本">
        <div class="rank">
          <div
            class="rankItem"
            v-for="(item, index) in artistsByJapan"
            :key="index"
            @click="toArtistDetail(item.id)"
          >
            <div class="rankNum">{{ index + 1 }}</div>
            <van-image fit="cover" class="img" :src="item.img1v1Url" />
            <div class="info">
              <div class="name">
                {{ item.name }}
                <span class="trans" v-if="item.trans !== ''">
                  ({{ item.trans }})</span
                >
              </div>
              <div class="hotcount">
                <van-icon name="fire-o" class="icon" />
                <span>{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { _getRecomPlayList, _getSingerRanking } from "../../network/index.js";

export default {
  data() {
    return {
      active: 0,
      artistsByChina: [],
      artistByEuropeAndAmerica: [],
      artistByKorea: [],
      artistsByJapan: [],
    };
  },
  methods: {
    // 获得首页的排行榜数据（中国）
    async getRankingDataChina() {
      let { data } = await _getSingerRanking(1);
      if (data.code === 200)
        for (let i = 0; i < 10; i++) {
          this.artistsByChina.push(data.list.artists[i]);
        }
    },
    // 获得首页的排行榜数据（欧美）
    async getRankingDataEuropeAndAmerica() {
      let { data } = await _getSingerRanking(2);
      if (data.code === 200)
        for (let i = 0; i < 10; i++) {
          this.artistByEuropeAndAmerica.push(data.list.artists[i]);
        }
    },
    // 获得首页的排行榜数据（韩国）
    async getRankingDataKorea() {
      let { data } = await _getSingerRanking(3);
      if (data.code === 200)
        for (let i = 0; i < 10; i++) {
          this.artistByKorea.push(data.list.artists[i]);
        }
    },
    // 获得首页的排行榜数据（日本）
    async getRankingDataJapan() {
      let { data } = await _getSingerRanking(4);
      if (data.code === 200)
        for (let i = 0; i < 10; i++) {
          this.artistsByJapan.push(data.list.artists[i]);
        }
    },
    toArtistDetail(id) {
      this.$router.push({ path: "/artist", query: { id } });
    },
  },
  mounted() {
    this.getRankingDataChina();
    this.getRankingDataEuropeAndAmerica();
    this.getRankingDataKorea();
    this.getRankingDataJapan();
  },
};
</script>

<style lang="less" scoped>
#ranking {
  margin-top: 20px;
  .title {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 20px 10px 0;
    color: #3e3e3e;
    .title_name {
      font-size: 14px;
    }
    .more {
      font-size: 10px;
      text-align: center;
      height: 16px;
      width: 46px;
      line-height: 16px;
      border: 1px solid #717171;
      border-radius: 10px;
    }
  }
  .tabs {
    margin-top: 10px;
    .rank {
      margin: 20px 0 10px;
      .rankItem {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .rankNum {
          width: 30px;
          font-size: 16px;
          color: #000;
          text-align: center;
        }
        &:nth-of-type(-n + 3) {
          .rankNum {
            color: crimson;
          }
        }
        .img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
        }
        .info {
          width: 250px;
          .name {
            font-size: 14px;
            .trans {
              color: #717171;
            }
          }
          .hotcount {
            margin-top: 10px;
            font-size: 12px;
            color: #717171;
            display: flex;
            align-items: center;
            .icon {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}
</style>