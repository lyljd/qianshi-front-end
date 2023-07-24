<template>
  <el-container v-if="store.mui.power >= 1" class="container">
    <el-affix>
      <el-aside width="150px">
        <el-menu :default-active=$route.path router="true">
          <div class="page-title">
            <div class="logo">
              <img class="icon" src="../../public/favicon.png">
              <span>浅时</span>
            </div>
            <div>后台管理</div>
            <div @click="common.ToNewPage('/')" class="open-main-web">打开主站</div>
          </div>

          <el-menu-item v-for="i in item" :index="i.index">
            <span :class="`el-icon-${i.icon}`" class="iconfont"></span>
            <span class="span">{{ i.content }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    </el-affix>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <SysMsgSendWindow></SysMsgSendWindow>
  </el-container>

  <NotFound v-else></NotFound>
</template>

<script setup lang="ts">
import NotFound from './404.vue'
import * as common from "../common"
import { useStore } from "../store"
import SysMsgSendWindow from "../components/SysMsgSendWindow.vue"

type UserInfo = {
  nickname: string,
  coverUrl: string,
  power: number
}

const store = useStore()
store.mui = getCurUserInfo()
store.setManegeItemIndex = setItemIndex

let item = reactive([
  { index: "/manage", content: "首页", icon: "home" },
  { index: "/manage/review/video", content: "审批", icon: "review" },
  { index: "/manage/feedback/msg", content: "反馈", icon: "feedback" },
  { index: "/manage/user", content: "用户", icon: "people" },
  { index: "/manage/power", content: "权限", icon: "key" },
  { index: "/manage/statistic", content: "统计", icon: "statistic" }
])

function setItemIndex(idx: number, index: string) {
  item[idx].index = index
}

function getCurUserInfo(): UserInfo {
  return {
    nickname: "Bonnenult",
    coverUrl: "../../public/avatar.jpeg",
    power: 5,
  }
}
</script>

<style scoped>
.container .page-title {
  height: 83px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #FAFCFF;
  font-size: 18px;
  cursor: default;
}

.container .page-title .logo {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 30px;
  margin-left: -21px;
}

.container .page-title .logo .icon {
  width: 37.5px;
  vertical-align: top;
}

.container .page-title .open-main-web {
  position: absolute;
  font-size: 12px;
  width: 15px;
  padding-left: 3px;
  height: 83px;
  align-self: flex-end;
  border-left: 1px solid #dcdfe6;
  background-color: #FAFAFA;
  cursor: pointer;
  display: flex;
  align-items: center;
  line-height: 15px;
}

.container .page-title .open-main-web:hover {
  background-color: #E6E8EB;
}

.container .el-menu .el-menu-item {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dcdfe6;
  background-color: #FAFAFA;
}

.container .el-menu .el-menu-item:hover {
  background-color: #E6E8EB;
}

.container .el-menu .el-menu-item .span {
  margin-left: 5px;
}

.container .el-aside .el-menu--vertical {
  border-right: unset;
}

.container .el-aside {
  border-right: 1px solid #dcdfe6;
  height: 100vh;
}
</style>