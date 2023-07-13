<template>
  <div class="video-card">
    <el-tooltip content="稍后再看" :show-arrow="false" offset="3" placement="bottom-end" :enterable="false" :hide-after="0">
      <div v-show="coverHoverStatus || videoHoverStatus" @mouseenter="laterMouseEnter" @mouseleave="laterMouseLeave"
        @click="seeLater(data.vid)" class="later-container">
        <span v-show="!hasSeeLater" class="iconfont later-icon el-icon-shaohou animate__animated animate__fadeIn"></span>
        <span v-show="hasSeeLater" class="iconfont later-icon el-icon-dui animate__animated animate__fadeIn"></span>
      </div>
    </el-tooltip>

    <el-image v-show="!playStatus" @mouseenter="coverMouseEnter" @mouseleave="coverMouseLeave"
      @click="common.ToVideo(data.vid)" class="cover" :src="data.coverUrl">
      <template #error>
        <div @click="common.ToVideo(data.vid)" class="default">封面加载失败</div>
      </template>
    </el-image>

    <video v-show="playStatus" @mouseenter="videoMouseEnter" @mouseleave="videoMouseLeave"
      @click="common.ToVideo(data.vid)" @contextmenu="(event: any) => { event.preventDefault() }" ref="videoEle"
      :src="data.videoUrl" muted disablePictureInPicture class="video"></video>

    <div v-show="!playStatus" class="duration">{{ common.videoTimeFormatterHMS(data.duration) }}</div>

    <div class="content">
      <div class="title-container"><span @click="common.ToVideo(data.vid)" class="title">{{ data.title }}</span></div>
      <div class="num-time-container">
        <span class="iconfont el-icon-bofangshu icon"></span>
        <span>{{ common.numFormatterW(data.playNum) }}</span>
        <span style="margin-left: 10px;">{{ common.timestampFormatterRichExcludeHM(data.date) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from "../common"

defineProps<{
  data: {
    vid: number
    videoUrl: string
    coverUrl: string
    playNum: number
    duration: number
    title: string
    date: number
  }
}>()

const videoEle = ref<HTMLVideoElement>()

let playStatus = ref(false)
let coverHoverStatus = ref(false)
let videoHoverStatus = ref(false)
let laterHoverStatus = ref(false)
let hasSeeLater = ref(false)

function coverMouseEnter() {
  coverHoverStatus.value = true
  videoHoverStatus.value = false
  setTimeout(() => {
    if (coverHoverStatus.value) {
      playStatus.value = true
      videoEle.value?.play()
    }
  }, 1000)
}

function coverMouseLeave() {
  setTimeout(() => {
    if (!laterHoverStatus.value) {
      coverHoverStatus.value = false
    }
  }, 1);
}

function videoMouseEnter() {
  videoHoverStatus.value = true
  coverHoverStatus.value = false
}

function videoMouseLeave() {
  setTimeout(() => {
    if (!laterHoverStatus.value) {
      videoHoverStatus.value = false
      playStatus.value = false
      videoEle.value!.currentTime = 0
      videoEle.value?.pause()
    }
  }, 1);
}

function laterMouseEnter() {
  laterHoverStatus.value = true
}

function laterMouseLeave() {
  laterHoverStatus.value = false
}

function seeLater(vid: number) {
  if (!hasSeeLater.value) {
    common.seeLater(vid)
  } else {
    common.cancelSeeLater(vid)
  }
  hasSeeLater.value = !hasSeeLater.value
}
</script>

<style scoped>
.video-card {
  width: 210px;
}

.video-card .cover,
.video-card .video {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
  background-color: black;
}

.video-card .duration {
  color: white;
  position: absolute;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  margin-top: -22px;
  width: 205px;
  text-align: right;
  pointer-events: none;
}

.video-card .content {
  display: flex;
  flex-direction: column;
  margin-top: 3px;
}

.video-card .content .title-container {
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .title:hover {
  color: #409EFF;
}

.video-card .num-time-container {
  color: #909399;
  margin-top: 3px;
  font-size: 12px;
  cursor: default;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .num-time-container .icon {
  font-size: 12px;
}

.later-container {
  position: absolute;
  z-index: 1;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 5px;
  margin-left: 180px;
  margin-top: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.later-container .later-icon {
  font-size: 15px;
  font-weight: bold;
  height: 16px;
  margin-top: -1px;
  pointer-events: none;
}
</style>