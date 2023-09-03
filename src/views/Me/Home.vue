<template>
  <div class="avatar-container">
    <div class="left">
      <el-avatar size="large" class="avatar" :src="meHome.avatarUrl" @error="true">
        <img src="/default-avatar.png" />
      </el-avatar>
    </div>
    <div class="right">
      <div class="nickname">{{ meHome.nickname }}</div>
      <div class="level-bar">
        <span class="level">LV{{ meHome.level }}</span>
        <el-progress :percentage="meHome.exp / meHome.reqExp * 100" stroke-width="20" color="#ff905a"
          :show-text="false" />
        <div class="exp">{{ meHome.exp }} /<span style="color: #909399;">&nbsp;{{ meHome.reqExp }}</span></div>
      </div>
    </div>
  </div>
  <div class="req-exp-table">
    <strong>升级所需经验表</strong>
    <table border="1" cellspacing="0" style="margin-top: 5px;">
      <tr>
        <td style="color: #bfbfbf;">LV1</td>
        <td style="color: #8bd29b;">LV2</td>
        <td style="color: #7BCDEF;">LV3</td>
        <td style="color: #FEBB8B;">LV4</td>
        <td style="color: #EE672A;">LV5</td>
        <td style="color: #F04C49;">LV6</td>
      </tr>
      <tr>
        <td>0</td>
        <td>350</td>
        <td>1500</td>
        <td>4500</td>
        <td>9000</td>
        <td>18000</td>
      </tr>
    </table>
  </div>
  <div class="notice">
    <strong style="margin-bottom: 5px;">如何获得经验？</strong>
    <div class="item">
      <span class="iconfont el-icon-dian dian"></span>
      每次给视频投币后增加10点经验
    </div>
  </div>
</template>

<script setup lang="ts">
import mockMeHome from "../../mock/me/home.json"
import { useStore } from "../../store"

type MeHome = {
  avatarUrl: string
  nickname: string
  level: number
  exp: number
  reqExp: number
}

const store = useStore()
store.setMeCurTitle("首页")

let meHome: MeHome = reactive(getMeHome())

function getMeHome() {
  return mockMeHome //TODO
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  height: 56px;
}

.avatar-container .right {
  width: 100%;
  margin-left: 10px;
}

.avatar-container .right .nickname {
  font-size: 20px;
}

.avatar-container .right .level-bar {
  display: flex;
  margin-top: 10px;
}

.avatar-container .right .level-bar .level {
  margin-right: 10px;
  background-color: #ff905a;
  color: white;
  padding: 5px;
  line-height: 10px;
  font-size: 14px;
}

.avatar-container .right .level-bar .el-progress {
  width: 635px;
  margin-right: 10px;
}

.avatar-container .right .level-bar .exp {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.req-exp-table {
  margin-top: 40px;
  font-size: 14px;
}

.req-exp-table td {
  text-align: center;
  width: 120px;
  height: 20px;
}

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