<template>
  <el-dialog v-model="previewVideoWindowVisible" :custom-class="'preview-video'" :before-close="beforePVWindowClose"
    destroy-on-close align-center>
    <video volume="0.5" controls :src="previewVideoUrl"></video>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.openPVWindow = openMainWindow

let previewVideoWindowVisible = ref(false)
let previewVideoUrl = ref("")

function openMainWindow(videoUrl: string) {
  previewVideoUrl.value = videoUrl
  previewVideoWindowVisible.value = true
}

function beforePVWindowClose(done: Function) {
  previewVideoUrl.value = "" //不清除url会导致在video元素被销毁后仍然可以通过按键播放
  done()
}
</script>

<style>
.preview-video {
  border-radius: 10px !important;
}

.preview-video video {
  width: 100%;
  border-radius: 10px;
  vertical-align: top;
}

.preview-video .el-dialog__header {
  display: none;
}

.preview-video .el-dialog__body {
  padding: 0;
}
</style>