<template>
  <el-tabs @tab-change="viewItemChange" v-model="viewItem" type="border-card" class="tabs">
    <el-tab-pane name="video" :label="`视频 ${mockVideoTotalNum}`">
      <el-tabs @tab-change="videoTabChange" v-if="mockVideoNum > 0" v-model="videoSortBy">
        <el-tab-pane label="最新发布" name="date"></el-tab-pane>
        <el-tab-pane label="最多播放" name="play"></el-tab-pane>
        <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
      </el-tabs>
      <div v-if="mockVideoNum > 0" class="video-card-container">
        <VideoCard v-for=" in mockVideoNum" :data="mockVideo" type="small" class="video-card"></VideoCard>
      </div>
      <el-pagination class="page" background layout="prev, pager, next" :page-size="25" :total="mockVideoTotalNum"
        :hide-on-single-page="true" />
      <el-empty v-if="mockVideoNum === 0" description="暂无视频" />
    </el-tab-pane>
    <el-tab-pane name="read" :label="`专栏 ${mockReadTotalNum}`">
      <el-tabs @tab-change="readTabChange" v-if="mockReadNum > 0" v-model="readSortBy">
        <el-tab-pane label="最新发布" name="date"></el-tab-pane>
        <el-tab-pane label="最多阅读" name="read"></el-tab-pane>
        <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
      </el-tabs>
      <el-empty description="敬请期待" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import VideoCard from '@/components/common/VideoCard.vue'

//<!--TODO
const mockVideo = {
  "vid": 1,
  "videoUrl": "",
  "coverUrl": "",
  "playNum": 0,
  "danmuNum": 0,
  "duration": 0,
  "title": "标题",
  "uid": 1,
  "nickname": "Bonnenult",
  "date": 1685599556000
}
let mockVideoNum = 25
const mockVideoTotalNum = 35
const mockReadNum = 0
const mockReadTotalNum = 0
//-->

let viewItem = "video"
let videoSortBy = "date"
let readSortBy = "date"
let videoList = "" //mock
let readList = "" //mock

setVideoList(videoSortBy)

function setVideoList(sortBy: string) {
  console.log("GET localhost:9000/api/u/1/video/" + sortBy)
  videoList = sortBy //mock
}

function setReadList(sortBy: string) {
  console.log("GET localhost:9000/api/u/1/read/" + sortBy)
  readList = readSortBy //mock
}

function viewItemChange(newViewItem: string) {
  switch (newViewItem) {
    case "video": {
      if (videoList === "") {
        setVideoList(videoSortBy)
      }
      break
    }
    case "read": {
      if (readList === "") {
        setReadList(readSortBy)
      }
      break
    }
  }
}

function videoTabChange(sortBy: string) {
  setVideoList(sortBy)
}

function readTabChange(sortBy: string) {
  setReadList(sortBy)
}
</script>

<style scoped>
.video-card-container {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-bottom: -15px;
}

.video-card-container .video-card {
  margin-right: 15px;
  margin-bottom: 15px;
}

.page {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.el-tabs__nav {
  z-index: inherit;
}

.el-tabs__nav-wrap::after {
  z-index: inherit;
}

.tabs,
.el-tabs--border-card>.el-tabs__header,
.el-tabs__nav-wrap {
  border-radius: 4px;
}
</style>