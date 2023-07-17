<template>
  <div class="vd-container">
    <el-descriptions :title="title" :column="1" border>
      <el-descriptions-item label="标题">
        {{ data.title }}
      </el-descriptions-item>

      <el-descriptions-item label="封面">
        <el-image class="cover" :src="data.coverUrl">
          <template #error>
            <div class="default">封面加载失败</div>
          </template>
        </el-image>
      </el-descriptions-item>

      <el-descriptions-item label="视频">
        <el-button @click="store.openPVWindow(data.videoUrl)">预览</el-button>
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
import { useStore } from "../store"
import VideoTag from "../components/VideoTag.vue"

const store = useStore()

type video = {
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
  data: video
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

<style scoped>
.vd-container .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  vertical-align: top;
}
</style>

<style>
.el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 81px !important;
}
</style>