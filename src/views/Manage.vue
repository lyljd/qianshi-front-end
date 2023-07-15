<template>
  <el-container v-if="store.mui.power >= 1" class="container">
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
        <el-menu-item index="/manage">
          <span class="iconfont el-icon-home"></span>
          <span class="span">首页</span>
        </el-menu-item>
        <el-menu-item index="/manage/review">
          <span class="iconfont el-icon-review"></span>
          <span class="span">审批</span>
        </el-menu-item>
        <el-menu-item index="/manage/feedback">
          <span class="iconfont el-icon-feedback"></span>
          <span class="span">反馈</span>
        </el-menu-item>
        <el-menu-item index="/manage/content">
          <span class="iconfont el-icon-content"></span>
          <span class="span">内容</span>
        </el-menu-item>
        <el-menu-item index="/manage/user">
          <span class="iconfont el-icon-people"></span>
          <span class="span">用户</span>
        </el-menu-item>
        <el-menu-item index="/manage/message">
          <span class="iconfont el-icon-message"></span>
          <span class="span">消息</span>
        </el-menu-item>
        <el-menu-item index="/manage/power">
          <span class="iconfont el-icon-key"></span>
          <span class="span">权限</span>
        </el-menu-item>
        <el-menu-item index="/manage/operation">
          <span class="iconfont el-icon-yunying"></span>
          <span class="span">运营</span>
        </el-menu-item>
        <el-menu-item index="/manage/statistic">
          <span class="iconfont el-icon-statistic"></span>
          <span class="span">统计</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <NotFound v-else></NotFound>
</template>

<script setup lang="ts">
import NotFound from './404.vue'
import * as common from "../common"
import { useStore } from "../store"

type UserInfo = {
  nickname: string,
  coverUrl: string,
  power: number
}

const store = useStore()
store.mui = getCurUserInfo()

function getCurUserInfo(): UserInfo {
  return {
    nickname: "Bonnenult",
    coverUrl: "../../public/avatar.jpeg",
    power: 5,
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}

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
}
</style>