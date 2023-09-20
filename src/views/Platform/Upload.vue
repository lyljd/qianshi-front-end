<template>
  <div class="pa-container">
    <el-menu :default-active="$route.path" router mode="horizontal">
      <el-menu-item v-show="uploadItem === 'video' || uploadItem === ''"
        index="/platform/upload/video">视频投稿</el-menu-item>
      <el-menu-item v-show="uploadItem === 'read' || uploadItem === ''" index="/platform/upload/read">专栏投稿</el-menu-item>
    </el-menu>
  </div>

  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setPlatformCurTitle("投稿")
store.setUploadItem = setUploadItem
store.getUploadItem = getUploadItem

let uploadItem = ref("")

function setUploadItem(item: string) {
  uploadItem.value = item
}

function getUploadItem() {
  return uploadItem.value
}
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