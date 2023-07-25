<template>
  <el-table :data="data" border>
    <el-table-column prop="level" label="权限等级" align="center" />
    <el-table-column prop="reviewVR" label="审批视频/专栏" :formatter="tfFormatter" align="center" />
    <el-table-column prop="appeal" label="处理申诉" :formatter="tfFormatter" align="center" />
    <el-table-column prop="reviewTitle" label="审批个人认证" :formatter="tfFormatter" align="center" />
    <el-table-column prop="msg" label="处理站内留言" :formatter="tfFormatter" align="center" />
    <el-table-column prop="report" label="处理举报" :formatter="tfFormatter" align="center" />
    <el-table-column prop="power" label="管理权限" :formatter="tfFormatter" align="center" />
    <el-table-column prop="user" label="管理用户" :formatter="tfFormatter" align="center" />
    <el-table-column prop="ipBan" label="IP封禁" :formatter="tfFormatter" align="center" />
    <el-table-column prop="sendSysMsg" label="发送系统消息" :formatter="tfFormatter" align="center" />
    <el-table-column prop="setCarousel" label="设置轮播图" :formatter="tfFormatter" align="center" />
    <el-table-column prop="statistic" label="查看统计" :formatter="tfFormatter" align="center" />
    <el-table-column prop="log" label="查看日志" :formatter="tfFormatter" align="center" />
  </el-table>
</template>

<script setup lang="ts">
import { useStore } from "../../../store"

const store = useStore()
store.setManegeItemIndex(4, location.pathname)

type power = {
  level: number,
  reviewVR: boolean,
  appeal: boolean,
  reviewTitle: boolean,
  msg: boolean,
  report: boolean,
  power: boolean,
  user: boolean,
  ipBan: boolean,
  sendSysMsg: boolean,
  setCarousel: boolean,
  statistic: boolean,
  log: boolean,
}

const data: power[] = [
  { level: 1, reviewVR: true, appeal: true, reviewTitle: false, msg: false, report: false, power: false, user: false, ipBan: false, sendSysMsg: false, setCarousel: false, statistic: false, log: false },
  { level: 2, reviewVR: true, appeal: true, reviewTitle: true, msg: true, report: false, power: false, user: false, ipBan: false, sendSysMsg: false, setCarousel: false, statistic: false, log: false },
  { level: 3, reviewVR: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: false, ipBan: false, sendSysMsg: false, setCarousel: false, statistic: false, log: false },
  { level: 4, reviewVR: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, ipBan: true, sendSysMsg: true, setCarousel: true, statistic: false, log: false },
  { level: 5, reviewVR: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, ipBan: true, sendSysMsg: true, setCarousel: true, statistic: true, log: true },
  { level: 6, reviewVR: true, appeal: true, reviewTitle: true, msg: true, report: true, power: true, user: true, ipBan: true, sendSysMsg: true, setCarousel: true, statistic: true, log: true },
]

function tfFormatter(_: any, __: any, v: boolean): string {
  return v ? '✓' : ''
}
</script>

<style scoped></style>