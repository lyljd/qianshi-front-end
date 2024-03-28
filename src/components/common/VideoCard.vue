<template>
  <div class="video-card" :style="{ width: `${cs.w}px`, height: `${cs.h}px` }">
    <el-tooltip content="稍后再看" :show-arrow="false" offset="3" placement="bottom-end" :enterable="false" :hide-after="0">
      <div v-if="watchLaterShow" v-show="(coverHoverStatus || videoHoverStatus) && !hoverInfoStatus"
        @mouseenter="wliMouseEnter" @mouseleave="wliMouseLeave" @click="watchLaterFc(data.vid)" class="wli-container"
        :style="{ width: `${cs.wlis}px`, height: `${cs.wlis}px`, lineHeight: `${cs.wlis}px` }">
        <span v-show="!watchLaterStatus" class="iconfont wli el-icon-watch-later animate__animated animate__fadeIn"
          :style="{ fontSize: `${cs.wlis}px` }"></span>
        <span v-show="watchLaterStatus" class="iconfont wli el-icon-dui animate__animated animate__fadeIn"
          :style="{ fontSize: `${cs.wlis}px` }"></span>
      </div>
    </el-tooltip>

    <div style="position: relative;">
      <Image v-show="!playStatus" :url="data.coverUrl" :w="cs.w" :h="cs.ch"
        :errorText="!data.expire ? '封面加载失败' : '视频已失效'" :errorTextFontSize="cs.bfs" class="cover"
        @click="!data.expire ? cmjs.jump.video(data.vid) : undefined" @mouseenter="coverMouseEnter"
        @mouseleave="coverMouseLeave" :style="{ cursor: !data.expire ? 'pointer' : 'not-allowed' }">
      </Image>

      <VipPriIco v-if="data.vip && !data.expire" :fs="cs.ufs" class="vc-vpi" v-show="!playStatus"></VipPriIco>

      <div v-if="!data.expire" v-show="!playStatus && !hoverInfoStatus" class="inner-info"
        :style="{ width: `${cs.w}px`, height: `${cs.ufs + 10}px`, lineHeight: `${cs.ufs + 10}px`, fontSize: `${cs.ufs}px`, justifyContent: innerInfoShow ? 'space-between' : 'right' }">
        <span v-if="innerInfoShow" style="margin-left: 5px;">
          <span>
            <span class="iconfont el-icon-bofangshu" :style="{ fontSize: `${cs.ufs}px` }"></span>{{
    cmjs.fmt.numWE(data.playNum) }}
          </span>
          <span style="margin-left: 5px;">
            <span class="iconfont el-icon-danmushu" :style="{ fontSize: `${cs.ufs}px` }"></span>{{
    cmjs.fmt.numWE(data.danmuNum) }}
          </span>
        </span>
        <span v-show="!hoverInfoStatus" style="margin-right: 5px;">{{ cmjs.fmt.videoDuration(data.duration) }}</span>
      </div>
    </div>

    <video v-if="hoverStyleSwitch === 'preview'" v-show="playStatus" @mouseenter="videoMouseEnter(data)"
      @mouseleave="videoMouseLeave" @click="cmjs.jump.video(data.vid)"
      @contextmenu="(event: any) => { event.preventDefault() }" ref="videoEle" :id="`video-card-${data.vid}`" muted
      disablePictureInPicture class="video" :style="{ width: `${cs.w}px`, height: `${cs.ch}px` }"></video>

    <div v-if="hoverStyleSwitch === 'info'" v-show="hoverInfoStatus" @mouseleave="hoverInfoMouseLeave"
      @click="cmjs.jump.video(data.vid)" class="hover-style-info-container"
      :style="{ width: `${cs.w}px`, height: `${cs.ch}px`, fontSize: `${cs.bfs}px` }">
      <div class="hover-style-info" :style="{ height: `${cs.ch - 20}px` }">
        <div>播放：{{ cmjs.fmt.numWE(data.playNum) }}</div>
        <div>弹幕：{{ cmjs.fmt.numWE(data.danmuNum) }}</div>
        <div class="hover-style-info-up">UP主：{{ data.nickname }}</div>
        <div>投稿：{{ cmjs.fmt.tsYRichTmpl(data.date, "MM-DD") }}</div>
      </div>
    </div>

    <div class="info" :style="{ height: `${cs.h - cs.ch}px` }">
      <div class="title-row" :style="{ lineHeight: `${cs.h - cs.ch - cs.ufs}px` }">
        <span v-if="!data.expire" @click="cmjs.jump.video(data.vid)" :title="data.title" class="title"
          :style="{ fontSize: `${cs.bfs}px` }">{{
    data.title
  }}</span>
        <el-tooltip v-else content="因为该视频已被删除或隐藏" placement="top">
          <div class="iconfont el-icon-info" style="cursor: default; display: inline-flex;"
            :style="{ fontSize: `${cs.bfs}px`, lineHeight: `${cs.h - cs.ch - cs.ufs}px` }">视频为什么会失效？</div>
        </el-tooltip>
      </div>

      <div class="util-container" :style="{ fontSize: `${cs.ufs}px` }">
        <div class="util-row">
          <span v-if="data.starDate && data.expire" style="cursor: default; margin-right: 10px;">收藏于：{{ data.starDate ?
    cmjs.fmt.tsYRichTmpl(data.starDate, "MM-DD") : '未知' }}</span>
          <span v-if="props.type === 'big' || data.expire" @click="cmjs.jump.user(data.uid)"
            :title="data.nickname + ' · ' + cmjs.fmt.tsYRichTmpl(data.date, 'MM-DD')" class="util util-hl">
            <span class="iconfont el-icon-UPzhu" :style="{ fontSize: `${cs.ufs}px` }"></span>
            {{ data.nickname }} · {{ cmjs.fmt.tsYRichTmpl(data.date, "MM-DD") }}
          </span>

          <div v-else>
            <span v-if="props.type === 'small'" class="util">
              <span class="iconfont el-icon-bofangshu" :style="{ fontSize: `${cs.ufs}px` }"></span>
              {{ cmjs.fmt.numWE(data.playNum) }}<span style="margin-left: 10px;">{{ cmjs.fmt.tsYRichTmpl(data.date,
    "MM-DD")
                }}</span>
            </span>

            <span v-if="props.type === 'small-star'" class="util" style="cursor: default;">
              收藏于：{{ data.starDate ? cmjs.fmt.tsYRichTmpl(data.starDate, "MM-DD") : '未知' }}
            </span>
          </div>
        </div>

        <el-popover ref="extraPop" trigger="click" placement="bottom-end">
          <template #reference>
            <span v-if="extra" class="iconfont el-icon-diandiandianshu diandiandian"
              :style="{ fontSize: `${cs.ufs}px` }"></span>
          </template>
          <div class="extra-container">
            <div v-for="btn in extra" @click="() => { btn.cb(); extraPop.hide(); }" class="extra">{{ btn.name }}</div>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import VipPriIco from '@/components/common/VipPriIco.vue'

