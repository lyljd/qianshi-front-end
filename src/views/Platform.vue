<template>
  <el-container v-if="store.isLogin" class="container">
    <el-aside width="150px">
      <el-menu :default-active=$route.path router="true">
        <div class="page-title">创作中心</div>
        <el-menu-item index="/platform">
          <span class="iconfont el-icon-home"></span>
          <span class="span">首页</span>
        </el-menu-item>
        <el-menu-item index="/platform/upload/video">
          <span class="iconfont el-icon-upload"></span>
          <span class="span">投稿</span>
        </el-menu-item>
        <el-menu-item index="/platform/article/video">
          <span class="iconfont el-icon-article"></span>
          <span class="span">稿件管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>{{ curTitle }}</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <NotFound v-else></NotFound>
</template>

<script setup lang="ts">
import { useStore } from "../store"
import NotFound from './404.vue'

const store = useStore()
store.setPlatformCurTitle = setCurTitle

let curTitle = ref("")

function setCurTitle(title: string) {
  curTitle.value = title
}
</script>

<style scoped>
.container {
  width: 1140px;
  margin-inline: auto;
  margin-top: 77px;
  margin-bottom: 20px;
  border: 1px solid #dedfe0;
  border-radius: 10px;
}

.container .el-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dedfe0;
  color: #409EFF;
}

.container .page-title {
  height: 59px;
  border-bottom: 1px solid #dedfe0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container .el-menu {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.container .el-menu .el-menu-item {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dedfe0;
}

.container .el-menu .el-menu-item:last-child {
  /* border-bottom: none; */
  border-bottom-left-radius: 10px;
}

.container .el-menu .el-menu-item .span {
  margin-left: 5px;
}
</style>