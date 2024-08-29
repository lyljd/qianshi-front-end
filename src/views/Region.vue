<template>
  <div class="r-container">
    <div class="region-name">{{ regionVideos.name }}</div>

    <div class="sort-row">
      <span :style="{ cursor: regionLoading ? 'not-allowed' : 'pointer' }" :class="{ highlight: sort === 'popular' }"
        @click="switchSort('popular')">最受欢迎 <span v-show="sort === 'popular' && !regionLoading" class="num">{{
      regionVideos.total }}</span></span>
      <span :style="{ cursor: regionLoading ? 'not-allowed' : 'pointer' }" :class="{ highlight: sort === 'play' }"
        @click="switchSort('play')">最多播放 <span v-show="sort === 'play' && !regionLoading" class="num">{{
      regionVideos.total }}</span></span>
      <span :style="{ cursor: regionLoading ? 'not-allowed' : 'pointer' }" :class="{ highlight: sort === 'latest' }"
        @click="switchSort('latest')">最新发布 <span v-show="sort === 'latest' && !regionLoading" class="num">{{
      regionVideos.total }}</span></span>
      <span :style="{ cursor: regionLoading ? 'not-allowed' : 'pointer' }" :class="{ highlight: sort === 'star' }"
        @click="switchSort('star')">最多收藏 <span v-show="sort === 'star' && !regionLoading" class="num">{{
      regionVideos.total }}</span></span>
    </div>

    <div class="regions" v-if="regionLoading || regionVideos.videos.length">
      <VideoCard v-if="regionLoading" v-for="_ in 12" :loading="true" :data="{} as Video" type="big"></VideoCard>

      <VideoCard v-else v-for="v in regionVideos.videos" :data="v" type="big"></VideoCard>
    </div>
    <div v-else>
      <el-empty description="暂无视频"></el-empty>
    </div>

    <el-pagination :total="regionVideos.total" v-model:current-page="page" :default-page-size="12"
      :disabled="regionLoading" class="flex-center" hide-on-single-page background layout="prev, pager, next" />
  </div>
</template>

<script setup lang="ts">
import VideoCard from "@/components/common/VideoCard.vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import cmjs from '@/cmjs'
import * as VideoAPI from '@/api/video'

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
  total: number
  videos: Video[]
}

let regionLoading = ref(false)

const route = useRoute()

let slug = ref<string>(route.params.slug as string)
let timestamp = ref(cmjs.util.getCurBETimestamp())
let page = ref(1)
let sort = ref<'popular' | 'play' | 'latest' | 'star'>('popular')
let regionVideos = ref<Region>({ name: '加载中...', total: 0, videos: [] })
setRegionVideos()

watch(page, () => {
  setRegionVideos()
})

onBeforeRouteUpdate((to, from, next) => {
  slug.value = to.params.slug as string
  timestamp.value = cmjs.util.getCurBETimestamp()
  page.value = 1
  sort.value = 'popular'
  regionVideos.value.name = '加载中...'
  setRegionVideos()
  next()
})

function setRegionVideos() {
  regionLoading.value = true
  VideoAPI.getRegionRecommends(slug.value, sort.value, timestamp.value, page.value)
    .then((res) => {
      if (res.code !== 0) {
        regionVideos.value.name = res.msg
        return
      }

      regionVideos.value = res.data
      document.title = `${regionVideos.value.name} - 浅时`
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      regionLoading.value = false
    })
}

function switchSort(newSort: 'popular' | 'play' | 'latest' | 'star') {
  if (sort.value === newSort || regionLoading.value) {
    return
  }

  sort.value = newSort
  setRegionVideos()
}
</script>

<style lang="less" scoped>
.r-container {
  width: 1140px;
  margin-top: 77px;
  margin-bottom: 20px;
  margin-inline: auto;

  .region-name {
    font-size: 25px;
    cursor: default;
    margin-bottom: 20px;
  }

  .sort-row {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;

    >* {
      color: #73767a;
      padding: 5px 10px;
      border-radius: 5px;
      display: flex;
      gap: 5px;
      align-items: center;

      .num {
        font-size: 14px;
      }
    }

    >*:hover {
      color: #409EFF;
    }

    .highlight {
      background-color: #d9ecff;
      color: #409EFF;
    }
  }

  .regions {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }
}
</style>