<template>
  <div class="container">
    <el-skeleton animated :loading="(carouselLoading || recommendLoading) && firstLoading"
      class="carousel-skeleton-box">
      <template #template>
        <el-skeleton-item variant="image" class="carousel-skeleton-item " />
      </template>

      <div v-if="data.carousel.length > 0" class="rotation-chart">
        <Carousel :data="data.carousel" :height="420"></Carousel>
      </div>
    </el-skeleton>

    <div
      :style="{ width: !((carouselLoading || recommendLoading) && firstLoading) && data.carousel.length > 0 ? '560px' : '' }"
      class="recommendation">
      <VideoCard v-for="v in recommendVideos" :loading="carouselLoading || recommendLoading" :data="v" type="big">
      </VideoCard>
    </div>

    <VideoRefreshBtn
      v-if="(data.carousel.length > 0 && recommendVideos.length === 4) || (data.carousel.length === 0 && recommendVideos.length === 8)"
      @click="refreshRecommend" :disabled="carouselLoading || recommendLoading"></VideoRefreshBtn>
  </div>

  <div v-for="r in regionVideos" class="region">
    <div v-if="r.videos.length > 0">
      <div class="title-container"><span @click="r.slug !== '' ? cmjs.jump.region(r.slug) : null" class="title">{{
      r.name
    }}</span></div>
      <div class="region-row">
        <VideoCard v-for="v in r.videos" :loading="regionLoadings.includes(r.slug)" :data="v" type="big" class="card">
        </VideoCard>

        <VideoRefreshBtn v-if="r.videos.length === 4" @click="refreshRecommendRegionVideo(r.slug)"
          :disabled="regionLoadings.includes(r.slug)"></VideoRefreshBtn>
      </div>
    </div>
  </div>

  <hr>

  <DeveloperInfo></DeveloperInfo>
</template>

<script setup lang="ts">
import Carousel from "@/components/common/Carousel.vue"
import VideoCard from "@/components/common/VideoCard.vue"
import VideoRefreshBtn from "@/components/common/VideoRefreshBtn.vue"
import DeveloperInfo from "@/components/once/DeveloperInfo.vue"
import MockData from "@/mock/index.json"
import cmjs from '@/cmjs'
import * as VideoAPI from '@/api/video'

type carousel = {
  title: string,
  imgUrl: string,
  linkUrl: string,
}

type Video = {
  vid: number
  videoUrl: string
  coverUrl: string
  playNum: number
  title: string
  uid: number
  nickname: string
  date: number
  vip: boolean
}

type Region = {
  name: string
  slug: string
  videos: Video[]
}

type Data = {
  carousel: carousel[],
}

let firstLoading = ref(true) // 解决刷新推荐视频时轮播图模块依然会进入加载的问题
let carouselLoading = ref(false)
let recommendLoading = ref(false)
let regionLoadings = ref<string[]>([])

let data = ref<Data>({ carousel: [] })
setData()
let recommendVideos = ref<Video[]>([{} as Video, {} as Video, {} as Video, {} as Video])
setRecommendVideos()
let regionVideos = ref<Region[]>([{ name: '分区加载中...', slug: '', videos: [{} as Video, {} as Video, {} as Video, {} as Video] }])
setRegionVideos()

function setData() {
  carouselLoading.value = true
  setTimeout(() => {
    data.value = MockData
    carouselLoading.value = false
  }, 1000)
}

function setRecommendVideos() {
  recommendLoading.value = true
  VideoAPI.getRecommendHomeVideo()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      recommendVideos.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      recommendLoading.value = false
    })
}

function setRegionVideos() {
  regionLoadings.value = ['']
  VideoAPI.getRecommendRegionsVideo()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      regionVideos.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      regionLoadings.value = []
    })
}

function refreshRecommend() {
  firstLoading.value = false
  setRecommendVideos()
}

function refreshRecommendRegionVideo(slug: string) {
  regionLoadings.value.push(slug)
  VideoAPI.refreshRecommendRegionVideo(slug)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      let idx = -1
      for (let i = 0; i < regionVideos.value.length; i++) {
        const rv = regionVideos.value[i]
        if (rv.slug === slug) {
          idx = i
        }
      }

      regionVideos.value[idx].videos = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      const idx = regionLoadings.value.indexOf(slug)
      regionLoadings.value.splice(idx)
    })
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

.carousel-skeleton-box {
  width: 560px;
  margin-right: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .carousel-skeleton-item {
    width: 560px;
    height: 420px;
    border-radius: 5px;
  }
}

.recommendation {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
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