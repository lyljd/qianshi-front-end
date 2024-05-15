<template>
  <div style="position: relative;" @click="onClick">
    <img
      @error="url = 'https://cdn.qianshi.fun/default-avatar.png?auth_key=1741881639-0-0-8c52d45ef270f436878becd527a8c744'"
      :src="url" :class="'avatar-' + data.size"
      :style="{ cursor: data.upload || data.home ? uploading ? 'not-allowed' : 'pointer' : 'default', opacity: uploading ? 0.5 : text ? 0.25 : 1 }" />

    <el-upload ref="uploadRef" accept="image/*" :before-upload="beforeUpload" v-if="data.upload"
      v-show="false"></el-upload>

    <div v-if="text" v-show="!uploading" :class="'avatar-' + data.size" class="inner-text flex-center">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import cmjs from '@/cmjs'

const data = defineProps<{
  modelValue: string,
  size: "large" | "medium" | 'small', // 60px | 40px | 30px
  upload?: {
    maxsize?: number, // 单位：MB；默认1MB
    handler: (file: File, succ: Function, fail: Function) => void,
  },
  home?: {
    uid: number,
  }
  text?: string,
}>()

const emit = defineEmits(['update:modelValue'])

const url = computed({
  get() {
    return data.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const uploadRef = ref<UploadInstance>()

let preUrl = ""
let hash = "" // 自定义hash；用于避免重复上传头像
let preHash = ""
let uploading = ref(false) // 当前是否处于上传中状态

function onClick() {
  if (uploading.value) {
    return
  }

  if (data.upload && data.home) {
    cmjs.prompt.warning("click事件冲突")
    return
  }

  if (data.upload) {
    uploadRef.value?.$el.querySelector('input').click()
    return
  }

  if (data.home) {
    cmjs.jump.user(data.home.uid)
  }
}

function beforeUpload(file: File) {
  const maxsize = data.upload?.maxsize ? data.upload.maxsize : 1
  if (file.size / 1024 / 1024 > maxsize) {
    cmjs.prompt.error(`上传的单张图片大小不能超过${maxsize}M`)
    return false
  }

  hash = calcHash(file)
  if (hash === preHash) {
    cmjs.prompt.warning("请勿重复上传图片")
    return false
  }

  startUpload(file)
  return false
}

function startUpload(file: File) {
  preUrl = url.value
  uploading.value = true
  url.value = URL.createObjectURL(file)
  const handler = data.upload?.handler as (file: File, succ: Function, fail: Function) => void
  handler(file, succ, fail)
}

function endUpload() {
  uploading.value = false
}

function succ() {
  preHash = hash
  endUpload()
}

function fail(msg?: string) {
  cmjs.prompt.error(msg ? msg : "上传失败")
  url.value = preUrl
  hash = preHash
  endUpload()
}

function calcHash(file: File): string {
  return file.lastModified + file.name + file.size
}
</script>

<style lang="less" scoped>
.avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 14px;
}

.avatar-medium {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 12px;
}

.avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 10px;
}

.inner-text {
  position: absolute;
  top: 0;
  pointer-events: none;
  text-align: center;
  color: white;
}
</style>