<template>
  <div class="vd-container">
    <el-descriptions :title="title" :column="1" border>
      <template v-if="data.vid" #extra>
        <el-button v-blur @click="cmjs.jump.video(data.vid)" type="primary" size="small">打开视频页</el-button>
      </template>

      <el-descriptions-item label="标题">
        {{ data.title }}
      </el-descriptions-item>

      <el-descriptions-item label="封面">
        <Image :url="data.coverUrl" :w="210" :h="118.13" preview round></Image>
      </el-descriptions-item>

      <el-descriptions-item label="视频">
        <el-button v-blur @click="store.openPVWindow(data.videoUrl)">预览</el-button>
      </el-descriptions-item>

      <el-descriptions-item label="分区">
        {{ convertRegionName(data.region as string) }}
      </el-descriptions-item>

      <el-descriptions-item label="标签">
        <VideoTag :tags="(data.tags as string[])"></VideoTag>
      </el-descriptions-item>

      <el-descriptions-item label="简介">
        {{ data.intro }}
      </el-descriptions-item>

      <el-descriptions-item label="权益声明">
        {{ data.empower ? "未经作者授权，禁止转载" : "" }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import VideoTag from "@/components/common/VideoTag.vue"
import cmjs from '@/cmjs'

const store = useStore()

type Video = {
  vid?: number,
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean
}

defineProps<{
  title: string
  data: Video
}>()

function convertRegionName(code: string): string {
  switch (code) {
    case "anime": {
      return "番剧"
    }
    case "game": {
      return "游戏"
    }
    case "music": {
      return "音乐"
    }
    case "tech": {
      return "科技"
    }
    case "other": {
      return "其它"
    }
  }
  return "未知"
}
</script>

<style>
.vd-container .el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 81px !important;
}

.vd-container .el-descriptions__header {
  margin-bottom: 3px;
}

.vd-container .el-descriptions__title {
  align-self: flex-end;
}
</style>