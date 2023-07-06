<template>
  <div class="video-card">
    <el-image @click="common.ToVideo(data.vid)" class="cover" :src="data.coverUrl">
      <template #error>
        <div @click="common.ToVideo(data.vid)" class="default">封面加载失败</div>
      </template>
    </el-image>
    <div class="duration">{{ common.videoTimeFormatterHMS(data.duration) }}</div>
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
    coverUrl: string
    playNum: number
    duration: number
    title: string
    date: number
  }
}>()
</script>

<style scoped>
.video-card {
  width: 210px;
}

.video-card .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
}

.video-card .duration {
  color: white;
  position: absolute;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  margin-top: -22px;
  cursor: pointer;
  width: 205px;
  text-align: right;
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
</style>