<template>
  <div id="personalFm">
    <!-- 头部导航栏 -->
    <van-nav-bar :border="false" class="navbar" @click-left="$router.go(-1)">
      <template #left>
        <van-icon name="arrow-down" />
      </template>
      <template #title>
        <span class="title">私人FM</span>
      </template>
    </van-nav-bar>
    <!-- FM区域 -->
    <div class="fmBody">
      <!-- 音量条 -->
      <div class="volumeSlider">
        <van-icon name="volume-o" class="icon" />
        <van-slider v-model="volume" @input="onVolumeInput" />
      </div>
      <!-- 歌曲信息展示区 -->
      <div class="songInfo">
        <!-- 歌曲主要信息区域 -->
        <transition name="van-fade">
          <div class="songMain" v-if="swichPic" @click="swich">
            <van-image
              class="blurPic"
              v-if="curSongObj.album"
              :src="curSongObj.album.picUrl"
              fit="cover"
            />
            <div class="songName van-ellipsis">{{ curSongObj.name }}</div>
            <div class="by van-ellipsis">
              <span v-for="(ar, index) in curSongObj.artists" :key="index">
                <span v-if="index === curSongObj.artists.length - 1">
                  {{ ar.name }}
                </span>
                <span v-else> {{ ar.name }} / </span>
              </span>
            </div>
          </div>
        </transition>
        <!-- 歌词区域 -->
        <transition name="van-fade">
          <div class="songLyric" v-if="!swichPic" @click="swich">
            <div class="lyricMain" v-if="isLyric">
              <ul class="lyric" ref="ul">
                <li v-for="(ly, index) in lyrics" :key="index">
                  <div
                    :class="{
                      active:
                        currentTime >= lyrics[index].timer &&
                        currentTime <
                          (lyrics[index + 1]
                            ? lyrics[index + 1].timer
                            : $refs.audio.duration)
                          ? true
                          : false,
                    }"
                  >
                    <p>
                      {{ ly.lyric }}
                    </p>
                    <p v-for="(tly, index) in tLyrics" :key="index" class="tly">
                      <span v-if="tly.timer === ly.timer">{{ tly.lyric }}</span>
                    </p>
                  </div>
                </li>
                <p class="byuser" v-if="lyricUser">
                  歌词贡献者：{{ lyricUser.nickname }}
                </p>
              </ul>
            </div>
            <div class="errDescribe" v-else>{{ errDescribe }}</div>
          </div>
        </transition>
      </div>
      <!-- 底部功能区域 -->
      <div class="functionalArea">
        <!-- h5原生播放器 -->
        <audio ref="audio" autoplay :src="curSongUrl" />
        <!-- 音乐进度条 -->
        <div class="musicSlider">
          <div class="current">{{ currentTime | formatCurrentTime }}</div>
          <van-slider v-model="percentage" @input="onCurrentTimeInput" />
          <div class="duration">
            {{ duration | formatCurrentTime }}
          </div>
        </div>
        <!-- 功能按钮 -->
        <div class="BTN">
          <div class="close" @click="_trash">
            <van-icon name="close" />
          </div>
          <div class="likeIcon" @click="_like">
            <van-icon name="like" color="#ec4141" v-if="isLike" />
            <van-icon name="like-o" v-else />
          </div>
          <div class="playIcon" @click="_play" v-if="isPause">
            <van-icon name="play-circle-o" />
          </div>
          <div class="pauseIcon" @click="_pause" v-else>
            <van-icon name="pause-circle-o" />
          </div>
          <div class="my-icon nextIcon" @click="_next">
            <van-icon class-prefix="my-icon" name="next" />
          </div>
          <div class="comIcon" @click="showCommentComp">
            <van-icon class-prefix="my-icon" name="comment_noline" />
          </div>
        </div>
      </div>
    </div>
    <!-- 评论区组件 -->
    <van-popup v-model="$store.state.isPopup" position="bottom">
      <comment-detial
        :parentId="curSongObj.id"
        :toCommentinfos="toCommentInfos"
        :type="0"
        :key="curSongObj.id"
      />
    </van-popup>
    <!-- 加载组件 -->
    <loading />
  </div>
</template>

