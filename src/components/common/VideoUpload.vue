<template>
  <div>
    <div class="payload">
      <div>
        <el-button v-blur :disabled="uploading" @click="onClick">{{ videoUrl ? '重新上传' : '上传' }}</el-button>
        <el-button v-blur v-if="preview" :disabled="videoUrl === '' || uploading"
          @click="store.openPVWindow(videoUrl)">预览</el-button>
      </div>
      <el-progress v-show="uploading" :percentage="uploadPercent" :stroke-width="10" />
    </div>

    <el-upload ref="uploadRef" accept="video/*" :before-upload="beforeUpload" v-show="false"></el-upload>

    <div class="tip">
      <span>上传的单个视频大小上限为{{ maxSize }}M</span>
      <span>上传视频，即表示您已同意 <Agreement></Agreement> ，请勿上传色情，反动等违法视频。</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Agreement from '@/components/common/Agreement.vue'
import { UploadInstance } from 'element-plus'
import cmjs from '@/cmjs'

const data = withDefaults(defineProps<{
  initVideoUrl: string,
  maxSize: number, // 单位：MB
  uploadHandler: (file: File, percent: Ref<number>, succ: Function, fail: Function) => void,
  preview: boolean,
}>(), {
  initVideoUrl: "",
  maxSize: 500,
  preview: true,
})

const stf = defineEmits<{
  (cen: "setVideoUrl", f: Function): void
}>()

import { useStore } from '@/store'
const store = useStore()

const uploadRef = ref<UploadInstance>()

let videoUrl = ref(data.initVideoUrl)
let preVideoUrl = ""
let videoHash = "" // 自定义hash；用于避免重复上传图片
let preVideoHash = ""
let uploading = ref(false) // 当前是否处于上传中状态
let uploadPercent = ref(0)

function onClick() {
  uploadRef.value?.$el.querySelector('input').click()
}

function beforeUpload(file: File) {
  if (file.size / 1024 / 1024 > data.maxSize) {
    cmjs.prompt.error(`上传的单个视频大小不能超过${data.maxSize}M`)
    return false
  }

  videoHash = calcHash(file)
  if (videoHash === preVideoHash) {
    cmjs.prompt.warning("请勿重复上传视频")
    return false
  }

  startUpload(file)
  return false
}

function startUpload(file: File) {
  preVideoUrl = videoUrl.value
  uploading.value = true
  data.uploadHandler(file, uploadPercent, succ, fail)
}

function endUpload() {
  uploading.value = false
  uploadPercent.value = 0
}

function setVideoUrl(url: string) {
  videoUrl.value = url
}

stf('setVideoUrl', setVideoUrl)

function succ() {
  cmjs.prompt.success("上传成功")
  preVideoHash = videoHash
  endUpload()
}

function fail() {
  cmjs.prompt.error("上传失败")
  videoUrl.value = preVideoUrl
  videoHash = preVideoHash
  endUpload()
}

function calcHash(file: File): string {
  return file.lastModified + file.name + file.size
}
</script>

<style>
.payload .el-progress__text {
  min-width: unset;
  font-size: 14px !important;
  margin-left: 10px;
}
</style>