<template>
  <div id="pm" v-if="songList.length !== 0">
    <div class="pmMini">
      <van-image
        fit="cover"
        :src="songList[currentIndex].pic"
        :class="[isPause ? '' : 'rotate', 'pic']"
      />
      <div class="content" @click="pageShow = true">
        <audio
          autoplay
          :src="songList[currentIndex].url"
          @loadedmetadata="onLoadedmetadata"
          @timeupdate="onTimeUpdate"
          @playing="onPlaying"
          @pause="onPause"
          @play="onPlay"
          @ended="onEnded"
          ref="globalAudio"
        />
        <div class="name van-ellipsis">
          <span class="songname">{{ songList[currentIndex].title }}</span>
          <span class="artistname">
            -
            <span
              v-for="(ar, index) in songList[currentIndex].artist"
              :key="index"
            >
              <span v-if="index === songList[currentIndex].artist.length - 1">
                {{ ar.name }}
              </span>
              <span v-else>{{ ar.name }} / </span>
            </span>
          </span>
        </div>
        <div class="jindu">
          已经播放：{{ currentTime | formatCurrentTime }} /
          {{ duration | formatCurrentTime }}
        </div>
      </div>
      <div class="button">
        <van-icon class-prefix="my-icon" name="pre" class="pre" @click="_pre" />
        <van-icon name="play-circle-o" v-if="isPause" @click="_play" />
        <van-icon name="pause-circle-o" v-else @click="_pause" />
        <van-icon
          class-prefix="my-icon"
          name="next"
          class="next"
          @click="_next"
        />
        <van-icon name="qr" @click="listShow = true" />
      </div>
    </div>
    <!-- 歌曲页 -->
    <van-popup
      v-model="pageShow"
      class="pageShow"
      position="bottom"
      v-if="songList[currentIndex]"
    >
      <!-- 头部导航栏 -->
      <van-nav-bar :border="false" class="navbar">
        <template #left>
          <van-icon
            name="arrow-down"
            class="icon close"
            @click="pageShow = false"
          />
        </template>
        <template #title>
          <div class="songName">{{ songList[currentIndex].title }}</div>
          <div class="artist">
            <span
              v-for="(ar, index) in songList[currentIndex].artist"
              :key="index"
            >
              <span v-if="index === songList[currentIndex].artist.length - 1">
                {{ ar.name }}
              </span>
              <span v-else>{{ ar.name }} / </span>
            </span>
          </div>
        </template>
        <template #right>
          <van-icon class-prefix="my-icon" name="share" class="icon share" />
        </template>
      </van-nav-bar>
      <div class="pageBody">
        <div class="volumeSlider">
          <van-icon name="volume-o" class="vloumeIcon" />
          <van-slider
            v-model="volume"
            class="volumeslider"
            @input="changeMusicVolume"
          />
        </div>
        <div class="pageContent" @click="showLyric = !showLyric">
          <transition name="fade">
            <div v-if="showLyric" class="lyricMain">
              <div v-if="songList[currentIndex].lrc" class="lmBody">
                <ul class="lyricContent" ref="ul">
                  <li
                    v-for="(lr, index) in songList[currentIndex].lrc"
                    :key="index"
                    :class="{
                      active:
                        currentTime >=
                          songList[currentIndex].lrc[index].timer &&
                        currentTime <
                          (songList[currentIndex].lrc[index + 1]
                            ? songList[currentIndex].lrc[index + 1].timer
                            : duration)
                          ? true
                          : false,
                      lrli: true,
                    }"
                  >
                    <p class="lr">{{ lr.lyric }}</p>
                    <p class="tlr" v-if="songList[currentIndex].tlrc">
                      <span
                        v-for="(tlr, index) in songList[currentIndex].tlrc"
                        :key="index"
                      >
                        <span v-if="tlr.timer === lr.timer">
                          {{ tlr.lyric }}
                        </span>
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
              <div v-else class="nolyric">纯音乐，请欣赏</div>
            </div>
          </transition>
          <transition name="fade">
            <van-image
              v-if="!showLyric"
              :src="songList[currentIndex].pic"
              :class="[isPause ? '' : 'pagerotate', 'coverImg']"
            />
          </transition>
        </div>
        <div class="pageMenu">
          <div class="btnsTop">
            <van-icon name="like-o" class="like" />
            <van-icon name="down" class="download" />
            <van-icon
              class-prefix="my-icon"
              name="song"
              v-if="showLyric"
              @click="showLyric = !showLyric"
            />
            <van-icon
              class-prefix="my-icon"
              name="lyric"
              v-else
              @click="showLyric = !showLyric"
            />
            <van-icon
              name="comment-o"
              class="comment"
              @click="showCommentComp"
            />
            <van-icon name="ellipsis" class="ellipsis" />
          </div>
          <div class="musicSlider">
            <span class="currentTIme num">
              {{ currentTime | formatCurrentTime }}
            </span>
            <van-slider
              v-model="percentage"
              class="slider"
              @input="changeMusicCurrentTime"
            />
            <span class="duration num">
              {{ duration | formatCurrentTime }}
            </span>
          </div>
          <div class="btnsBottom">
            <div class="playtypeBtn">
              <van-icon
                class-prefix="my-icon"
                name="sequence"
                v-if="playType === 1"
                @click="changeLoudType(2)"
              />
              <van-icon
                class-prefix="my-icon"
                name="random"
                v-else-if="playType === 2"
                @click="changeLoudType(3)"
              />
              <van-icon
                class-prefix="my-icon"
                name="loop"
                v-else
                @click="changeLoudType(1)"
              />
            </div>
            <div class="preBtn">
              <van-icon class-prefix="my-icon" name="pre" @click="_pre" />
            </div>
            <div class="playBtn">
              <van-icon name="play-circle-o" v-if="isPause" @click="_play" />
              <van-icon name="pause-circle-o" v-else @click="_pause" />
            </div>
            <div class="nextBtn">
              <van-icon class-prefix="my-icon" name="next" @click="_next" />
            </div>
            <div class="listBtn">
              <van-icon name="qr" @click="listShow = true" />
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 播放列表 -->
    <van-popup
      v-model="listShow"
      class="listShow"
      position="bottom"
      v-if="songList[currentIndex]"
    >
      <div class="title">
        当前播放<span class="num">（{{ songList.length }}）</span>
      </div>
      <div class="menu">
        <div class="roundType" @click="changeLoudType(2)" v-if="playType === 1">
          <van-icon class-prefix="my-icon" name="sequence" />
          <div class="txt">列表循环</div>
        </div>
        <div
          class="roundType"
          @click="changeLoudType(3)"
          v-else-if="playType === 2"
        >
          <van-icon class-prefix="my-icon" name="random" />
          <div class="txt">随机播放</div>
        </div>
        <div class="roundType" @click="changeLoudType(1)" v-else>
          <van-icon class-prefix="my-icon" name="loop" />
          <div class="txt">单曲循环</div>
        </div>
        <div class="subALl">
          <van-icon name="star-o" />
          <div class="txt">收藏全部</div>
        </div>
        <div class="cleanAll" @click="cleanAll">
          <van-icon name="delete" />
        </div>
      </div>
      <div class="list">
        <div class="item" v-for="(song, index) in songList" :key="song.id">
          <div
            @click="currentIndex = index"
            :class="[
              'info',
              index == currentIndex ? 'active' : 'unactive',
              'van-ellipsis',
            ]"
          >
            <span class="songname">
              <span class="my-icon" v-if="index == currentIndex">
                &#xe629;
              </span>
              <span> {{ song.title }} </span>
            </span>
            <span class="artist">
              -
              <span v-for="(ar, index) in song.artist" :key="index">
                <span v-if="index === song.artist.length - 1">
                  {{ ar.name }}
                </span>
                <span v-else>{{ ar.name }} / </span>
              </span>
            </span>
          </div>
          <van-icon name="cross" class="cross" @click="delClickMusic(index)" />
        </div>
      </div>
    </van-popup>
    <!-- 评论区组件 -->
    <van-popup
      v-if="songList[currentIndex]"
      v-model="$store.state.isSongCommentPopup"
      position="bottom"
    >
      <comment-detial
        :parentId="songList[currentIndex].id"
        :toCommentinfos="toCommentInfos"
        :type="0"
        :key="songList[currentIndex].id"
      />
    </van-popup>
    <!-- 加载组件 -->
    <loading />
  </div>
