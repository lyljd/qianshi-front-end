<template>
  <div
    :style="{ border: border ? '1px solid #dcdfe6' : '', borderRadius: (round || circle || avatar) ? (circle || avatar ? '50%' : '5px') : '' }"
    :class="customClass" class="Image-container" @click="openImgUpload">
    <el-image :src="imgUrl" :preview-src-list="preview && uploadUrl === '' ? [url] : []" :fit="contain ? 'contain' : ''"
      :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', borderRadius: (round || circle || avatar) ? (circle || avatar ? '50%' : '5px') : '', cursor: customClick || uploadUrl !== '' ? 'pointer' : 'default', opacity: imgUploadPercent !== 0 ? 0.5 : 1 }"
      class="img">
      <template #error>
        <div v-if="!data.avatar" style="font-size: 16px;" class="default">{{ loadFailInfo }}</div>

        <el-image v-else src="/default-avatar.png" :fit="contain ? 'contain' : ''"
          :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', borderRadius: (round || circle || avatar) ? (circle || avatar ? '50%' : '5px') : '', cursor: customClick || uploadUrl !== '' ? 'pointer' : 'default', opacity: imgUploadPercent !== 0 ? 0.5 : 1 }"
          class="img">
        </el-image>
      </template>
    </el-image>
  </div>

  <el-upload v-if="uploadUrl !== ''" :before-upload="beforeImgUpload" :on-remove="onImgUploadRemove"
    :on-change="onImgUploadChange" :on-progress="onImgUploadProgress" :on-success="onImgUploadSuccess"
    :on-error="onImgUploadError" ref="imgUpload" :method="uploadMethod" :action="uploadUrl" accept="image/*"
    v-show="false"></el-upload>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import cmjs from '@/cmjs'

const stf = defineEmits<{
  (cen: "recImgUrl", imgUrl: string): void
  (cen: "recImgUploadPercent", imgUploadPercent: number): void
}>()

const data = withDefaults(defineProps<{
  url: string,
  w: number,
  h: number,
  customClick: Function,
  preview: boolean,
  contain: boolean,
  border: boolean,
  round: boolean,
  circle: boolean,
  avatar: boolean, //相当于circle，但在图片加载失败时会显示为默认头像
  customClass: string, //class不能写在scoped下的style中
  uploadUrl: string,
  uploadMethod: string,
  uploadMaxSize: number, //单位：MB
  loadFailInfo: string,
}>(), {
  preview: false,
  contain: false,
  border: false,
  round: true,
  circle: false,
  avatar: false,
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
  if (data.customClick) {
    data.customClick()
  }

  if (data.uploadUrl !== "") {
    if (imgUploadPercent.value !== 0) {
      cmjs.prompt.error("图片上传时禁止修改")
      return
    }
    imgUpload.value?.$el.querySelector('input').click()
  }
}

function beforeImgUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > data.uploadMaxSize) {
    cmjs.prompt.error(`上传的图片大小不能超过${data.uploadMaxSize}M`)
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
  cmjs.prompt.error("图片上传失败")
}
</script>

<style lang="less" scoped>
.Image-container {
  height: 100%;
}

.Image-container .img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>