type CardSize = {
  w: number,
  h: number,
  ch: number, // content height
  bfs: number, // base fontsize 应用于视频标题、悬浮信息、封面加载错误和视频失效时显示字体大小
  ufs: number, // util fontsize 应用于除bfs之外的字体大小
  wlis: number, // watchLater ico size
}

type VideoCardData = {
  vid: number
  videoUrl: string
  coverUrl: string
  playNum: number
  danmuNum: number
  duration: number
  title: string
  uid: number
  nickname: string
  date: number
  starDate?: number
  expire?: boolean // 视频已失效
  vip: boolean
}

const props = withDefaults(defineProps<{
  data: VideoCardData,
  type: "big" | "small" | "small-star",
  hoverStyle: "preview" | "info",
  innerInfo: boolean,
  watchLater: boolean,
  extra: {
    name: string,
    cb: Function, // callback
  }[],
}>(), {
  hoverStyle: undefined,
  innerInfo: undefined,
  watchLater: undefined,
  extra: undefined,
})

const videoEle = ref<HTMLVideoElement>()
const extraPop = ref()

let cs: CardSize
let hoverStyleSwitch = ref(props.hoverStyle)
let innerInfoShow = ref(props.innerInfo)
let watchLaterShow = ref(props.watchLater)
let playStatus = ref(false)
let hoverInfoStatus = ref(false)
let coverHoverStatus = ref(false)
let videoHoverStatus = ref(false)
let wliHoverStatus = ref(false) // watchLater ico
let watchLaterStatus = ref(false)

initData()

