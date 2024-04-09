<template>
  <div v-loading="loading">
    <div>
      <strong>硬币余额：</strong>
      <span style="color: #67C23A;">{{ coinNum }}</span>
    </div>
    <div class="notice" style="margin-top: 40px;">
      <strong style="margin-bottom: 5px;">硬币有什么用？</strong>
      <div class="item">
        <span class="iconfont el-icon-dian dian"></span>
        硬币用于对优秀的视频作品进行投币支持，这是对UP主的一种肯定
      </div>
      <div class="item">
        <span class="iconfont el-icon-dian dian"></span>
        硬币还可用于修改昵称、兑换会员等
      </div>
    </div>
    <div class="notice">
      <strong style="margin-bottom: 5px;">如何获得硬币？</strong>
      <div class="item">
        <span class="iconfont el-icon-dian dian"></span>
        每日签到后可获得5个硬币（鼠标悬浮在顶部菜单栏头像处可签到）
      </div>
      <div class="item">
        <span class="iconfont el-icon-dian dian"></span>
        UP主可通过投稿视频来获得更多硬币（观众投币的百分之十将作为UP主的硬币收入奖励）
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import * as API from '@/api/user'

const store = useStore()
store.setMeCurTitle("我的硬币")

let coinNum = ref(0)
let loading = ref(false)
getMeCoin()

function getMeCoin() {
  loading.value = true
  API.meCoin()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取我的硬币失败")
        return
      }

      coinNum.value = res.data.coin
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="less" scoped>
.notice {
  margin-top: 20px;
  font-size: 14px;
}

.notice .item {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
</style>