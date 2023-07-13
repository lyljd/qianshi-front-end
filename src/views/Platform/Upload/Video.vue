<template>
  <div class="v-container">
    <div v-show="store.getUploadItem() === ''">
      <el-upload :before-upload="beforeVideoUpload" :on-remove="onVideoUploadRemove" :on-change="onVideoUploadChange"
        :on-progress="onVideoUploadProgress" :on-success="onVideoUploadSuccess" :on-error="onVideoUploadError"
        ref="videoUpload" action="/api/resource/video" accept="video/*" drag :show-file-list="false">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽到此处上传 或 <em>点击此处选择文件上传</em>
        </div>
      </el-upload>
      <div style="margin-top: 5px; margin-left: 0;" class="tip">上传的视频大小上限为1G</div>
      <div style="margin-left: 0;" class="tip">上传视频，即表示您已同意 <span style="color: #409EFF;">浅时使用协议</span> ，请勿上传色情，反动等违法视频。
      </div>
    </div>

    <div v-show="store.getUploadItem() === 'video'" class="setting">
      <div>
        <span class="notice"><span style="color: red;">*</span>视频：</span>
        <el-button :disabled="videoUploadPercent !== 0 || video.videoUrl === ''"
          @click="previewVideo(video.videoUrl)">预览</el-button>
        <el-button :disabled="videoUploadPercent !== 0" @click="openVideoUpload">重新上传</el-button>
      </div>
      <el-progress v-show="videoUploadPercent !== 0" :percentage="videoUploadPercent" class="prg" :stroke-width="10" />
      <span class="tip">上传的视频大小上限为1G</span>
      <br>
      <span class="tip">上传视频，即表示您已同意 <span style="color: #409EFF;">浅时使用协议</span> ，请勿上传色情，反动等违法视频。</span>

      <div>
        <span class="notice"><span style="color: red;">*</span>封面：</span>
        <div v-show="video.coverUrl === ''" @click="openCoverUpload" class="upload-cover-div">
          <span style="font-size: 42px;">+</span>
          <span>上传封面</span>
        </div>

        <el-image v-show="video.coverUrl !== ''" :style="coverUploadPercent === 0 ? '' : 'opacity: 0.25;'"
          @click="openCoverUpload" class="cover" :src="video.coverUrl"></el-image>

        <el-progress v-show="coverUploadPercent !== 0" :percentage="coverUploadPercent" :width="118.125"
          style="position: absolute; margin-left: 130.9375px;" type="circle" />

        <el-upload :before-upload="beforeCoverUpload" :on-remove="onCoverUploadRemove" :on-change="onCoverUploadChange"
          :on-progress="onCoverUploadProgress" :on-success="onCoverUploadSuccess" :on-error="onCoverUploadError"
          ref="coverUpload" action="/api/resource/cover" accept="image/*" v-show="false"></el-upload>
      </div>
      <span class="tip">上传的图片大小上限为10M</span>
      <br>
      <span class="tip">推荐使用16:9的图片</span>

      <div>
        <span class="notice"><span style="color: red;">*</span>标题：</span>
        <el-input ref="titleInput" v-model="video.title" maxlength="50" placeholder="请输入标题" show-word-limit />
      </div>

      <div>
        <span class="notice"><span style="color: red;">*</span>分区：</span>
        <el-select ref="regionSelect" v-model="video.region" placeholder="请选择分区">
          <el-option label="番剧" value="anime" />
          <el-option label="游戏" value="game" />
          <el-option label="音乐" value="music" />
          <el-option label="科技" value="tech" />
          <el-option label="其它" value="other" />
        </el-select>
      </div>

      <div>
        <span class="notice">标签：</span>
        <div class="tag-container">
          <el-tag class="tag" v-for="tag in video.tags" closable @close="delTag(tag)">
            {{ tag }}
          </el-tag>
          <input v-if="newTagInputVisible" class="new-tag-input" ref="newTagInput" v-model="newTagInputValue"
            @keyup.enter="newTag" @blur="newTag">
          <el-button class="new-tag-btn" v-else size="small" @click="showNewTagInput">
            + New Tag
          </el-button>
        </div>
      </div>

      <div>
        <span class="notice">简介：</span>
        <el-input v-model="video.intro" maxlength="250" rows="3" placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧" type="textarea"
          show-word-limit />
      </div>

      <div>
        <span class="notice">权益声明：</span>
        <el-checkbox v-model="video.empower" label="未经作者授权，禁止转载" />
      </div>
      <span class="tip">勾选后该文案会显示在视频播放页中，此选项可以在再次编辑时取消。<span style="color: #FF6699;">一旦取消勾选操作，不可再次勾选。</span></span>

      <div style="justify-content: center;">
        <el-button
          :disabled="videoUploadPercent !== 0 || coverUploadPercent !== 0 || video.videoUrl === '' || video.coverUrl === '' || video.title === '' || video.region === ''"
          @click="uploadVideo" type="primary" size="large">投稿</el-button>
      </div>
    </div>
  </div>

  <el-dialog v-model="previewVideoWindowVisible" :custom-class="'preview-video'" :before-close="beforePVWindowClose"
    destroy-on-close align-center>
    <video volume="0.5" controls :src="previewVideoUrl"></video>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadInstance, ElSelect, ElInput } from 'element-plus'