function initData() {
  switch (props.type) {
    case "big": {
      if (props.hoverStyle === undefined) {
        hoverStyleSwitch.value = "preview"
      }
      if (props.innerInfo === undefined) {
        innerInfoShow.value = true
      }
      if (props.watchLater === undefined) {
        watchLaterShow.value = true
      }
      cs = { w: 270, h: 200, ch: 151.88, bfs: 18, ufs: 14, wlis: 18 }
      break
    }
    case "small": {
      if (props.hoverStyle === undefined) {
        hoverStyleSwitch.value = "preview"
      }
      if (props.innerInfo === undefined) {
        innerInfoShow.value = false
      }
      if (props.watchLater === undefined) {
        watchLaterShow.value = true
      }
      cs = { w: 210, h: 155, ch: 118.13, bfs: 16, ufs: 12, wlis: 16 }
      break
    }
    case "small-star": {
      if (props.hoverStyle === undefined) {
        hoverStyleSwitch.value = "info"
      }
      if (props.innerInfo === undefined) {
        innerInfoShow.value = false
      }
      watchLaterShow.value = false
      cs = { w: 210, h: 155, ch: 118.13, bfs: 16, ufs: 12, wlis: 16 }
      break
    }
  }
}

function coverMouseEnter() {
  coverHoverStatus.value = true
  switch (hoverStyleSwitch.value) {
    case "preview": {
      setTimeout(() => {
        videoHoverStatus.value = false
        if (coverHoverStatus.value) {
          playStatus.value = true
          videoEle.value?.play()
        }
      }, 1000)
      break
    }
    case "info": {
      hoverInfoStatus.value = true
      break
    }
  }
}

function coverMouseLeave() {
  setTimeout(() => {
    if (!wliHoverStatus.value) {
      coverHoverStatus.value = false
    }
  }, 1);
}

function videoMouseEnter(d: VideoCardData) {
  const vce = document.getElementById(`video-card-${d.vid}`) as HTMLVideoElement
  if (!vce.src) {
    vce.src = d.videoUrl
  }
  videoHoverStatus.value = true
  coverHoverStatus.value = false
}

function videoMouseLeave() {
  setTimeout(() => {
    if (!wliHoverStatus.value) {
      videoHoverStatus.value = false
      playStatus.value = false
      videoEle.value!.currentTime = 0
      videoEle.value?.pause()
    }
  }, 1);
}

function hoverInfoMouseLeave() {
  hoverInfoStatus.value = false
}

function wliMouseEnter() {
  wliHoverStatus.value = true
}

function wliMouseLeave() {
  wliHoverStatus.value = false
}

function watchLaterFc(vid: number) {
  const res = cmjs.biz.watchLater(vid)
  if (res === 1) {
    watchLaterStatus.value = true
  } else if (res === 0) {
    watchLaterStatus.value = false
  }
}
</script>

<style lang="less" scoped>
.video-card {
  position: relative;

  .vc-vpi {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}

.video-card .wli-container {
  padding: 5px;
  border-radius: 5px;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.video-card .wli-container .wli {
  pointer-events: none;
}

.video-card .cover {
  display: flex;
  /* el-image下如果有加载失败时的默认图片，由于v-if的注释会有空格，就会导致行间有间距 */
}

.video-card .cover,
.video-card .video {
  border-radius: 5px;
  cursor: pointer;
  background-color: black;
}

.video-card .hover-style-info-container {
  border-radius: 5px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  margin-bottom: 3.5px;
  position: absolute;
  top: 0;
}

.video-card .hover-style-info-container .hover-style-info {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.video-card .hover-style-info-container .hover-style-info .hover-style-info-up {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .inner-info {
  color: white;
  position: absolute;
  display: flex;
  pointer-events: none;
  bottom: 0;
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.video-card .info .title-row {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .info .title-row .title:hover {
  cursor: pointer;
  color: #409EFF;
}

.video-card .info .util-container {
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.video-card .info .util-container .util-row {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .info .util-container .util-row .util {
  align-items: center;
  cursor: default;
}

.video-card .info .util-container .util-row .util-hl:hover {
  cursor: pointer;
  color: #409EFF;
}

.video-card .info .util-container .diandiandian {
  display: none;
  cursor: pointer;
}

.video-card .info:hover .diandiandian {
  display: inline;
}

.video-card .info .util-container .diandiandian:hover {
  color: #409EFF;
}

.extra-container {
  font-size: 14px;
  margin: -7.5px;
}

.extra-container .extra {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.extra-container .extra:hover {
  cursor: pointer;
  color: #409EFF;
  background-color: #f4f4f5;
}
</style>