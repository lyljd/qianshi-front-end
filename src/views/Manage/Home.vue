<template>
  <div class="m-container">
    <el-card>
      <div class="avatar-container">
        <div class="left">
          <el-avatar size="large" class="avatar" :src="cmjs.cache.getCookie('avatar')" @error="true">
            <img src="/default-avatar.png" />
          </el-avatar>
        </div>
        <div class="right">
          <div class="nickname">{{ getCurTimePeriod() }}好，<span class="normallight">{{
            `${hi.nickname}` }}</span></div>
          <div class="power">您的权限等级为：<span class="highlight">{{ store.power }}</span></div>
        </div>
      </div>
    </el-card>

    <div style="display: flex; justify-content: space-between;">
      <el-card style="width: calc(50% - 10px);">
        <template #header>
          <div class="card-header">
            <div class="title">
              <span class="iconfont el-icon-review icon"></span>
              审批
            </div>
            <el-button v-blur v-if="hi.review.video !== 0 || hi.review.read !== 0 || hi.review.title !== 0"
              @click="processReview">前往处理</el-button>
          </div>
        </template>
        <div v-if="hi.review.video !== 0" class="row"><span class="highlight">{{ hi.review.video }}</span>个<span
            class="normallight">视频</span>待处理</div>
        <div v-if="hi.review.read !== 0" class="row"><span class="highlight">{{ hi.review.read }}</span>个<span
            class="normallight">专栏</span>待处理</div>
        <div v-if="hi.review.title !== 0" class="row"><span class="highlight">{{ hi.review.title }}</span>个<span
            class="normallight">个人认证</span>待处理</div>
        <div v-if="hi.review.video === 0 && hi.review.read === 0 && hi.review.title === 0" class="row free">暂无待处理的审批</div>
      </el-card>

      <el-card style="width: calc(50% - 10px);">
        <template #header>
          <div class="card-header">
            <div class="title">
              <span class="iconfont el-icon-feedback icon"></span>
              反馈
            </div>
            <el-button v-blur v-if="hi.feedback.msg !== 0 || hi.feedback.appeal !== 0 || hi.feedback.report !== 0"
              @click="processFeedback">前往处理</el-button>
          </div>
        </template>
        <div v-if="hi.feedback.appeal !== 0" class="row"><span class="highlight">{{ hi.feedback.appeal
        }}</span>个<span class="normallight">申诉</span>待处理</div>
        <div v-if="hi.feedback.msg !== 0" class="row"><span class="highlight">{{ hi.feedback.msg
        }}</span>个<span class="normallight">站内留言</span>待处理</div>
        <div v-if="hi.feedback.report !== 0" class="row"><span class="highlight">{{ hi.feedback.report }}</span>个<span
            class="normallight">举报</span>待处理</div>
        <div v-if="hi.feedback.msg === 0 && hi.feedback.appeal === 0 && hi.feedback.report === 0" class="row free">
          暂无待处理的反馈</div>
      </el-card>
    </div>

    <el-card v-if="store.power >= 5">
      <template #header>
        <div class="card-header">
          <div class="title">
            <span class="iconfont el-icon-statistic icon"></span>
            今日统计
          </div>
          <el-button v-blur @click="pushToNewPage('/manage/statistic')">查看更多</el-button>
        </div>
      </template>
      <div class="row">总访问量：<span class="highlight">{{ hi.statistic!.total }}</span></div>
      <div class="row">独立访问量：<span class="highlight">{{ hi.statistic!.unique }}</span>（用户：<span
          class="highlight">49</span>，游客：<span class="highlight">8</span>）</div>
      <div class="row"><span class="normallight">视频</span>投稿量：<span class="highlight">{{ hi.statistic!.video }}</span>
      </div>
      <div class="row"><span class="normallight">专栏</span>投稿量：<span class="highlight">{{ hi.statistic!.read }}</span>
      </div>
    </el-card>

    <el-card v-if="store.power >= 4">
      <template #header>
        <div class="card-header">
          <div class="title">
            <span class="iconfont el-icon-kuaijierukou icon"></span>
            快捷入口
          </div>
        </div>
      </template>
      <el-button v-blur @click="store.openSMSWindow()">
        <span class="iconfont el-icon-message"></span>
        <span>发送系统消息</span>
      </el-button>

      <el-button v-blur @click="openSCWindow">
        <span class="iconfont el-icon-carousel"></span>
        <span>设置轮播图</span>
      </el-button>

      <el-button v-blur @click="openSAWindow">
        <span class="iconfont el-icon-guanggao"></span>
        <span>设置广告</span>
      </el-button>

      <el-button v-blur @click="openIPBanWindow">
        <span class="iconfont el-icon-ip"></span>
        <span>IP封禁</span>
      </el-button>

      <el-button v-blur v-if="store.power >= 5" @click="cmjs.prompt.info('敬请期待')">
        <span class="iconfont el-icon-log"></span>
        <span>查看日志</span>
      </el-button>
    </el-card>

    <SetCarouselWindow @open="getOpenSCWindow"></SetCarouselWindow>

    <SetAdvertisementWindow @open="getOpenSAWindow"></SetAdvertisementWindow>

    <IPBanlWindow @open="getIPBanWindow"></IPBanlWindow>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import { useRouter } from "vue-router"
