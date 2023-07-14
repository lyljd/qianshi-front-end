<template>
  <div class="m-container">
    <el-card>
      <div class="avatar-container">
        <div class="left">
          <el-avatar size="large" class="avatar" :src="store.mui.coverUrl" @error="true">
            <img src="../../public/default-avatar.png" />
          </el-avatar>
        </div>
        <div class="right">
          <div class="nickname">{{ getCurTimePeriod() }}好，<span class="normallight">{{
            `${store.mui.nickname}` }}</span></div>
          <div class="power">您的权限等级为：<span class="highlight">{{ store.mui.power }}</span></div>
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
            <el-button @click="pushToNewPage('/manage/review')">前往处理</el-button>
          </div>
        </template>
        <div class="row"><span class="highlight">{{ hi.review.video }}</span>个<span class="normallight">视频</span>待处理</div>
        <div class="row"><span class="highlight">{{ hi.review.read }}</span>个<span class="normallight">专栏</span>待处理</div>
      </el-card>

      <el-card style="width: calc(50% - 10px);">
        <template #header>
          <div class="card-header">
            <div class="title">
              <span class="iconfont el-icon-feedback icon"></span>
              反馈
            </div>
            <el-button @click="pushToNewPage('/manage/feedback')">前往处理</el-button>
          </div>
        </template>
        <div class="row"><span class="highlight">{{ hi.feedback.inSiteMessage }}</span>个<span
            class="normallight">站内留言</span>待处理</div>
        <div class="row"><span class="highlight">{{ hi.feedback.videoAppeal }}</span>个<span
            class="normallight">视频申诉</span>待处理</div>
        <div class="row"><span class="highlight">{{ hi.feedback.report }}</span>个<span class="normallight">举报</span>待处理
        </div>
      </el-card>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="title">
            <span class="iconfont el-icon-statistic icon"></span>
            今日统计
          </div>
          <el-button @click="pushToNewPage('/manage/statistic')">查看更多</el-button>
        </div>
      </template>
      <div class="row">总访问量：<span class="highlight">{{ hi.statistic.total }}</span></div>
      <div class="row">独立访问量：<span class="highlight">{{ hi.statistic.unique }}</span>（用户：<span
          class="highlight">49</span>，游客：<span class="highlight">8</span>）</div>
      <div class="row"><span class="normallight">视频</span>投稿量：<span class="highlight">{{ hi.statistic.video }}</span>
      </div>
      <div class="row"><span class="normallight">专栏</span>投稿量：<span class="highlight">{{ hi.statistic.read }}</span></div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <div class="title">
            <span class="iconfont el-icon-kuaijierukou icon"></span>
            快捷入口
          </div>
        </div>
      </template>
      <el-button>查看日志</el-button>
      <el-button>发送系统消息</el-button>
      <el-button>设置轮播图</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../../store"
import { useRouter } from "vue-router"

type HomeInfo = {
  review: {
    video: number,
    read: number,
  },
  feedback: {
    inSiteMessage: number,
    videoAppeal: number,
    report: number,
  },
  statistic: {
    total: number,
    unique: number,
    video: number,
    read: number,
  }
}

const store = useStore()
const router = useRouter()

let hi: HomeInfo = reactive(getHomeInfo())

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
  return {
    review: {
      video: 3,
      read: 0,
    },
    feedback: {
      inSiteMessage: 1,
      videoAppeal: 0,
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
</script>

<style scoped>
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