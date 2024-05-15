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
        <span class="region" @click="cmjs.jump.region(data.regionSlug)">{{ data.regionName }}</span>
      </el-descriptions-item>

      <el-descriptions-item label="标签">
        <VideoTag :tags="(data.tags as string[])"></VideoTag>
      </el-descriptions-item>

      <el-descriptions-item label="简介">
        <div class="intro">{{ data.intro }}</div>
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
  regionName: string,
  regionSlug: string,
  tags: string[],
  intro: string,
  empower: boolean
}

defineProps<{
  title: string
  data: Video
}>()
</script>

<style lang="less" scoped>
.vd-container {
  .region {
    cursor: pointer;
  }

  .region:hover {
    color: #409EFF;
    text-decoration: underline;
  }

  .intro {
    white-space: pre-wrap;
  }
}
</style>

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