<template>
  <div class="power">您的权限等级为：<span class="high-light">{{ store.power }}</span></div>

  <el-table :data="data" border>
    <el-table-column fixed prop="level" label="权限等级" :width="90" align="center" :resizable="false" />
    <el-table-column prop="reviewVR" label="审批视频/专栏" :width="120" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="reviewAvatar" label="审批头像" :width="90" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="appeal" label="处理申诉" :width="90" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="reviewTitle" label="审批个人认证" :width="110" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="msg" label="处理站内留言" :width="110" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="report" label="处理举报" :width="90" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="power" label="管理权限" :width="90" :formatter="tfFormatter" align="center" :resizable="false" />
    <el-table-column prop="user" label="管理用户" :width="90" :formatter="tfFormatter" align="center" :resizable="false" />
    <el-table-column prop="sendSysMsg" label="发送系统消息" :width="110" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="setCarousel" label="设置轮播图" :width="100" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="setRegion" label="设置视频/专栏分区" :width="150" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="setVipPri" label="设置会员专享" :width="110" :formatter="tfFormatter" align="center"
      :resizable="false" />
    <el-table-column prop="log" label="查看日志" :width="90" :formatter="tfFormatter" align="center" :resizable="false" />
  </el-table>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setManegeItemIndex(4, location.pathname)

type power = {
  level: number,
  reviewVR: boolean,
  reviewAvatar: boolean,
  appeal: boolean,
  reviewTitle: boolean,
  msg: boolean,
  report: boolean,
  power: boolean,
  user: boolean,
  sendSysMsg: boolean,
  setCarousel: boolean,
  setRegion: boolean,
  setVipPri: boolean,
  log: boolean,
}

const data: power[] = [
  { level: 1, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: false, msg: false, report: false, power: false, user: false, sendSysMsg: false, setCarousel: false, setRegion: false, setVipPri: false, log: false },
  { level: 2, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: true, msg: true, report: false, power: false, user: false, sendSysMsg: false, setCarousel: false, setRegion: false, setVipPri: false, log: false },
  { level: 3, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: false, sendSysMsg: false, setCarousel: false, setRegion: false, setVipPri: false, log: false },
  { level: 4, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, sendSysMsg: true, setCarousel: true, setRegion: true, setVipPri: true, log: false },
  { level: 5, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, sendSysMsg: true, setCarousel: true, setRegion: true, setVipPri: true, log: true },
  { level: 6, reviewVR: true, reviewAvatar: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, sendSysMsg: true, setCarousel: true, setRegion: true, setVipPri: true, log: true },
]

function tfFormatter(_: any, __: any, v: boolean): string {
  return v ? '✓' : ''
}
</script>

<style lang="less" scoped>
.power {
  font-size: 14px;
  margin-bottom: 10px;

  .high-light {
    color: #F56C6C;
    font-size: 18px;
  }
}
</style>