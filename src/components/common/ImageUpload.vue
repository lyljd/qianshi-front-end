<template>
  <div>
    <div @click="onClick" class="payload"
      :style="{ width: w - 2 + 'px', height: h - 2 + 'px', cursor: uploading ? 'not-allowed' : 'pointer' }">
      <div v-show="imgUrl === ''" class="upload-box">
        <span class="plus">+</span>
        <span>点击选择图片上传</span>
      </div>

      <Image v-show="imgUrl !== ''" :url="imgUrl" :w="w" :h="h" round :opacity="uploading ? 0.5 : 1"></Image>

      <el-progress v-show="uploading" class="progress" :width="Math.min(w, h) - 2" :percentage="uploadPercent"
        type="circle" />
    </div>

    <el-upload ref="uploadRef" accept="image/*" :before-upload="beforeUpload" v-show="false"></el-upload>

    <div class="tip">
      <span>上传的单张图片大小上限为{{ maxSize }}M</span>
      <span v-if="proportion">推荐使用{{ proportion }}的图片</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadInstance } from 'element-plus'
import cmjs from '@/cmjs'

const data = withDefaults(defineProps<{
  initImgUrl: string,
  w: number,
  h: number,
  proportion?: string, // 上传图片推荐尺寸
  maxSize: number, // 单位：MB
  uploadHandler: (file: File, percent: Ref<number>, succ: Function, fail: Function) => void,
}>(), {
  initImgUrl: "",
  maxSize: 5,
})

const stf = defineEmits<{
  (cen: "setImgUrl", f: Function): void
}>()

const uploadRef = ref<UploadInstance>()

let imgUrl = ref(data.initImgUrl)
let preImgUrl = ""
let imgHash = "" // 自定义hash；用于避免重复上传图片
let preImgHash = ""
let uploading = ref(false) // 当前是否处于上传中状态
let uploadPercent = ref(0)

function onClick() {
  if (uploading.value) {
    return
  }

  uploadRef.value?.$el.querySelector('input').click()
}

function beforeUpload(file: File) {
  if (file.size / 1024 / 1024 > data.maxSize) {
    cmjs.prompt.error(`上传的单张图片大小不能超过${data.maxSize}M`)
    return false
  }

  imgHash = calcHash(file)
  if (imgHash === preImgHash) {
    cmjs.prompt.warning("请勿重复上传图片")
    return false
  }

  startUpload(file)
  return false
}

function startUpload(file: File) {
  preImgUrl = imgUrl.value
  uploading.value = true
  data.uploadHandler(file, uploadPercent, succ, fail)
}

function endUpload() {
  uploading.value = false
  uploadPercent.value = 0
}

function setImgUrl(url: string) {
  imgUrl.value = url
}

stf('setImgUrl', setImgUrl)

function succ() {
  preImgHash = imgHash
  endUpload()
}

function fail() {
  cmjs.prompt.error("上传失败")
  imgUrl.value = preImgUrl
  imgHash = preImgHash
  endUpload()
}

function calcHash(file: File): string {
  return file.lastModified + file.name + file.size
}
</script>

<style lang="less" scoped>
.payload {
  position: relative;

  .upload-box {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border: 1px dashed #909399;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 14px;

    .plus {
      font-size: 30px;
      line-height: 30px;
      margin-top: -3px;
    }
  }

  .upload-box:hover {
    border-color: #409EFF;
  }

  .progress {
    position: absolute;
    top: calc(50% + 1px);
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>