<template>
  <div class="pu-container">
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item index="/platform/upload/video">视频投稿</el-menu-item>
      <el-menu-item index="/platform/upload/read">专栏投稿</el-menu-item>
    </el-menu>
  </div>

  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setPlatformCurTitle("投稿")
</script>

<style lang="less" scoped>
.pu-container .el-menu-item {
  padding: 0;
  height: 30px;
  margin-right: 20px;
  font-size: 20px;
}

.pu-container .el-menu-item:hover,
.pu-container .el-menu-item:focus {
  background-color: transparent !important;
}
</style>