<template>
  <div class="pf-tip">每日凌晨4点更新数据（昨日凌晨4点到今日凌晨4点）</div>
  <el-tabs class="pf-container">
    <el-tab-pane label="视频数据">
      <el-row>
        <el-col :span="8">
          <StatisticCard title="播放量" icon="bofangshu" :total="data.video.total.playNum"
            :yesterday="data.video.yesterday.playNum"></StatisticCard>
        </el-col>
        <el-col :span="8">
          <StatisticCard title="评论数" icon="pinglun" :total="data.video.total.commentNum"
            :yesterday="data.video.yesterday.commentNum"></StatisticCard>
        </el-col>
        <el-col :span="8">
          <StatisticCard title="弹幕数" icon="danmushu" :total="data.video.total.danmuNum"
            :yesterday="data.video.yesterday.danmuNum"></StatisticCard>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <StatisticCard title="点赞数" icon="good" :total="data.video.total.likeNum"
            :yesterday="data.video.yesterday.likeNum"></StatisticCard>
        </el-col>
        <el-col :span="8">
          <StatisticCard title="投币数" icon="Bbi" :total="data.video.total.coinNum"
            :yesterday="data.video.yesterday.coinNum"></StatisticCard>
        </el-col>
        <el-col :span="8">
          <StatisticCard title="收藏数" icon="collection" :total="data.video.total.starNum"
            :yesterday="data.video.yesterday.starNum"></StatisticCard>
        </el-col>
      </el-row>
    </el-tab-pane>


    <el-tab-pane label="专栏数据">
      <el-row>
        <el-col :span="12">
          <StatisticCard title="阅读量" icon="read" :total="data.read.total.readNum"
            :yesterday="data.read.yesterday.readNum"></StatisticCard>
        </el-col>
        <el-col :span="12">
          <StatisticCard title="评论数" icon="pinglun" :total="data.read.total.commentNum"
            :yesterday="data.read.yesterday.commentNum"></StatisticCard>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <StatisticCard title="点赞数" icon="good" :total="data.read.total.likeNum"
            :yesterday="data.read.yesterday.likeNum"></StatisticCard>
        </el-col>
        <el-col :span="12">
          <StatisticCard title="收藏数" icon="collection" :total="data.read.total.starNum"
            :yesterday="data.read.yesterday.starNum"></StatisticCard>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import mockPlatformHome from "@/mock/platform/home.json"
import { useStore } from "@/store"
import StatisticCard from '@/components/common/StatisticCard.vue'

type Data = {
  video: {
    total: Video,
    yesterday: Video,
  },
  read: {
    total: Read,
    yesterday: Read,
  }
}

type Video = {
  playNum: number,
  commentNum: number,
  danmuNum: number,
  likeNum: number,
  coinNum: number,
  starNum: number,
}

type Read = {
  readNum: number,
  commentNum: number,
  likeNum: number,
  starNum: number,
}

const store = useStore()
store.setPlatformCurTitle("首页")

let data: Data = reactive(getData())

function getData() {
  //TODO api
  return mockPlatformHome
}
</script>

<style lang="less" scoped>
.pf-tip {
  width: 948px;
  height: 40px;
  position: absolute;
  font-size: 14px;
  color: #909399;
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>

<style>
.el-tabs__nav {
  z-index: inherit;
}

.el-tabs__nav-wrap::after {
  z-index: inherit;
}
</style>