<template>
  <el-tabs style="margin-left: -1px; margin-right: -1px;" type="border-card">
    <el-tab-pane :label="`视频 ${mockVideoTotalNum}`">
      <el-tabs v-if="mockVideoNum > 0" v-model="videoSortBy">
        <el-tab-pane label="最新发布" name="date"></el-tab-pane>
        <el-tab-pane label="最多播放" name="play"></el-tab-pane>
        <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
      </el-tabs>
      <div v-if="mockVideoNum > 0" class="video-card-container">
        <SmallVideoCard class="video-card" v-for="() in mockVideoNum" :data="mockVideo"></SmallVideoCard>
      </div>
      <el-pagination class="page" background layout="prev, pager, next" :page-size="25" :total="mockVideoTotalNum"
        :hide-on-single-page="true" />
      <el-empty v-if="mockVideoNum === 0" description="暂无视频" />
    </el-tab-pane>
    <el-tab-pane :label="`专栏 ${mockReadTotalNum}`">
      <el-tabs v-if="mockReadNum > 0" v-model="readSortBy">
        <el-tab-pane label="最新发布" name="date"></el-tab-pane>
        <el-tab-pane label="最多阅读" name="read"></el-tab-pane>
        <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
      </el-tabs>
      <el-empty description="敬请期待" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import SmallVideoCard from '../../components/SmallVideoCard.vue'

//<!--TODO
const mockVideo = {
  "vid": 0,
  "coverUrl": "",
  "playNum": 0,
  "duration": 0,
  "title": "标题",
  "date": 1686799558000
}
const mockVideoNum = 25
const mockVideoTotalNum = 35
const mockReadNum = 0
const mockReadTotalNum = 0
//-->

let videoSortBy = "date"
let readSortBy = "date"
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