</template>

<script>
import { _checkMusic } from "../../network/music";
import { getSongObject, getMusicList } from "./sendSongItemObj.js";
import CommentDetial from "./MusicComment";

export default {
  data() {
    return {
      listShow: false,
      pageShow: false,
      // 歌曲播放列表
      songList: [],
      // 当前正在播放的歌曲索引
      currentIndex: -1,
      // 当前音频的播放位置
      currentTime: 0,
      // 总时长
      duration: 0,
      // 歌曲是否正在播放
      isPause: true,
      // 列表播放类型 1 列表循环 2 随机播放 3 单曲循环
      playType: 1,
      // 音乐播放进度的百分比
      percentage: 0,
      // 音量
      volume: 0,
      // 控制歌词和歌曲信息页面的切换
      showLyric: false,
      toCommentInfos: {},
    };
  },
  components: {
    CommentDetial,
  },
  mounted() {
    this.$bus.$on("playThisMusic", (id) => {
      this.addClickMusic(id);
    });

    this.$bus.$on("playAll", (ids) => {
      this.addAllMusic(ids);
    });
  },
  watch: {
    songList(sl) {
      if (sl.length === 0) {
        this.listShow = false;
        this.pageShow = false;
        this.currentIndex = -1;
        this.$store.commit("hiddenMusicPlayPlaceholder");
      } else {
        this.$store.commit("showMusicPlayPlaceholder");
      }
    },
  },
  methods: {
    // 全部添加
    async addAllMusic(parmas) {
      this.$store.commit("showLoading");
      let ids = [...parmas];
      // 去掉播放列表中已经存在的歌曲
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < this.songList.length; j++) {
          if (ids[i] === this.songList[j].id) ids.splice(i, 1);
        }
      }
      // 检查歌曲是否可用
      for (let i = 0; i < ids.length; i++) {
        let {
          data: { success },
        } = await _checkMusic(ids[i]);
        if (!success) ids.splice(i, 1);
      }
      // 如果筛选后id列表仍有数据 则包装歌曲对象push进播放列表
      if (ids.length !== 0) {
        let { itemArr } = await getMusicList(ids);
        this.songList = itemArr.concat(this.songList);
        this.currentIndex = 0;
      }
      this.$store.commit("hiddenLoading");
    },
    // 将歌曲添加到列表
    async addClickMusic(id) {
      this.$store.commit("showLoading");
      let { data: res } = await _checkMusic(id);
      if (res.success) {
        if (this.songList.length === 0) {
          let { item } = await getSongObject(id);
          this.songList.push(item);
          this.currentIndex++;
        } else {
          // 如果点击的歌曲不是正在播放的歌曲，则进行下一步
          if (id !== this.songList[this.currentIndex].id) {
            for (const item of this.songList) {
              if (id == item.id) {
                // 循环过程中，如果找到了对应的一项，说明播放列表中已经有该歌曲
                // 获取该歌曲的索引
                let index = this.songList.indexOf(item);
                if (index === this.currentIndex + 1) {
                  this.currentIndex++;
                } else if (index < this.currentIndex) {
                  let target = this.songList.splice(index, 1)[0];
                  this.songList.splice(this.currentIndex, 0, target);
                } else if (index > this.currentIndex) {
                  let target = this.songList.splice(index, 1)[0];
                  this.songList.splice(this.currentIndex + 1, 0, target);
                  this.currentIndex++;
                }
                this.$store.commit("hiddenLoading");
                return;
              }
            }
            // 根据传过来的给去id包装整个歌曲对象，将他保存到当前播放歌曲的下一位
            let { item } = await getSongObject(id);
            this.songList.splice(this.currentIndex + 1, 0, item);
            this.currentIndex++;
          }
        }
      } else {
        this.$msg.fail(res.message);
      }
      this.$store.commit("hiddenLoading");
    },
    // 将歌曲从列表删除
    delClickMusic(index) {
      if (index === this.currentIndex && index === 0) {
        this.songList.splice(index, 1);
      } else if (index <= this.currentIndex) {
        this.songList.splice(index, 1);
        this.currentIndex--;
      } else {
        this.songList.splice(index, 1);
      }
    },
    onPlaying(event) {
      this.isPause = event.target.paused;
    },
    // 歌曲暂停时触发
    onPause() {
      this.isPause = true;
    },
    // 歌曲播放时触发
    onPlay() {
      this.isPause = false;
    },
    // 媒体元数据加载完成时触发
    onLoadedmetadata(event) {
      this.duration = event.target.duration;
      this.isPause = event.target.paused;
      this.volume = event.target.volume * 100;
    },
    // currentTime变化时触发
    onTimeUpdate(event) {
      this.currentTime = event.target.currentTime;
      this.percentage =
        (event.target.currentTime / event.target.duration) * 100;
      this.lyricScroll();
    },
    // 歌曲播放结束触发
    onEnded() {
      switch (this.playType) {
        case 1:
          this._next();
          break;
        case 2:
          let newIndex = Math.floor(Math.random() * this.songList.length);
          if (newIndex == this.currentIndex) {
            this.$refs.globalAudio.load();
          } else {
            this.currentIndex = newIndex;
          }
          break;
        case 3:
          this.$refs.globalAudio.load();
          break;
      }
    },
    // 播放
    _play() {
      this.$refs.globalAudio.play();
    },
    // 暂停
    _pause() {
      this.$refs.globalAudio.pause();
    },
    // 下一曲
    _next() {
      if (this.currentIndex === this.songList.length - 1) {
        this.currentIndex = 0;
        if (this.songList.length == 1) this.$refs.globalAudio.load();
      } else {
        this.currentIndex++;
      }
    },
    // 上一曲
    _pre() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.songList.length - 1;
        if (this.songList.length == 1) this.$refs.globalAudio.load();
      } else {
        this.currentIndex--;
      }
    },
    // 清空列表
    cleanAll() {
      this.songList = [];
    },
    // 更改播放类型
    changeLoudType(t) {
      this.playType = t;
    },
    // 更改音量
    changeMusicVolume(v) {
      this.$refs.globalAudio.volume = v / 100;
    },
    // 更改播放进度
    changeMusicCurrentTime(v) {
      this.$refs.globalAudio.currentTime =
        (v / 100) * this.$refs.globalAudio.duration;
    },
    // 歌词滚动
    lyricScroll() {
      if (this.showLyric) {
        let dom = document.getElementsByClassName("active")[0];
        let ul = this.$refs.ul;
        if (ul) {
          if (dom) {
            if (ul.clientHeight * 0.5 > dom.offsetTop) {
              ul.scrollTop = 0;
            } else if (
              dom.offsetTop >
              ul.scrollHeight - ul.clientHeight * 0.5
            ) {
              ul.scrollTop = ul.scrollHeight - ul.clientHeight;
            } else {
              ul.scrollTop = dom.offsetTop - ul.clientHeight * 0.5 + 24;
            }
          }
        }
      }
    },
    // 展示评论组件
    showCommentComp() {
      this.toCommentInfos = {
        name: this.songList[this.currentIndex].title,
        coverImgUrl: this.songList[this.currentIndex].pic,
        artists: this.songList[this.currentIndex].artist,
      };
      this.$store.commit("showisSongCommentPopup");
    },
  },
};
</script>

