<template>
  <el-backtop :right="50" :bottom="50" />

  <div class="container">
    <div class="rotation-chart">
      <Carousel></Carousel>
    </div>

    <div class="recommendation">
      <div class="row">
        <VideoCard :data="video" class="mr10 mb10"></VideoCard>
        <VideoCard :data="video" class="ml10 mb10"></VideoCard>
      </div>
      <div class="row">
        <VideoCard :data="video" class="mr10 mt10"></VideoCard>
        <VideoCard :data="video" class="ml10 mt10"></VideoCard>
      </div>
    </div>

    <VideoRefreshBtn></VideoRefreshBtn>
  </div>

  <div class="advertisement">
    <Advertisement></Advertisement>
  </div>

  <div v-for="(item) in 4" class="channel">
    <div class="title-container"><span class="title">频道{{ item }}</span></div>
    <div class="channel-row">
      <VideoCard :data="video" class="card" v-for="() in 4"></VideoCard>

      <VideoRefreshBtn></VideoRefreshBtn>
    </div>
  </div>

  <hr>

  <DeveloperInfo></DeveloperInfo>
</template>

<script setup lang="ts">
import Carousel from "../components/Carousel.vue"
import VideoCard from "../components/VideoCard.vue"
import VideoRefreshBtn from "../components/VideoRefreshBtn.vue"
import Advertisement from "../components/Advertisement.vue"
import DeveloperInfo from "../components/DeveloperInfo.vue"

let video = {
  "vid": 1,
  "coverUrl": "",
  "playNum": 0,
  "danmuNum": 0,
  "duration": 0,
  "title": "标题",
  "uid": 1,
  "nickname": "Bonnenult",
  "date": 1685599556000
}
</script>

<style scoped>
.container {
  width: 1140px;
  height: 420px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-inline: auto;
  display: flex;
}

.rotation-chart {
  width: 560px;
  height: 100%;
  margin-right: 10px;
}

.recommendation {
  width: 560px;
  height: 100%;
  margin-left: 10px;
}

.row {
  display: flex;
}

.advertisement {
  width: 1140px;
  height: 100px;
  margin-inline: auto;
  margin-bottom: 20px;
}

.channel {
  width: 1140px;
  margin-inline: auto;
  margin-bottom: 20px;
}

.channel .title-container {
  font-size: 20px;
  margin-bottom: 5px;
}

.channel .title:hover {
  color: #409EFF;
  cursor: pointer;
}

.channel-row {
  width: 100%;
  height: 200px;
  display: flex;
}

.channel-row .card {
  margin-left: 10px;
  margin-right: 10px;
}

.channel-row .card:first-child {
  margin-left: 0px;
}

hr {
  width: 1140px;
  margin-bottom: 20px;
  background-color: #dedfe0;
  height: 1px;
  border: none;
}
</style>