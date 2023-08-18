<template>
  <div
    :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', border: border ? '1px solid #dcdfe6' : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '' }"
    class="Image-container" :class="customClass" @click="openImgUpload">
    <el-image :src="url" :preview-src-list="preview && uploadUrl === '' ? [url] : []" :fit="contain ? 'contain' : ''"
      :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '', cursor: uploadUrl !== '' ? 'pointer' : 'default', opacity: imgUploadPercent !== 0 ? 0.5 : 1 }"
      :class="customClass" class="img">
      <template #error>
        <div :style="{ borderRadius: round ? '5px' : '' }" class="default">{{ loadFailInfo }}</div>
      </template>
    </el-image>
  </div>

  <el-upload v-if="uploadUrl !== ''" :before-upload="beforeImgUpload" :on-remove="onImgUploadRemove"
    :on-change="onImgUploadChange" :on-progress="onImgUploadProgress" :on-success="onImgUploadSuccess"
    :on-error="onImgUploadError" ref="imgUpload" :method="uploadMethod" :action="uploadUrl" accept="image/*" v-show="false"></el-upload>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import * as common from "../common"

const stf = defineEmits<{
  (cen: "recImgUrl", imgUrl: string): void
  (cen: "recImgUploadPercent", imgUploadPercent: number): void
}>()

const data = withDefaults(defineProps<{
  url: string,
  w: number,
  h: number,
  preview: boolean,
  contain: boolean,
  border: boolean,
  round: boolean,
  circle: boolean,
  customClass: string,
  uploadUrl: string,
  uploadMethod: string,
  uploadMaxSize: number, //单位：MB
  loadFailInfo: string,
}>(), {
  w: undefined,
  h: undefined,
  preview: false,
  contain: false,
  border: false,
  round: true,
  circle: false,
  customClass: "",
  uploadUrl: "",
  uploadMethod: "post",
  uploadMaxSize: 10,
  loadFailInfo: "加载失败",
})

const imgUpload = ref<UploadInstance>()

let imgUrl = ref(data.url)
let preImgUrl = ref(data.url)
let preImgId = ref(0)
let imgUploadPercent = ref(0)

function openImgUpload() {
  if (data.uploadUrl !== "") {
    if (imgUploadPercent.value !== 0) {
      common.showError("图片上传时禁止修改")
      return
    }
    imgUpload.value?.$el.querySelector('input').click()
  }
}

function beforeImgUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > data.uploadMaxSize) {
    common.showError(`上传的图片大小不能超过${data.uploadMaxSize}M`)
    return false
  }
  return true
}

function onImgUploadRemove() {
  imgUrl.value = preImgUrl.value
}

function onImgUploadChange(file: any) {
  if (file.uid !== preImgId.value) {
    preImgId.value = file.uid
    imgUrl.value = URL.createObjectURL(file.raw)
  }
}

function onImgUploadProgress(event: any) {
  imgUploadPercent.value = Math.floor(event.percent)
  stf('recImgUploadPercent', imgUploadPercent.value)
}

function onImgUploadSuccess() {
  preImgUrl.value = imgUrl.value
  imgUploadPercent.value = 0

  stf('recImgUrl', imgUrl.value)
  stf('recImgUploadPercent', 0)
}

function onImgUploadError() {
  imgUrl.value = preImgUrl.value
  imgUploadPercent.value = 0
  stf('recImgUploadPercent', 0)
  common.showError("图片上传失败")
}
</script>

<style scoped>
.Image-container .img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>