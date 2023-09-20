<template>
  <div class="pf-tip">每日凌晨4点更新昨日数据</div>
  <el-tabs class="pf-container">
    <el-tab-pane label="视频数据">
      <el-row>
        <el-col :span="8">
          <el-statistic :value="pfHome.video.playNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-bofangshu">播放量</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="8">
          <el-statistic :value="pfHome.video.commentNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-pinglun">评论数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="8">
          <el-statistic :value="pfHome.video.danmuNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-danmushu">弹幕数</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-statistic :value="pfHome.video.likeNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-good">点赞数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="6">
          <el-statistic :value="pfHome.video.coinNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-Bbi">投币数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="6">
          <el-statistic :value="pfHome.video.starNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-collection">收藏数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="6">
          <el-statistic :value="pfHome.video.shareNum" :value-style="{ color: '#E6A23C' }"><template #title>
              <span class="iconfont el-icon-fenxiang">分享数</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-tab-pane>


    <el-tab-pane label="专栏数据">
      <el-row>
        <el-col :span="12">
          <el-statistic :value="pfHome.read.readNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-read">阅读量</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="12">
          <el-statistic :value="pfHome.read.commentNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-pinglun">评论数</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-statistic :value="pfHome.read.likeNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-good">点赞数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="8">
          <el-statistic :value="pfHome.read.starNum" :value-style="{ color: '#E6A23C' }">
            <template #title>
              <span class="iconfont el-icon-collection">收藏数</span>
            </template>
          </el-statistic>
        </el-col>

        <el-col :span="8">
          <el-statistic :value="pfHome.read.shareNum" :value-style="{ color: '#E6A23C' }"><template #title>
              <span class="iconfont el-icon-fenxiang">分享数</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import mockPlatformHome from "@/mock/platform/home.json"
import { useStore } from "@/store"

type PlatformHome = {
  video: {
    playNum: number,
    commentNum: number,
    danmuNum: number,
    likeNum: number,
    coinNum: number,
    starNum: number,
    shareNum: number
  },
  read: {
    readNum: number,
    commentNum: number,
    likeNum: number,
    starNum: number,
    shareNum: number
  }
}

const store = useStore()
store.setPlatformCurTitle("首页")

let pfHome: PlatformHome = reactive(getPlatformHome())

function getPlatformHome() {
  return mockPlatformHome //TODO
}
</script>

<style scoped>
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

.pf-container .el-statistic {
  text-align: center;
  border-radius: 10px;
  margin: 10px;
  background-color: #f7fcfe;
  cursor: default;
  padding-top: 10px;
  padding-bottom: 10px;
}

.pf-container .el-statistic:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
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