<script>
import CommentDetial from "../components/Detial/CommentDetial.vue";
import { _getPersonalFm } from "../network/Fm";
import { _getLyric, _getSongUrlsById, _like, _trash } from "../network/music";
export default {
  data() {
    return {
      // 本次请求FM接口得到的数据
      FM: [],
      // 当前正在播放的歌曲索引
      curIndex: 0,
      // 当前正在播放的歌曲对象
      curSongObj: {},
      // 当前正在播放的歌曲的URL
      curSongUrl: "",
      // 当前已播放时长
      currentTime: 0,
      // 歌曲长度
      duration: 0,
      // 当前播放的时间占总时长的百分比
      percentage: 0,
      // 音量
      volume: 0,
      // 是否正在暂停
      isPause: true,
      // 是否喜欢
      isLike: false,
      // 是否有歌词
      isLyric: false,
      // 获取不到歌词时的描述信息
      errDescribe: "",
      // 原版歌词
      lyrics: [],
      // 歌词贡献者
      lyricUser: {},
      // 翻译版歌词
      tLyrics: [],
      // 封面和歌词切换
      swichPic: true,
      // 发送给评论组件的部分信息
      toCommentInfos: {},
    };
  },
  components: {
    CommentDetial,
  },
  methods: {
    // 请求FM接口
    async getFmData() {
      let { data: fm } = await _getPersonalFm();
      if (fm.code === 200) {
        this.FM = fm.data;
        this.curSongObj = this.FM[0];
        this.getSongUrl(this.curSongObj.id);
        this.getSongLyric(this.curSongObj.id);
      }
    },
    // 获取歌曲Url
    async getSongUrl(id) {
      let { data: res } = await _getSongUrlsById(id);
      if (res.code === 200) this.curSongUrl = res.data[0].url;
    },
    // 获取歌词
    async getSongLyric(id) {
      let {
        data: { code, lrc, lyricUser, tlyric },
      } = await _getLyric(id);
      if (code === 200) {
        if (lrc) {
          this.isLyric = true;
          this.lyricUser = lyricUser;
          let { lyricsArr } = this.formatLyrics(lrc.lyric);
          this.lyrics = lyricsArr;
          let { lyricsArr: tlyricsArr } = this.formatLyrics(tlyric.lyric);
          this.tLyrics = tlyricsArr;
        } else {
          this.isLyric = false;
          this.errDescribe = "纯音乐，请欣赏";
        }
      } else {
        this.isLyric = false;
        this.errDescribe = "获取歌词失败";
      }
    },
    // 移除至垃圾桶
    async _trash() {
      let { data } = await _trash(this.curSongObj.id);
      if (data.code === 200) {
        this.$msg.success("移除至垃圾桶成功，我们会努力向您推荐您更喜欢的内容");
        this._next();
      } else {
        this.$msg.fail(data.msg);
      }
    },
    // 喜欢/取消喜欢
    async _like() {
      this.isLike = !this.isLike;
      let { data } = await _like(this.curSongObj.id, this.isLike);
      if (data.code === 200) {
        if (this.isLike) this.$msg.success("添加到喜欢列表成功");
        else this.$msg.success("移除成功");
      } else {
        this.isLike = false;
        this.$msg.fail(data.msg);
      }
    },
    // 播放
    _play() {
      this.isPause = false;
      this.$refs.audio.play();
    },
    // 暂停
    _pause() {
      this.isPause = true;
      this.$refs.audio.pause();
    },
    // 下一首
    _next() {
      this.curIndex++;
      if (this.FM[this.curIndex]) {
        this.curSongObj = this.FM[this.curIndex];
        this.getSongUrl(this.curSongObj.id);
        this.getSongLyric(this.curSongObj.id);
      } else {
        this.curIndex = 0;
        this.getFmData();
      }
    },
    // 调整歌曲进度
    onCurrentTimeInput(v) {
      this.$refs.audio.currentTime = (v / 100) * this.$refs.audio.duration;
    },
    // 调整音量
    onVolumeInput(v) {
      this.$refs.audio.volume = v / 100;
    },
    // 处理歌词
    formatLyrics(str) {
      let strSource = str.split(/(\[.*\])/).slice(1);
      let lyricsArr = [];
      for (let i = 0; i < strSource.length; i = i + 2) {
        if (strSource[i] == "" || strSource[i + 1] == "") continue;
        let t = strSource[i].substring(
          strSource[i].indexOf("[") + 1,
          strSource[i].indexOf("]")
        );
        lyricsArr.push({
          timer: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(
            3
          ),
          lyric: strSource[i + 1],
        });
      }
      return { lyricsArr };
    },
    // 歌词与歌曲信息的切换
    swich() {
      this.swichPic = !this.swichPic;
    },
    // 歌词滚动
    lyricScroll() {
      let dom = document.getElementsByClassName("active")[0];
      let ul = this.$refs.ul;
      if (ul)
        if (dom) {
          if (ul.clientHeight * 0.5 > dom.offsetTop) {
            ul.scrollTop = 0;
          } else if (dom.offsetTop > ul.scrollHeight - ul.clientHeight * 0.5) {
            ul.scrollTop = ul.scrollHeight - ul.clientHeight;
          } else {
            ul.scrollTop = dom.offsetTop - ul.clientHeight * 0.5 + 24;
          }
        }
    },
    // 展示评论组件
    showCommentComp() {
      this.toCommentInfos = {
        name: this.curSongObj.name,
        coverImgUrl: this.curSongObj.album.picUrl,
        artists: this.curSongObj.artists,
      };
      this.$store.commit("showPopup");
    },
  },
  mounted() {
    this.getFmData();
    this.$refs.audio.onloadeddata = (event) => {
      // 当媒体的第一帧数据获取到时，获取音量
      this.volume = event.target.volume * 100;
      this.duration = event.target.duration;
    };
    // 当audio中的currentTime发生变化时调用
    this.$refs.audio.ontimeupdate = (event) => {
      let e_t = event.target;
      this.isPause = e_t.paused;
      this.currentTime = e_t.currentTime;
      this.percentage = (e_t.currentTime / e_t.duration) * 100;
      this.lyricScroll();
    };
    // 当播放到媒体的结束位置时 切换下一首
    this.$refs.audio.onended = () => this._next();
  },
};
</script>

