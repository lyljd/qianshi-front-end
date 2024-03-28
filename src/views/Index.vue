<template>
  <div class="container">
    <div v-if="data.carousel.length > 0" class="rotation-chart">
      <Carousel :data="data.carousel" :height="420"></Carousel>
    </div>

    <div :style="{ width: data.carousel.length > 0 ? '560px' : '' }" class="recommendation">
      <VideoCard v-for="v in data.recommendation" :data="v" type="big"></VideoCard>
    </div>

    <VideoRefreshBtn></VideoRefreshBtn>
  </div>

  <div class="advertisement">
    <Advertisement :data="data.advertisement"></Advertisement>
  </div>

  <div v-for="r in data.regions" class="region">
    <div class="title-container"><span @click="cmjs.jump.region(r.name)" class="title">{{ r.title }}</span></div>
    <div class="region-row">
      <VideoCard v-for="v in r.videos" :data="v" type="big" class="card"></VideoCard>

      <VideoRefreshBtn></VideoRefreshBtn>
    </div>
  </div>

  <hr>

  <DeveloperInfo></DeveloperInfo>
</template>

<script setup lang="ts">
import Carousel from "@/components/common/Carousel.vue"
import VideoCard from "@/components/common/VideoCard.vue"
import VideoRefreshBtn from "@/components/common/VideoRefreshBtn.vue"
import Advertisement from "@/components/common/Advertisement.vue"
import DeveloperInfo from "@/components/once/DeveloperInfo.vue"
import Data from "@/mock/index.json"
import cmjs from '@/cmjs'

type carousel = {
  title: string,
  imgUrl: string,
  linkUrl: string,
}

type Advertisement = {
  type: string,
  content: string | Text,
  linkUrl: string,
}

type Text = {
  text: string,
  fontSize: number,
  fontColor: string,
  bgColor: string,
}

type Video = {
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
  vip: boolean
}

type Region = {
  title: string,
  name: string,
  videos: Video[],
}

type data = {
  carousel: carousel[],
  recommendation: Video[],
  advertisement: Advertisement,
  regions: Region[],
}

let data = ref(getData())

function getData(): data {
  return Data
}
</script>

<style lang="less" scoped>
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
  margin-right: 20px;
}

.recommendation {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.advertisement {
  width: 1140px;
  height: 100px;
  margin-inline: auto;
  margin-bottom: 20px;
}

.region {
  width: 1140px;
  margin-inline: auto;
  margin-bottom: 20px;
}

.region .title-container {
  font-size: 20px;
  margin-bottom: 5px;
}

.region .title:hover {
  color: #409EFF;
  cursor: pointer;
}

.region-row {
  width: 100%;
  height: 200px;
  display: flex;
}

.region-row .card {
  margin-left: 10px;
  margin-right: 10px;
}

.region-row .card:first-child {
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