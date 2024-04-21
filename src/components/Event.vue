<template>
  <div id="event">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getEvents(id)"
    >
      <div class="eventItem" v-for="e in events" :key="e.id">
        <!-- 动态左侧用户头像区域 -->
        <div class="userAvatar">
          <van-image round :src="e.user.avatarUrl" class="avatar" />
          <van-image
            v-if="e.user.avatarDetail"
            class="identity"
            :src="e.user.avatarDetail.identityIconUrl"
          />
        </div>
        <!-- 动态右侧内容区域 -->
        <div class="eventContent">
          <!-- 动态头部信息 -->
          <div class="ecTop">
            <div class="title">
              <span class="name">{{ e.user.nickname }}</span>
              <span class="sharetype">
                <span v-if="e.type === 13">分享歌单：</span>
                <span v-else-if="e.type === 17">分享声音：</span>
                <span v-else-if="e.type === 18">分享单曲：</span>
                <span v-else-if="e.type === 19">分享专辑：</span>
                <!-- <span v-else-if="e.type === 21">分享视频：</span> -->
                <span v-else-if="e.type === 22">转发：</span>
                <span v-else-if="e.type === 24">分享专栏文章：</span>
                <span v-else-if="e.type === 28">分享播单：</span>
                <span v-else-if="e.type === 31">分享评论：</span>
                <span v-else-if="e.type === 36">分享歌手：</span>
                <span v-else-if="e.type === 39">发布MLOG：</span>
              </span>
            </div>
            <div class="time">{{ e.showTime | formatDate(4) }}</div>
          </div>
          <!-- 动态主体内容 -->
          <div class="ecCenter">
            <!-- 动态主体信息 -->
            <div class="ecMsg">
              <div class="msgTxt">{{ JSON.parse(e.json).msg }}</div>
              <div class="msgPics">
                <van-image
                  v-for="(pic, index) in e.pics"
                  :key="index"
                  :src="pic.originUrl"
                  class="pic"
                  fit="cover"
                />
              </div>
            </div>
            <!-- 动态分享内容-->
            <div class="ecType">
              <!-- 分享歌单 -->
              <div class="ecPlaylist" v-if="e.type === 13">
                <div class="coverImg">
                  <van-image
                    :src="JSON.parse(e.json).playlist.coverImgUrl"
                    class="img"
                    fit="cover"
                  />
                </div>
                <div class="info">
                  <div class="title">
                    <div class="plICon">歌单</div>
                    <div class="plName van-ellipsis">
                      {{ JSON.parse(e.json).playlist.name }}
                    </div>
                  </div>
                  <div class="by">
                    by {{ JSON.parse(e.json).playlist.creator.nickname }}
                  </div>
                </div>
              </div>
              <!-- 分享声音 -->
              <div class="ecProgram" v-else-if="e.type === 17">
                <div class="coverImg">
                  <van-image
                    fit="cover"
                    class="img"
                    :src="JSON.parse(e.json).program.coverUrl"
                  />
                </div>
                <div class="info">
                  <div class="title">
                    <div class="type">
                      {{ JSON.parse(e.json).program.radio.category }}
                    </div>
                    <div class="name">
                      {{ JSON.parse(e.json).program.name }}
                    </div>
                  </div>
                  <div class="by">
                    {{ JSON.parse(e.json).program.radio.name }}
                  </div>
                </div>
              </div>
              <!-- 分享单曲 -->
              <div class="ecSong" v-else-if="e.type === 18">
                <div class="coverImg">
                  <van-image
                    class="img"
                    fit="cover"
                    :src="JSON.parse(e.json).song.album.picUrl"
                  />
                </div>
                <div class="songInfo">
                  <div class="name van-ellipsis">
                    {{ JSON.parse(e.json).song.name }}
                  </div>
                  <div class="by van-ellipsis">
                    <span
                      v-for="(ar, index) in JSON.parse(e.json).song.artists"
                      :key="index"
                    >
                      <span
                        v-if="
                          index == JSON.parse(e.json).song.artists.length - 1
                        "
                      >
                        {{ ar.name }}
                      </span>
                      <span v-else>{{ ar.name }} / </span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 分享专辑 -->
              <div class="ecAlbum" v-else-if="e.type === 19">
                <div class="coverImg">
                  <van-image
                    class="img"
                    fit="cover"
                    :src="JSON.parse(e.json).album.picUrl"
                  />
                </div>
                <div class="bg"></div>
                <div class="info">
                  <div class="albumName van-ellipsis">
                    {{ JSON.parse(e.json).album.name }}
                  </div>
                  <div class="by van-ellipsis">
                    <span
                      v-for="(ar, index) in JSON.parse(e.json).album.artists"
                      :key="index"
                    >
                      <span
                        v-if="
                          index === JSON.parse(e.json).album.artists.length - 1
                        "
                      >
                        {{ ar.name }}
                      </span>
                      <span v-else>{{ ar.name }} / </span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 转发动态 -->
              <div class="ecEvent" v-else-if="e.type === 22">
                <div class="ecEventMsg">
                  <span class="from">
                    @{{ JSON.parse(e.json).event.user.nickname }}：
                  </span>
                  <span class="msgContent">
                    {{ JSON.parse(JSON.parse(e.json).event.json).msg }}
                  </span>
                </div>
                <div class="ecEventPics">
                  <van-image
                    v-for="(pic, index) in JSON.parse(e.json).event.pics"
                    :key="index"
                    :src="pic.originUrl"
                    class="pic"
                    fit="cover"
                  />
                </div>
                <div class="ecEventType">
                  <!-- 歌单 -->
                  <div
                    class="tPlaylist"
                    v-if="JSON.parse(e.json).event.type === 13"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).playlist
                            .coverImgUrl
                        "
                        fit="cover"
                      />
                    </div>
                    <div class="info">
                      <div class="title">
                        <div class="plType">歌单</div>
                        <div class="plName van-ellipsis">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).playlist
                              .name
                          }}
                        </div>
                      </div>
                      <div class="by van-ellipsis">
                        by
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).playlist
                            .creator.nickname
                        }}
                      </div>
                    </div>
                  </div>
                  <!-- 声音 -->
                  <div
                    class="tProgram"
                    v-else-if="JSON.parse(e.json).event.type === 17"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).program
                            .coverUrl
                        "
                      />
                    </div>
                    <div class="info">
                      <div class="title">
                        <div class="type">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).program
                              .radio.category
                          }}
                        </div>
                        <div class="name van-ellipsis">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).program
                              .name
                          }}
                        </div>
                      </div>
                      <div class="by">
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).program
                            .radio.name
                        }}
                      </div>
                    </div>
                  </div>
                  <!-- 单曲 -->
                  <div
                    class="tSong"
                    v-else-if="JSON.parse(e.json).event.type === 18"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).song.album
                            .picUrl
                        "
                        fit="cover"
                      />
                    </div>
                    <div class="info">
                      <div class="name van-ellipsis">
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).song.name
                        }}
                      </div>
                      <div class="by van-ellipsis">
                        <span
                          v-for="(ar, index) in JSON.parse(
                            JSON.parse(e.json).event.json
                          ).song.artists"
                          :key="ar.id"
                        >
                          <span
                            v-if="
                              index ===
                              JSON.parse(JSON.parse(e.json).event.json).song
                                .artists.length -
                                1
                            "
                          >
                            {{ ar.name }}
                          </span>
                          <span v-else>{{ ar.name }} / </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 专辑 -->
                  <div
                    class="tAlbum"
                    v-else-if="JSON.parse(e.json).event.type === 19"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).album.picUrl
                        "
                      />
                    </div>
                    <div class="bg"></div>
                    <div class="info">
                      <div class="albumName">
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).album.name
                        }}
                      </div>
                      <div class="by">
                        <span
                          v-for="(ar, index) in JSON.parse(
                            JSON.parse(e.json).event.json
                          ).album.artists"
                          :key="index"
                        >
                          <span
                            v-if="
                              index ===
                              JSON.parse(JSON.parse(e.json).event.json).album
                                .artists.length -
                                1
                            "
                          >
                            {{ ar.name }}
                          </span>
                          <span v-else>{{ ar.name }} / </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 专栏 -->
                  <div
                    class="tTopic"
                    v-else-if="JSON.parse(e.json).event.type === 24"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).topic
                            .coverUrl
                        "
                      />
                    </div>
                    <div class="info">
                      <div class="title">
                        <div class="type">专栏</div>
                        <div class="name van-ellipsis">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).topic
                              .title
                          }}
                        </div>
                      </div>
                      <div class="by">
                        by
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).topic
                            .creator.nickname
                        }}
                      </div>
                    </div>
                  </div>
                  <!-- 播单 -->
                  <div
                    class="tDjRadio"
                    v-else-if="JSON.parse(e.json).event.type === 28"
                  >
                    <div class="coverImg">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).djRadio
                            .picUrl
                        "
                      />
                    </div>
                    <div class="info">
                      <div class="title">
                        <div class="type">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).djRadio
                              .category
                          }}
                        </div>
                        <div class="name van-ellipsis">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).djRadio
                              .name
                          }}
                        </div>
                      </div>
                      <div class="by">
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).djRadio.dj
                            .nickname
                        }}
                      </div>
                    </div>
                  </div>
                  <!-- 评论 -->
                  <div
                    class="tComment"
                    v-else-if="JSON.parse(e.json).event.type === 31"
                  >
                    <div
                      v-if="JSON.parse(JSON.parse(e.json).event.json).resource"
                    >
                      <div class="resMsg">
                        <span class="byname">
                          @{{
                            JSON.parse(JSON.parse(e.json).event.json).resource
                              .user.nickname
                          }}：
                        </span>
                        <span class="content">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).resource
                              .content
                          }}
                        </span>
                      </div>
                      <div class="resFrom">
                        <div class="fromCover">
                          <van-image
                            class="img"
                            fit="cover"
                            :src="
                              JSON.parse(
                                JSON.parse(JSON.parse(e.json).event.json)
                                  .resource.resourceInfo
                              ).album.picUrl
                            "
                          />
                        </div>
                        <div class="fromName van-ellipsis">
                          {{
                            JSON.parse(JSON.parse(e.json).event.json).resource
                              .resourceName
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="del" v-else>
                      <span>该评论已删除</span>
                    </div>
                  </div>
                  <!-- 歌手 -->
                  <div
                    class="tSinger"
                    v-else-if="JSON.parse(e.json).event.type === 36"
                  >
                    <div class="avatar">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).resource
                            .picUrl
                        "
                      />
                    </div>
                    <div class="name">
                      歌手：{{
                        JSON.parse(JSON.parse(e.json).event.json).resource.name
                      }}
                    </div>
                  </div>
                  <!-- mlog -->
                  <div
                    class="tVideo"
                    v-else-if="JSON.parse(e.json).event.type === 39"
                  >
                    <div
                      class="coverImg"
                      v-if="
                        JSON.parse(JSON.parse(e.json).event.json).video.coverUrl
                      "
                    >
                      <van-image
                        :src="
                          JSON.parse(JSON.parse(e.json).event.json).video
                            .coverUrl
                        "
                        fit="cover"
                        class="img"
                      />
                      <div class="bg"></div>
                      <div class="playCount">
                        <span class="my-icon">&#xe60e;</span>
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).video
                            .playTime | formatNumber
                        }}
                      </div>
                      <div class="duration">
                        {{
                          JSON.parse(JSON.parse(e.json).event.json).video
                            .durationms | formatDuration
                        }}
                      </div>
                      <div class="playIcon my-icon">&#xe60e;</div>
                    </div>
                    <div v-else class="del">视频已删除</div>
                  </div>
                </div>
              </div>
              <!-- 分享专栏文章 -->
              <div class="ecTopic" v-else-if="e.type === 24">
                <div class="coverImg">
                  <van-image
                    class="img"
                    fit="cover"
                    :src="JSON.parse(e.json).topic.coverUrl"
                  />
                </div>
                <div class="info">
                  <div class="title">
                    <div class="type">专栏</div>
                    <div class="name van-ellipsis">
                      {{ JSON.parse(e.json).topic.title }}
                    </div>
                  </div>
                  <div class="by">
                    by {{ JSON.parse(e.json).topic.creator.nickname }}
                  </div>
                </div>
              </div>
              <!-- 分享播单 -->
              <div class="ecDjRadio" v-else-if="e.type === 28">
                <div class="coverImg">
                  <van-image
                    class="img"
                    fit="cover"
                    :src="JSON.parse(e.json).djRadio.picUrl"
                  />
                </div>
                <div class="info">
                  <div class="title">
                    <div class="type">
                      {{ JSON.parse(e.json).djRadio.category }}
                    </div>
                    <div class="name van-ellipsis">
                      {{ JSON.parse(e.json).djRadio.name }}
                    </div>
                  </div>
                  <div class="by">
                    by {{ JSON.parse(e.json).djRadio.dj.nickname }}
                  </div>
                </div>
              </div>
              <!-- 分享评论 -->
              <div class="ecResource" v-else-if="e.type === 31">
                <div v-if="JSON.parse(e.json).resource">
                  <div class="resMsg">
                    <span class="byname">
                      @{{ JSON.parse(e.json).resource.user.nickname }}:
                    </span>
                    <span class="content">
                      {{ JSON.parse(e.json).resource.content }}
                    </span>
                  </div>
                  <div class="resFrom">
                    <div class="fromCover">
                      <van-image
                        class="img"
                        fit="cover"
                        :src="
                          JSON.parse(JSON.parse(e.json).resource.resourceInfo)
                            .album.picUrl
                        "
                      />
                    </div>
                    <div class="fromName van-ellipsis">
                      {{ JSON.parse(e.json).resource.resourceName }}
                    </div>
                  </div>
                </div>
                <div class="del" v-else>
                  <span>该评论已删除</span>
                </div>
              </div>
              <!-- 分享歌手 -->
              <div class="ecSinger" v-else-if="e.type === 36">
                <div class="avatar">
                  <van-image
                    class="img"
                    fit="cover"
                    :src="JSON.parse(e.json).resource.picUrl"
                  />
                </div>
                <div class="name">
                  歌手：{{ JSON.parse(e.json).resource.name }}
                </div>
              </div>
              <!-- 发布Mlog -->
              <div class="ecVideo" v-else-if="e.type === 39">
                <div class="coverImg">
                  <van-image
                    class="img"
                    :src="JSON.parse(e.json).video.coverUrl"
                  />
                  <div class="bg"></div>
                  <div class="playCount">
                    <span class="my-icon">&#xe6b3;</span>
                    {{ JSON.parse(e.json).video.playTime | formatNumber }}
                  </div>
                  <div class="duration">
                    {{ JSON.parse(e.json).video.durationms | formatDuration }}
                  </div>
                  <div class="playIcon my-icon">&#xe60e;</div>
                </div>
              </div>
            </div>
            <!-- 云圈标识 -->
            <span class="ecTail" v-if="e.tailMark">
              <span class="my-icon">&#xe622;</span>
              <span>{{ e.tailMark.markTitle }}</span>
            </span>
          </div>
          <!-- 动态点赞\转发等数据 -->
          <div class="ecBottom">
            <div class="shareCount grid_item">
              <div class="my-icon">&#xe6dc;</div>
              <div class="count">{{ e.info.shareCount }}</div>
            </div>
            <div class="commentCount grid_item">
              <div class="my-icon">&#xe613;</div>
              <div class="count">{{ e.info.commentCount }}</div>
            </div>
            <div class="likedCount grid_item">
              <div class="my-icon">&#xe624;</div>
              <span class="count">{{ e.info.likedCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { _getEvent } from "../network/artist";
export default {
  data() {
    return {
      id: this.uid,
      loading: false,
      finished: false,
      lasttime: "",
      events: [],
    };
  },
  methods: {
    async getEvents(id) {
      let { data: res } = await _getEvent(id, this.lasttime);
      if (res.code === 200) {
        this.lasttime = res.lasttime;
        for (let i = 0; i < res.events.length; i++) {
          this.events.push(res.events[i]);
        }
        this.loading = false;
        if (res.events.length < 30) this.finished = true;
      }
    },
  },
  props: ["uid"],
};
</script>

<style lang="less" scoped>
#event {
  background-color: #fff;
  .eventItem {
    display: grid;
    grid-template-columns: 16% 84%;
    padding: 14px 0;
    .userAvatar {
      position: relative;
      .avatar {
        width: 46px;
        height: 46px;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .identity {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 6px;
        top: 33px;
      }
    }
    .eventContent {
      padding: 0 6px;
      .ecTop {
        .title {
          font-size: 13px;
          .name {
            color: #2c4cac;
          }
          .sharetype {
            color: #7a7a7a;
            padding-left: 4px;
          }
        }
        .time {
          margin-top: 4px;
          color: #939393;
          font-size: 10px;
        }
      }
      .ecCenter {
        .ecMsg {
          .msgTxt {
            margin: 6px 0;
            white-space: pre-line;
            font-size: 13px;
          }
          .msgPics {
            display: grid;
            grid-template-columns: repeat(2, 50%);
            align-items: center;
            justify-content: center;
            margin: 4px 0;
            .pic {
              width: 150px;
              height: 150px;
              border-radius: 10px;
              overflow: hidden;
            }
          }
        }
        .ecType {
          margin-bottom: 6px;
          .ecPlaylist {
            height: 50px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            .coverImg {
              width: 36px;
              height: 36px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .info {
              width: 240px;
              margin-left: 8px;
              .title {
                display: flex;
                align-items: center;
                .plICon {
                  font-size: 8px;
                  color: #2c4cac;
                  border: 1px solid #2c4cac;
                  border-radius: 4px;
                  padding: 1px 2px;
                }
                .plName {
                  margin-left: 5px;
                  width: 170px;
                  font-size: 13px;
                }
              }
              .by {
                margin-top: 3px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecProgram {
            height: 50px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            .coverImg {
              width: 36px;
              height: 36px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .info {
              width: 240px;
              margin-left: 8px;
              .title {
                display: flex;
                align-items: center;
                .type {
                  font-size: 8px;
                  color: #2c4cac;
                  border: 1px solid #2c4cac;
                  border-radius: 4px;
                  padding: 1px 2px;
                }
                .name {
                  margin-left: 5px;
                  width: 170px;
                  font-size: 13px;
                }
              }
              .by {
                margin-top: 3px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecSong {
            height: 50px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            .coverImg {
              width: 36px;
              height: 36px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .songInfo {
              width: 240px;
              margin-left: 8px;
              .name {
                font-size: 12px;
              }
              .by {
                margin-top: 3px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecAlbum {
            height: 50px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            position: relative;
            .coverImg {
              width: 36px;
              height: 36px;
              border-radius: 6px;
              overflow: hidden;
              z-index: 2;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .bg {
              position: absolute;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: #000;
              z-index: 1;
              left: 8px;
            }
            .info {
              width: 232px;
              margin-left: 16px;
              .albumName {
                font-size: 12px;
              }
              .by {
                margin-top: 3px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecEvent {
            background-color: #f0f0f0;
            border-radius: 9px;
            padding: 10px;
            .ecEventMsg {
              font-size: 12px;
              white-space: pre-wrap;
              .from {
                color: #2c4cac;
              }
              .msgContent {
                line-height: 20px;
              }
            }
            .ecEventPics {
              display: grid;
              grid-template-columns: repeat(2, 50%);
              align-items: center;
              justify-content: center;
              margin: 4px 0;
              .pic {
                width: 132px;
                height: 132px;
                border-radius: 10px;
                overflow: hidden;
                margin-top: 4px;
              }
            }
            .ecEventType {
              margin-top: 4px;
              .tPlaylist,
              .tSong,
              .tAlbum,
              .tProgram,
              .tSinger,
              .tDjRadio {
                height: 42px;
                display: flex;
                align-items: center;
                background-color: #fff;
                border-radius: 8px;
                padding: 0 4px;
              }
              .tPlaylist {
                .coverImg {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .info {
                  width: 210px;
                  margin-left: 8px;
                  .title {
                    display: flex;
                    align-items: center;
                    .plType {
                      font-size: 7px;
                      color: #2c4cac;
                      border: 1px solid #2c4cac;
                      border-radius: 4px;
                      padding: 1px 2px;
                    }
                    .plName {
                      margin-left: 5px;
                      width: 180px;
                      font-size: 12px;
                    }
                  }
                  .by {
                    margin-top: 3px;
                    font-size: 9px;
                    color: #7a7a7a;
                  }
                }
              }
              .tProgram {
                .coverImg {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .info {
                  width: 220px;
                  margin-left: 8px;
                  .title {
                    display: flex;
                    align-items: center;
                    .type {
                      font-size: 8px;
                      color: #2c4cac;
                      border: 1px solid #2c4cac;
                      border-radius: 4px;
                      padding: 1px 2px;
                    }
                    .name {
                      margin-left: 5px;
                      width: 170px;
                      font-size: 11px;
                    }
                  }
                  .by {
                    margin-top: 3px;
                    font-size: 10px;
                    color: #7a7a7a;
                  }
                }
              }
              .tSong {
                .coverImg {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .info {
                  width: 200px;
                  margin-left: 8px;
                  .name {
                    font-size: 11px;
                  }
                  .by {
                    margin-top: 3px;
                    font-size: 9px;
                    color: #7a7a7a;
                  }
                }
              }
              .tAlbum {
                position: relative;
                .coverImg {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  overflow: hidden;
                  z-index: 2;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .bg {
                  position: absolute;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background-color: #000;
                  z-index: 1;
                  left: 8px;
                }
                .info {
                  width: 210px;
                  margin-left: 16px;
                  .albumName {
                    font-size: 12px;
                  }
                  .by {
                    margin-top: 3px;
                    font-size: 10px;
                    color: #7a7a7a;
                  }
                }
              }
              .tTopic {
                display: flex;
                align-items: center;
                background-color: #fff;
                border-radius: 8px;
                padding: 0 6px;
                height: 60px;
                .coverImg {
                  width: 100px;
                  height: 50px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .info {
                  margin-left: 9px;
                  .title {
                    display: flex;
                    align-items: center;
                    width: 160px;
                    .type {
                      font-size: 8px;
                      color: #2c4cac;
                      border: 1px solid #2c4cac;
                      border-radius: 4px;
                      padding: 1px 2px;
                    }
                    .name {
                      margin-left: 4px;
                      font-size: 13px;
                      width: 120px;
                    }
                  }
                  .by {
                    margin-top: 8px;
                    font-size: 10px;
                    color: #7a7a7a;
                  }
                }
              }
              .tDjRadio {
                .coverImg {
                  width: 32px;
                  height: 32px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    width: inherit;
                    height: inherit;
                  }
                }
                .info {
                  width: 210px;
                  margin-left: 8px;
                  .title {
                    display: flex;
                    align-items: center;
                    .type {
                      font-size: 8px;
                      color: #2c4cac;
                      border: 1px solid #2c4cac;
                      border-radius: 4px;
                      padding: 1px 2px;
                    }
                    .name {
                      margin-left: 5px;
                      width: 160px;
                      font-size: 13px;
                    }
                  }
                  .by {
                    margin-top: 3px;
                    font-size: 10px;
                    color: #7a7a7a;
                  }
                }
              }
              .tComment {
                background-color: #fff;
                width: 250px;
                border: 1px solid rgba(122, 122, 122, 0.5);
                padding: 10px;
                border-radius: 9px;
                .resMsg {
                  font-size: 12px;
                  line-height: 20px;
                  .byname {
                    color: #3760dd;
                  }
                }
                .resFrom {
                  margin-top: 10px;
                  display: flex;
                  align-items: center;
                  .fromCover {
                    width: 32px;
                    height: 32px;
                    .img {
                      width: inherit;
                      height: inherit;
                      border-radius: 6px;
                      overflow: hidden;
                    }
                  }
                  .fromName {
                    width: 200px;
                    margin-left: 9px;
                    font-size: 10px;
                    color: #7a7a7a;
                  }
                }
                .del {
                  font-size: 12px;
                  text-align: center;
                  color: #7a7a7a;
                }
              }
              .tSinger {
                .avatar {
                  height: 34px;
                  width: 34px;
                  border-radius: 6px;
                  overflow: hidden;
                  .img {
                    height: inherit;
                    width: inherit;
                  }
                }
                .name {
                  font-size: 12px;
                  margin-left: 9px;
                }
              }
              .tVideo {
                .coverImg {
                  position: relative;
                  width: 240px;
                  height: 100%;
                  .img {
                    width: inherit;
                    display: block;
                    border-radius: 8px;
                    overflow: hidden;
                  }
                  .bg {
                    border-radius: 8px;
                    background-image: linear-gradient(
                      179.2deg,
                      rgba(0, 0, 0, 0.5) 0%,
                      rgba(130, 130, 130, 0.3) 25%,
                      rgba(255, 255, 255, 0.1) 50%,
                      rgba(130, 130, 130, 0.3) 75%,
                      rgba(15, 0, 0, 0.5) 100%
                    );
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                  }
                  .playCount {
                    position: absolute;
                    font-size: 10px;
                    color: #fff;
                    left: 6px;
                    bottom: 6px;
                    z-index: 10;
                  }
                  .duration {
                    position: absolute;
                    font-size: 10px;
                    color: #fff;
                    right: 6px;
                    bottom: 6px;
                    z-index: 10;
                  }
                  .playIcon {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 40px;
                  }
                }
                .del {
                  background-color: #fff;
                  text-align: center;
                  font-size: 12px;
                  padding: 20px 0;
                  letter-spacing: 3px;
                }
              }
            }
          }
          .ecTopic {
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            height: 80px;
            .coverImg {
              width: 120px;
              height: 70px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .info {
              margin-left: 9px;
              .title {
                display: flex;
                align-items: center;
                width: 160px;
                .type {
                  font-size: 8px;
                  color: #2c4cac;
                  border: 1px solid #2c4cac;
                  border-radius: 4px;
                  padding: 1px 2px;
                }
                .name {
                  margin-left: 4px;
                  font-size: 13px;
                  width: 120px;
                }
              }
              .by {
                margin-top: 8px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecDjRadio {
            height: 50px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            .coverImg {
              width: 36px;
              height: 36px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                width: inherit;
                height: inherit;
              }
            }
            .info {
              width: 240px;
              margin-left: 8px;
              .title {
                display: flex;
                align-items: center;
                .type {
                  font-size: 8px;
                  color: #2c4cac;
                  border: 1px solid #2c4cac;
                  border-radius: 4px;
                  padding: 1px 2px;
                }
                .name {
                  margin-left: 5px;
                  width: 170px;
                  font-size: 13px;
                }
              }
              .by {
                margin-top: 3px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
          }
          .ecResource {
            width: 280px;
            border: 1px solid rgba(122, 122, 122, 0.5);
            padding: 10px;
            border-radius: 9px;
            .resMsg {
              font-size: 13px;
              line-height: 20px;
              .byname {
                color: #3760dd;
              }
            }
            .resFrom {
              margin-top: 10px;
              display: flex;
              align-items: center;
              .fromCover {
                width: 32px;
                height: 32px;
                .img {
                  width: inherit;
                  height: inherit;
                  border-radius: 6px;
                  overflow: hidden;
                }
              }
              .fromName {
                width: 200px;
                margin-left: 9px;
                font-size: 10px;
                color: #7a7a7a;
              }
            }
            .del {
              font-size: 12px;
              text-align: center;
              color: #7a7a7a;
            }
          }
          .ecSinger {
            height: 54px;
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 0 6px;
            .avatar {
              height: 40px;
              width: 40px;
              border-radius: 6px;
              overflow: hidden;
              .img {
                height: inherit;
                width: inherit;
              }
            }
            .name {
              font-size: 14px;
              margin-left: 9px;
            }
          }
          .ecVideo {
            .coverImg {
              position: relative;
              width: 280px;
              height: 100%;
              .img {
                width: inherit;
                display: block;
                border-radius: 8px;
                overflow: hidden;
              }
              .bg {
                border-radius: 8px;
                background-image: linear-gradient(
                  179.2deg,
                  rgba(0, 0, 0, 0.5) 0%,
                  rgba(130, 130, 130, 0.3) 25%,
                  rgba(255, 255, 255, 0.1) 50%,
                  rgba(130, 130, 130, 0.3) 75%,
                  rgba(15, 0, 0, 0.5) 100%
                );
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 9;
              }
              .playCount {
                position: absolute;
                font-size: 10px;
                color: #fff;
                left: 6px;
                bottom: 6px;
                z-index: 10;
              }
              .duration {
                position: absolute;
                font-size: 10px;
                color: #fff;
                right: 6px;
                bottom: 6px;
                z-index: 10;
              }
              .playIcon {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: rgba(255, 255, 255, 0.8);
                font-size: 40px;
              }
            }
          }
        }
        .ecTail {
          padding: 4px 6px;
          border-radius: 6px;
          font-size: 11px;
          background-color: rgba(204, 204, 204, 0.3);
          color: #2c4cac;
          .my-icon {
            padding-right: 4px;
          }
        }
      }
      .ecBottom {
        margin-top: 8px;
        height: 30px;
        display: grid;
        grid-template-columns: repeat(3, 33%);
        align-items: center;
        .grid_item {
          display: flex;
          align-items: center;
          color: #7a7a7a;
          .my-icon {
            margin-right: 4px;
            font-size: 16px;
          }
          .count {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>