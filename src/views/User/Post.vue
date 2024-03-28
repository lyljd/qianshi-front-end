<template>
  <el-tabs @tab-change="viewItemChange" v-model="viewItem" type="border-card" class="tabs">
    <el-tab-pane name="video" :label="`视频 ${pn.videoNum}`">
      <div v-if="pv">
        <div v-if="pv.total > 0">
          <el-tabs @tab-change="videoTabChange" v-model="videoSortBy">
            <el-tab-pane label="最新发布" name="date"></el-tab-pane>
            <el-tab-pane label="最多播放" name="play"></el-tab-pane>
            <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
          </el-tabs>

          <div class="video-card-container">
            <VideoCard v-for="v in pv.videos" :data="v" type="small" class="video-card"></VideoCard>
          </div>

          <el-pagination class="page" v-model:current-page="videoCurPage" background layout="prev, pager, next"
            :page-size="25" :total="pn.videoNum" hide-on-single-page />
        </div>

        <el-empty v-else description="暂无视频" />
      </div>
    </el-tab-pane>

    <el-tab-pane name="read" :label="`专栏 ${pn.readNum}`">
      <div v-if="pr">
        <div v-if="pr.total > 0">
          <el-tabs @tab-change="readTabChange" v-model="readSortBy">
            <el-tab-pane label="最新发布" name="date"></el-tab-pane>
            <el-tab-pane label="最多阅读" name="read"></el-tab-pane>
            <el-tab-pane label="最多收藏" name="star"></el-tab-pane>
          </el-tabs>

          <!-- pr.reads渲染 -->

          <el-pagination class="page" v-model:current-page="readCurPage" background layout="prev, pager, next"
            :page-size="25" :total="pn.readNum" hide-on-single-page />
        </div>

        <el-empty v-else description="暂无专栏" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import VideoCard from '@/components/common/VideoCard.vue'
import PN from '@/mock/user/post/num.json'
import PV from '@/mock/user/post/video.json'
import PR from '@/mock/user/post/read.json'
import { useStore } from '@/store'

type Num = {
  videoNum: number,
  readNum: number
}

type PostVideo = {
  total: number,
  videos: Video[]
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

type PostRead = {
  total: number,
  reads: Read[]
}

type Read = {
}

const store = useStore()

let viewItem = "video"
let videoSortBy = "date"
let readSortBy = "date"
let videoCurPage = ref(1)
let readCurPage = ref(1)

let pn = ref<Num>(getNum())
let pv = ref<PostVideo>()
let pr = ref<PostRead>()
setPV(videoSortBy)

watch(videoCurPage, newVal => {
  setPV(videoSortBy)
})
watch(readCurPage, newVal => {
  setPR(readSortBy)
})

function getNum(): Num {
  // TODO api
  return PN
}

function setPV(sortBy: string) {
  // TODO api
  pv.value = PV
  console.log(`获取【视频-${sortBy}】第${videoCurPage.value}页数据`)
  pn.value.videoNum = pv.value.total
  store.setUserMenuPostNum(pv.value.total + (pr.value ? pr.value.total : 0))
}

function setPR(sortBy: string) {
  // TODO api
  pr.value = PR
  console.log(`获取【专栏-${sortBy}】第${videoCurPage.value}页数据`)
  pn.value.readNum = pr.value.total
  store.setUserMenuPostNum(pr.value.total + (pv.value ? pv.value.total : 0))
}

function viewItemChange(newViewItem: string) {
  switch (newViewItem) {
    case "video": {
      if (pv.value === undefined) {
        setPV(videoSortBy)
      }
      break
    }
    case "read": {
      if (pr.value === undefined) {
        setPR(readSortBy)
      }
      break
    }
  }
}

function videoTabChange(sortBy: string) {
  if (videoCurPage.value === 1) {
    setPV(sortBy)
  } else {
    videoCurPage.value = 1
  }
}

function readTabChange(sortBy: string) {
  if (readCurPage.value === 1) {
    setPR(sortBy)
  } else {
    readCurPage.value = 1
  }
}
</script>

<style lang="less" scoped>
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