import { useStore } from "../../../store"
import * as common from "../../../common"

type Video = {
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean
}

const store = useStore()

const coverUpload = ref<UploadInstance>()
const videoUpload = ref<UploadInstance>()
const newTagInput = ref<HTMLInputElement>()
const titleInput = ref<InstanceType<typeof ElInput>>()

let video: Video = reactive({
  videoUrl: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: false
})
let preCoverId = ref(0)
let preVideoId = ref(0)
let preCoverUrl = ref("")
let preVideoUrl = ref("")
let coverUploadPercent = ref(0)
let videoUploadPercent = ref(0)
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)
let previewVideoWindowVisible = ref(false)
let previewVideoUrl = ref("")

function previewVideo(url: string) {
  previewVideoUrl.value = url
  previewVideoWindowVisible.value = true
}

function beforePVWindowClose(done: Function) {
  previewVideoUrl.value = "" //不清除url会导致在video元素被销毁后仍然可以通过按键播放
  done()
}

function openCoverUpload() {
  if (coverUploadPercent.value !== 0) {
    common.showError("图片上传时禁止修改")
    return
  }
  coverUpload.value?.$el.querySelector('input').click()
}

function openVideoUpload() {
  videoUpload.value?.$el.querySelector('input').click()
}

function beforeVideoUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 / 1024 > 1) {
    common.showError("上传的视频大小不能超过1G")
    return false
  }
  store.setUploadItem("video")
  store.switchAsk = true
  return true
}

function beforeCoverUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > 10) {
    common.showError("上传的图片大小不能超过10M")
    return false
  }
  return true
}

function onVideoUploadRemove() {
  video.videoUrl = preVideoUrl.value
}

function onCoverUploadRemove() {
  video.coverUrl = preCoverUrl.value
}

function onVideoUploadChange(file: any) {
  if (file.uid !== preVideoId.value) {
    preVideoId.value = file.uid
    video.videoUrl = URL.createObjectURL(file.raw)
  }
}

function onCoverUploadChange(file: any) {
  if (file.uid !== preCoverId.value) {
    preCoverId.value = file.uid
    video.coverUrl = URL.createObjectURL(file.raw)
  }
}

function onVideoUploadProgress(event: any) {
  videoUploadPercent.value = Math.floor(event.percent)
}

function onCoverUploadProgress(event: any) {
  coverUploadPercent.value = Math.floor(event.percent)
}

function onVideoUploadSuccess() {
  preVideoUrl.value = video.videoUrl
  videoUploadPercent.value = 0
  common.showSuccess("视频上传成功")
}

function onCoverUploadSuccess() {
  preCoverUrl.value = video.coverUrl
  coverUploadPercent.value = 0
}

function onVideoUploadError() {
  video.videoUrl = preVideoUrl.value
  videoUploadPercent.value = 0
  common.showError("视频上传失败")
}

function onCoverUploadError() {
  video.coverUrl = preCoverUrl.value
  coverUploadPercent.value = 0
  common.showError("图片上传失败")
}

function delTag(tag: string) {
  video.tags.splice(video.tags.indexOf(tag), 1)
}

function showNewTagInput() {
  newTagInputVisible.value = true
  nextTick(() => {
    newTagInput.value!.focus()
  })
}

function newTag() {
  let val = newTagInputValue.value
  if (val) {
    if (video.tags.includes(val)) {
      common.showError("该标签已存在")
      newTagInput.value!.focus()
      return
    }
    video.tags.push(val)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
}

function uploadVideo() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    common.showError("请输入标题")
    titleInput.value?.focus()
    return
  }

  common.showSuccess("投稿成功")
}
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}

.setting {
  margin-top: 20px;
  width: 800px;
}

.setting>div {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.v-container .tip {
  font-size: 12px;
  color: #909399;
  margin-left: 85px;
}

.setting .notice {
  font-size: 14px;
  margin-right: 10px;
  min-width: 75px;
  text-align: right;
}

.setting .upload-cover-div {
  width: 210px;
  height: 116.125px;
  /* 这里的高度必须比cover的高度少2px，因为上下的border还占了2px */
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

.setting .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
}

.setting .tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.setting .tag,
.setting .new-tag-btn {
  min-width: 100px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
}

.setting .new-tag-input {
  width: 78px;
  height: 18px;
  font-size: 14px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #409EFF;
  padding: 5px 10px;
}

.setting .prg {
  margin-top: 0 !important;
  margin-left: 85px;
}
</style>

<style>
.setting .prg .el-progress__text {
  font-size: 14px !important;
  display: flex;
  justify-content: right;
  margin-left: -10px;
}

.v-container .el-tabs__nav {
  z-index: inherit;
}

.v-container .el-tabs__nav-wrap::after {
  z-index: inherit;
}

.v-container .el-form-item {
  margin-bottom: 10px;
}

.v-container .el-image {
  vertical-align: top;
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