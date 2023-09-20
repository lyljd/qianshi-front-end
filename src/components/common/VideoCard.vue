<template>
  <div class="video-card">
    <el-tooltip content="稍后再看" :show-arrow="false" offset="3" placement="bottom-end" :enterable="false" :hide-after="0">
      <div v-show="coverHoverStatus || videoHoverStatus" @mouseenter="laterMouseEnter" @mouseleave="laterMouseLeave"
        @click="watchLater(data.vid)" class="later-container">
        <span v-show="!hasSeeLater" class="iconfont later-icon el-icon-shaohou animate__animated animate__fadeIn"></span>
        <span v-show="hasSeeLater" class="iconfont later-icon el-icon-dui animate__animated animate__fadeIn"></span>
      </div>
    </el-tooltip>

    <el-image v-show="!playStatus" @mouseenter="coverMouseEnter" @mouseleave="coverMouseLeave"
      @click="cmjs.jump.video(data.vid)" class="cover" :src="data.coverUrl">
      <template #error>
        <div @click="cmjs.jump.video(data.vid)" style="font-size: 16px;" class="default">封面加载失败</div>
      </template>
    </el-image>

    <video v-show="playStatus" @mouseenter="videoMouseEnter" @mouseleave="videoMouseLeave"
      @click="cmjs.jump.video(data.vid)" @contextmenu="(event: any) => { event.preventDefault() }" ref="videoEle"
      :src="data.videoUrl" muted disablePictureInPicture class="video"></video>

    <div v-show="!playStatus" class="info">
      <span>
        <span class="iconfont el-icon-bofangshu icon"></span>
        {{ cmjs.fmt.numWE(data.playNum) }}
        <span class="danmushu">
          <span class="iconfont el-icon-danmushu icon"></span>
          {{ cmjs.fmt.numWE(data.danmuNum) }}
        </span>
      </span>
      <span class="duration">{{ cmjs.fmt.videoDuration(data.duration) }}</span>
    </div>

    <div class="content">
      <div class="title-container"><span @click="cmjs.jump.video(data.vid)" class="title">{{ data.title }}</span></div>
      <div class="up-time-container">
        <div @click="cmjs.jump.user(data.uid)" class="up-time-text">
          <span :title="data.nickname + ' · ' + cmjs.fmt.tsYRichTmpl(data.date, 'MM-DD')"
            class="up-time-text-span"><span style="font-size: 14px;" class="iconfont el-icon-UPzhu icon"></span>
            {{ data.nickname }} · {{ cmjs.fmt.tsYRichTmpl(data.date, "MM-DD") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'

defineProps<{
  data: {
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

function watchLater(vid: number) {
  const res = cmjs.biz.watchLater(vid)
  if (res === 1) {
    hasSeeLater.value = true
  } else if (res === 0) {
    hasSeeLater.value = false
  }
}
</script>

<style scoped>
.video-card {
  width: 270px;
  height: 200px;
}

.video-card .cover,
.video-card .video {
  width: 270px;
  height: 151.88px;
  border-radius: 5px;
  cursor: pointer;
  background-color: black;
}

.video-card .info {
  width: 260px;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  margin-top: -22px;
  margin-left: 5px;
  margin-right: 5px;
  color: white;
  position: absolute;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.video-card .info .icon {
  font-size: 14px;
}

.video-card .info .danmushu {
  margin-left: 10px;
}

.video-card .content {
  height: 43.125px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2px;
}

.video-card .content .title-container {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .title:hover {
  font-size: 16px;
  cursor: pointer;
  color: #409EFF;
}

.video-card .up-time-container {
  color: #909399;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .up-time-text {
  display: flex;
  align-items: center;
}

.video-card .up-time-text-span {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.video-card .up-time-text-span:hover {
  color: #409EFF;
}

.video-card .up-time-container .icon {
  font-size: 12px;
}

.later-container {
  position: absolute;
  z-index: 1;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  padding: 5px;
  margin-left: 235px;
  margin-top: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.later-container .later-icon {
  font-size: 20px;
  font-weight: bold;
  height: 21px;
  margin-top: -1px;
  pointer-events: none;
}
</style>