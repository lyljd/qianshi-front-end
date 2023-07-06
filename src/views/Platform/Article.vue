<template>
  <div class="pa-container">
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item index="/platform/article/video">视频管理</el-menu-item>
      <el-menu-item index="/platform/article/read">专栏管理</el-menu-item>
    </el-menu>
  </div>

  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from "../../store"

const store = useStore()
store.setPlatformCurTitle("稿件管理")
</script>

<style scoped>
.pa-container .el-menu-item {
  padding: 0;
  height: 30px;
  margin-right: 20px;
  font-size: 20px;
}

.pa-container .el-menu-item:hover,
.pa-container .el-menu-item:focus {
  background-color: transparent !important;
}
</style>