<style lang="less" scoped>
#personalFm {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    180deg,
    rgba(21, 13, 107, 1) 1.1%,
    rgba(188, 16, 80, 1) 130.5%
  );
  .navbar {
    background-color: transparent;
    .title {
      color: #fff;
      font-size: 16px;
    }
  }
  .fmBody {
    height: 605px;
    .volumeSlider {
      height: 16px;
      display: flex;
      width: 320px;
      margin: 8px auto 0;
      align-items: center;
      .icon {
        color: #fff;
        margin-right: 14px;
        font-size: 12px;
      }
    }
    .songInfo {
      height: 440px;
      position: relative;
      .songMain {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .blurPic {
          width: 260px;
          height: 260px;
          border-radius: 10px;
          overflow: hidden;
        }
        .songName {
          text-align: center;
          width: 300px;
          margin: 16px 0 4px;
          font-size: 16px;
          color: #fff;
        }
        .by {
          text-align: center;
          width: 300px;
          font-size: 12px;
          color: #dcdcdc;
        }
      }
      .songLyric {
        width: 100%;
        height: 100%;
        .lyricMain {
          height: inherit;
          width: inherit;
          padding: 20px;
          box-sizing: border-box;
          .lyric {
            height: inherit;
            width: inherit;
            overflow: scroll;
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            box-sizing: border-box;
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
            > li {
              margin: 30px 0;
              font-size: 12px;
              .tly {
                font-size: 10px;
                margin-top: 4px;
              }
              .active {
                color: #fff;
              }
            }
          }
          .byuser {
            letter-spacing: 1px;
            font-size: 12px;
            margin: 50px 0 2px;
          }
        }
        .errDescribe {
          padding-top: 50%;
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
        }
      }
    }
    .functionalArea {
      .musicSlider {
        height: 60px;
        display: grid;
        grid-template-columns: 15% 70% 15%;
        align-items: center;
        .current,
        .duration {
          color: #e1e1e1;
          text-align: center;
          font-size: 10px;
        }
      }
      .BTN {
        height: 70px;
        padding: 0 30px;
        color: #f0f0f0;
        display: grid;
        align-items: center;
        grid-template-columns: 18% 18% 28% 18% 18%;
        > div {
          height: 100%;
          text-align: center;
          line-height: 70px;
          font-size: 24px;
        }
        .playIcon,
        .pauseIcon {
          font-size: 48px;
        }
      }
    }
  }
}
</style>