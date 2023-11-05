<template>
  <div class="iu-container">
    <div :style="{ width: `${width - 2}px`, height: `${height - 2}px` }" v-show="imgUrl === ''" @click="openImgUpload"
      class="upload-div">
      <span style="font-size: 30px;">+</span>
      <span>上传图片</span>
    </div>

    <div v-show="imgUrl !== ''" class="img-container">
      <el-image :style="{ width: `${width}px`, height: `${height}px`, opacity: imgUploadPercent !== 0 ? 0.25 : 1 }"
        @click="openImgUpload" :src="imgUrl" class="img">
        <template #error>
          <div @click="openImgUpload" style="font-size: 16px;" class="default">加载失败</div>
        </template>
      </el-image>

      <el-progress :style="{ marginLeft: `${(width - height) / 2}px` }" v-show="imgUploadPercent !== 0"
        :percentage="imgUploadPercent" :width="height" type="circle" class="progress" />
    </div>

    <el-upload :before-upload="beforeImgUpload" :on-remove="onImgUploadRemove" :on-change="onImgUploadChange"
      :on-progress="onImgUploadProgress" :on-success="onImgUploadSuccess" :on-error="onImgUploadError" ref="imgUpload"
      :action="uploadUrl" accept="image/*" v-show="false"></el-upload>

    <div class="tip">
      <span>上传的图片大小上限为{{ maxSize }}M</span>
      <span>推荐使用{{ proportion }}的图片</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import cmjs from '@/cmjs'

const imgUpload = ref<UploadInstance>()

const stf = defineEmits<{
  (cen: "recImgUrl", imgUrl: string): void
  (cen: "recSetImgUrlFc", f: Function): void
  (cen: "recImgUploadPercent", imgUploadPercent: number): void
}>()
stf('recSetImgUrlFc', setImgUrl)

const data = withDefaults(defineProps<{
  width: number,
  height: number,
  proportion: string
  maxSize: number //单位：MB
  uploadUrl: string
  imgUrl: string
}>(), {
  width: 210,
  height: 118.125,
  proportion: "16:9",
  maxSize: 10,
  imgUrl: "",
})

let imgUrl = ref(data.imgUrl)
let preImgUrl = ref(data.imgUrl)
let preImgId = ref(0)
let imgUploadPercent = ref(0)

function setImgUrl(url: string) {
  imgUrl.value = url
  preImgUrl.value = url
}

function openImgUpload() {
  if (imgUploadPercent.value !== 0) {
    cmjs.prompt.error("图片上传时禁止修改")
    return
  }
  imgUpload.value?.$el.querySelector('input').click()
}

function beforeImgUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > data.maxSize) {
    cmjs.prompt.error(`上传的图片大小不能超过${data.maxSize}M`)
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
.iu-container .upload-div {
  border-radius: 5px;
  cursor: pointer;
  border: 1px dashed #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.iu-container .img-container {
  display: flex;
}

.iu-container .img-container .img {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
  vertical-align: top;
}

.iu-container .img-container .progress {
  position: absolute;
}
</style>