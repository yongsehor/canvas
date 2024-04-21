import {
  _getLyric,
  _getPlayListDetialBySongsId,
  _getSongUrlsById,
} from "../../network/music";

export async function getSongObject(id) {
  // 获取歌曲详情
  let { data: detail } = await _getPlayListDetialBySongsId(id);
  // 获取歌词url
  let { data: url } = await _getSongUrlsById(id);
  // 獲取歌曲歌詞
  let { data: lrc } = await _getLyric(id);

  let lyrics, tlyrics;

  if (lrc.lrc) {
    let res = formatLyric(lrc.lrc.lyric);
    lyrics = res.lyricsArr;
  } else lyrics = false;

  if (lrc.tlyric) {
    let tres = formatLyric(lrc.tlyric.lyric);
    tlyrics = tres.lyricsArr;
  } else tlyrics = false;

  const item = {
    id: id,
    title: detail.songs[0].name,
    pic: detail.songs[0].al.picUrl,
    url: url.data[0].url,
    artist: detail.songs[0].ar,
    lrc: lyrics,
    tlrc: tlyrics,
  };

  return { item };
}

export async function getMusicList(ids) {
  let { data: details } = await _getPlayListDetialBySongsId(ids.toString());
  let itemArr = [];
  for (let i = 0; i < details.songs.length; i++) {
    let { data: url } = await _getSongUrlsById(ids[i]);
    let {
      data: { lrc, tlyric },
    } = await _getLyric(ids[i]);

    let lyrics, tlyrics;

    if (lrc) {
      let res = formatLyric(lrc.lyric);
      lyrics = res.lyricsArr;
    }
    if (tlyric) {
      let tres = formatLyric(tlyric.lyric);
      tlyrics = tres.lyricsArr;
    }
    let item = {
      id: ids[i],
      title: details.songs[i].name,
      pic: details.songs[i].al.picUrl,
      url: url.data[0].url,
      artist: details.songs[i].ar,
      lrc: lyrics || false,
      tlrc: tlyrics || false,
    };
    itemArr.push(item);
  }
  return { itemArr };
}

function formatLyric(str) {
  let strSource = str.split(/(\[.*\])/).slice(1);
  let lyricsArr = [];
  for (let i = 0; i < strSource.length; i = i + 2) {
    if (strSource[i] == "" || strSource[i + 1] == "") continue;
    let t = strSource[i].substring(
      strSource[i].indexOf("[") + 1,
      strSource[i].indexOf("]")
    );
    lyricsArr.push({
      timer: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
      lyric: strSource[i + 1],
    });
  }
  return { lyricsArr };
}
