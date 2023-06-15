<template>
  <div class="video-card">
    <el-image @click="common.ToVideo(data.vid)" class="cover" :src="data.coverUrl">
      <template #error>
        <div @click="common.ToVideo(data.vid)" class="default">封面加载失败</div>
      </template>
    </el-image>
    <div @click="common.ToVideo(data.vid)" class="info">
      <span>
        <span class="iconfont el-icon-bofangshu icon"></span>
        {{ common.numFormatterW(data.playNum) }}
        <span class="danmushu">
          <span class="iconfont el-icon-danmushu icon"></span>
          {{ common.numFormatterW(data.danmuNum) }}
        </span>
      </span>
      <span class="duration">{{ common.videoTimeFormatterHMS(data.duration) }}</span>
    </div>
    <div class="content">
      <div class="title-container"><span @click="common.ToVideo(data.vid)" class="title">{{ data.title }}</span></div>
      <div class="up-time-container">
        <div @click="common.ToUser(data.uid)" class="up-time-text">
          <span :title="data.nickname + ' · ' + common.timestampFormatterMD(data.date)" class="up-time-text-span"><span
              style="font-size: 14px;" class="iconfont el-icon-UPzhu icon"></span>
            {{ data.nickname }} · {{ common.timestampFormatterMD(data.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from "../common"

defineProps<{
  data: {
    vid: number
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
</script>

<style scoped>
.video-card {
  width: 270px;
  height: 200px;
}

.video-card .cover {
  width: 270px;
  height: 151.875px;
  border-radius: 5px;
  cursor: pointer;
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
  cursor: pointer;
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
</style>