import cmjs from '@/cmjs'
import SetCarouselWindow from "@/components/window/SetCarouselWindow.vue"
import SetAdvertisementWindow from "@/components/window/SetAdvertisementWindow.vue"
import IPBanlWindow from "@/components/window/IPBanWindow.vue"

type HomeInfo = {
  nickname: string,
  review: {
    video: number,
    read: number,
    title?: number,
  },
  feedback: {
    appeal: number,
    msg?: number,
    report?: number,
  },
  statistic?: {
    total: number,
    unique: number,
    video: number,
    read: number,
  }
}

const store = useStore()
const router = useRouter()

let hi: HomeInfo = reactive(getHomeInfo())
let openSCWindow = ref<Function>()
let openSAWindow = ref<Function>()
let openIPBanWindow = ref<Function>()

function getOpenSCWindow(f: Function) {
  openSCWindow.value = f
}

function getOpenSAWindow(f: Function) {
  openSAWindow.value = f
}

function getIPBanWindow(f: Function) {
  openIPBanWindow.value = f
}

function getCurTimePeriod() {
  let curHour = new Date().getHours()
  if (curHour >= 6 && curHour < 12) {
    return "早上"
  } else if (curHour >= 12 && curHour < 14) {
    return "中午"
  } else if (curHour >= 14 && curHour < 18) {
    return "下午"
  } else {
    return "晚上"
  }
}

function getHomeInfo(): HomeInfo {
  // TODO api
  return {
    nickname: "Bonnenult",
    review: {
      video: 2,
      read: 0,
      title: 2,
    },
    feedback: {
      appeal: 0,
      msg: 0,
      report: 0,
    },
    statistic: {
      total: 103,
      unique: 57,
      video: 3,
      read: 0,
    }
  }
}

function pushToNewPage(url: string) {
  router.push(url)
}

function processReview() {
  if (hi.review.video !== 0) {
    pushToNewPage("/manage/review/video")
  } else if (hi.review.read !== 0) {
    pushToNewPage("/manage/review/read")
  } else if (hi.review.title !== 0) {
    pushToNewPage("/manage/review/title")
  }
}

function processFeedback() {
  if (hi.feedback.appeal !== 0) {
    pushToNewPage("/manage/feedback/appeal/video")
  } else if (hi.feedback.msg !== 0) {
    pushToNewPage("/manage/feedback/msg")
  } else if (hi.feedback.report !== 0) {
    pushToNewPage("/manage/feedback/report/video")
  }
}
</script>

<style lang="less" scoped>
.m-container {
  font-size: 14px;
}

.m-container .row {
  line-height: 25px;
  cursor: default;
}

.m-container .el-card {
  margin-bottom: 20px;
}

.m-container .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.m-container .card-header .title {
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: default;
}

.m-container .card-header .title .icon {
  margin-right: 5px;
  font-size: 20px;
}

.m-container .highlight {
  color: #F56C6C;
  font-size: 18px;
}

.m-container .normallight {
  color: #909399;
}

.m-container .free {
  color: #c8c9cc;
}

.avatar-container {
  display: flex;
  cursor: default;
}

.avatar-container .left .avatar {
  vertical-align: top;
}

.avatar-container .right {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>