<style lang="less" scoped>
#pm {
  .pmMini {
    height: 60px;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0 -1px 6px #ccc;
    .pic {
      height: 31px;
      width: 31px;
      border-radius: 50%;
      overflow: hidden;
      border: 8px solid #000;
    }
    .content {
      padding-left: 4px;
      box-sizing: border-box;
      .name {
        font-size: 12px;
        width: 196px;
        .artistname {
          font-size: 10px;
          color: #939393;
        }
      }
      .jindu {
        margin-top: 4px;
        font-size: 9px;
        color: #afafaf;
      }
    }
    .button {
      width: 110px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 18px;
      .next {
        font-size: 13px;
      }
      .pre {
        font-size: 14px;
      }
    }
  }
  .listShow {
    width: 86%;
    margin: 0 7% 80px;
    height: 400px;
    border-radius: 10px;
    padding: 0 16px;
    box-sizing: border-box;
    .title {
      height: 50px;
      line-height: 56px;
      font-size: 14px;
    }
    .menu {
      display: grid;
      grid-template-columns: 45% 45% 10%;
      align-items: center;
      justify-content: center;
      color: #6d6d6d;
      height: 30px;
      .txt {
        color: #000;
        padding-left: 4px;
        font-size: 12px;
      }
      .subALl,
      .roundType {
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      .subALl {
        justify-content: end;
      }
      .cleanAll {
        height: 20px;
        font-size: 16px;
        line-height: 23px;
        text-align: right;
      }
    }
    .list {
      height: 300px;
      overflow: scroll;
      // 隐藏滚动条
      /* Firefox */
      scrollbar-width: none;
      /* IE 10+ */
      -ms-overflow-style: none;
      /* Chrome Safari */
      &::-webkit-scrollbar {
        display: none;
      }
      .item {
        height: 32px;
        display: flex;
        align-items: center;
        .active {
          color: #1677d2;
        }
        .unactive {
          .artist {
            color: #6d6d6d;
          }
        }
        .info {
          letter-spacing: 0.5px;
          font-size: 14px;
          width: 275px;
          padding-right: 16px;
          box-sizing: border-box;
          .songname {
            .my-icon {
              padding-right: 2px;
              font-size: 10px;
            }
          }
          .artist {
            padding-left: 2px;
            font-size: 10px;
          }
        }
        .cross {
          color: #6d6d6d;
          font-size: 14px;
        }
      }
    }
  }
  .pageShow {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      109.6deg,
      rgba(101, 58, 150, 1) 29.9%,
      rgba(168, 141, 194, 1) 99.9%
    );
    .navbar {
      background-color: transparent;
      .icon {
        color: #ffffff;
      }
      .close {
        font-size: 20px;
      }
      .share {
        font-size: 16px;
      }
      .songName {
        font-size: 15px;
      }
      .artist {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    .pageBody {
      height: 621px;
      .volumeSlider {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        .vloumeIcon {
          font-size: 16px;
          color: #ffffff;
        }
        .volumeslider {
          margin: 0 14px;
        }
      }
      .pageContent {
        height: 421px;
        position: relative;
        overflow: hidden;
        .fade-enter-active,
        .fade-leave-active {
          transition: opacity 0.8s;
        }
        .fade-enter,
        .fade-leave-to {
          opacity: 0;
        }
        .coverImg {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
          border: 44px solid #000;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .nolyric {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          text-align: center;
          line-height: 421px;
        }
        .lyricMain {
          width: 100%;
          height: 421px;
          .lmBody {
            width: inherit;
            height: inherit;
            .lyricContent {
              height: inherit;
              width: inherit;
              box-sizing: border-box;
              padding: 0 30px;
              text-align: center;
              overflow: scroll;
              scroll-behavior: smooth;
              // 隐藏滚动条
              /* Firefox */
              scrollbar-width: none;
              /* IE 10+ */
              -ms-overflow-style: none;
              /* Chrome Safari */
              &::-webkit-scrollbar {
                display: none;
              }
              .lrli {
                color: rgba(255, 255, 255, 0.6);
                margin: 20px 0;
                .lr {
                  font-size: 12px;
                }
                .tlr {
                  font-size: 10px;
                  padding-top: 6px;
                }
              }
              .active {
                color: #fff;
              }
            }
          }
        }
      }
      .pageMenu {
        height: 160px;
        .btnsTop {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 34px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 20px;
        }
        .musicSlider {
          display: flex;
          align-items: center;
          padding: 0 20px;
          height: 40px;
          .slider {
            margin: 0 16px;
          }
          span.num {
            color: #fff;
            font-size: 10px;
          }
        }
        .btnsBottom {
          padding: 0 10px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          color: rgba(255, 255, 255, 1);
          font-size: 20px;
          > div {
            height: 40px;
            line-height: 40px;
          }
          .playBtn {
            font-size: 40px;
          }
        }
      }
    }
  }
  // 旋转动画
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .rotate {
    animation: rotate 10s linear infinite;
  }
  @keyframes pageRotate {
    0% {
      transform: translate(-50%, -50%) rotate(0);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  .pagerotate {
    animation: pageRotate 10s linear infinite;
  }
}
</style>