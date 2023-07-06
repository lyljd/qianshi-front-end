<template>
  <div class="v-container">
    <div v-if="store.getUploadItem() === ''">
      <el-upload :before-upload="beforeVideoUpload" :on-progress="onVideoUploadProgress"
        :on-success="onVideoUploadSuccess" :on-error="onVideoUploadError" action="/api/resource/video" accept="video/*"
        drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽到此处上传 或 <em>点击此处选择文件上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            上传的视频大小上限为1G
          </div>
        </template>
      </el-upload>
      <div class="tip">上传视频，即表示您已同意 <span style="color: #409EFF;">浅时使用协议</span> ，请勿上传色情，反动等违法视频。</div>
    </div>

    <div style="width: 800px;" v-else>
      <div style="margin-bottom: 10px;">
        <strong>视频上传进度</strong>
      </div>
      <el-progress :class="{ pg: !videoHasUpload, pgf: videoHasUpload }" :percentage="videoUploadPercent"
        :status="videoHasUpload ? 'success' : ''" :indeterminate="!videoHasUpload" :stroke-width="10" />

      <div class="setting">
        <strong>视频详情设置</strong>

        <div>
          <span class="notice"><span style="color: red;">*</span>封面：</span>
          <div v-show="coverUrl === ''" @click="openCoverUpload" class="cover upload-cover-div">
            <span style="font-size: 42px;">+</span>
            <span>上传封面</span>
          </div>

          <el-image :style="coverHasUpload ? '' : 'opacity: 0.25;'" @click="openCoverUpload" v-show="coverUrl !== ''"
            class="cover" :src="coverUrl"></el-image>

          <el-progress v-show="!coverHasUpload && coverUrl !== ''" width="118.125"
            style="position: absolute; margin-left: 130.9375px;" type="circle" :percentage="coverUploadPercent" />

          <el-upload :on-change="onCoverUploadChange" :before-upload="beforeCoverUpload" :on-remove="onCoverUploadRemove"
            :on-progress="onCoverUploadProgress" :on-success="onCoverUploadSuccess" :on-error="onCoverUploadError"
            ref="coverUpload" action="/api/resource/cover" accept="image/*" v-show="false"></el-upload>

          <span class="info">注：推荐使用16:9的图片</span>
        </div>
        <span style="margin-left: 85px; font-size: 12px; color: #909399;">上传的图片大小上限为10M</span>

        <div>
          <span class="notice"><span style="color: red;">*</span>标题：</span>
          <el-input ref="titleInput" v-model="vu.title" maxlength="50" placeholder="请输入标题" show-word-limit />
        </div>

        <div>
          <span class="notice"><span style="color: red;">*</span>分区：</span>
          <el-select ref="regionSelect" v-model="vu.region" placeholder="请选择分区">
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
            <el-tag class="tag" v-for="tag in vu.tags" closable @close="delTag(tag)">
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
          <el-input v-model="vu.intro" maxlength="250" rows="3" placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧" type="textarea"
            show-word-limit />
        </div>

        <div>
          <span class="notice">权益声明：</span>
          <el-checkbox v-model="vu.empower" label="未经作者授权，禁止转载" />
        </div>

        <div style="justify-content: center;">
          <el-button :disabled="!videoHasUpload" @click="uploadVideo" type="primary" size="large">立即投稿</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadInstance, ElMessage, ElSelect, ElInput } from 'element-plus'
import { useStore } from "../../../store"

type VideoUpload = {
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean
}

const store = useStore()

const coverUpload = ref<UploadInstance>()
const newTagInput = ref<HTMLInputElement>()
const titleInput = ref<InstanceType<typeof ElInput>>()
const regionSelect = ref<InstanceType<typeof ElSelect>>()

let vu: VideoUpload = reactive({
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: false
})
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)
let coverUrl = ref("")
let preCoverId = ref(0)
let coverHasUpload = ref(false)
let videoHasUpload = ref(false)
let coverUploadPercent = ref(0)
let videoUploadPercent = ref(0)

function openCoverUpload() {
  if (coverUrl.value !== "" && !coverHasUpload.value) {
    showError("图片上传时禁止修改")
    return
  }
  coverUpload.value?.$el.querySelector('input').click()
}

function delTag(tag: string) {
  vu.tags.splice(vu.tags.indexOf(tag), 1)
}

function showNewTagInput() {
  newTagInputVisible.value = true
  nextTick(() => {
    newTagInput.value!.focus()
  })
}

function newTag() {
  if (newTagInputValue.value) {
    vu.tags.push(newTagInputValue.value)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
}

function onCoverUploadChange(file: any) {
  if (file.uid !== preCoverId.value) {
    preCoverId.value = file.uid
    coverUrl.value = URL.createObjectURL(file.raw)
  }
}

function beforeCoverUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > 10) {
    showError("上传的图片大小不能超过10M")
    return false
  }
  coverHasUpload.value = false
  return true
}

function onCoverUploadRemove() {
  coverUrl.value = ""
}

function onCoverUploadProgress(event: any) {
  coverUploadPercent.value = Math.floor(event.percent)
}

function onCoverUploadSuccess() {
  coverHasUpload.value = true
}

function onCoverUploadError() {
  coverUrl.value = ""
  showError("图片上传失败")
}

function beforeVideoUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 / 1024 > 1) {
    showError("上传的视频大小不能超过1G")
    return false
  }
  store.setUploadItem("video")
  store.switchAsk = true
  return true
}

function onVideoUploadProgress(event: any) {
  videoUploadPercent.value = Math.floor(event.percent)
}

function onVideoUploadSuccess() {
  videoHasUpload.value = true
}

function onVideoUploadError() {
  store.setUploadItem("")
  showError("视频上传失败")
}

function showError(msg: string) {
  ElMessage({
    type: 'error',
    offset: 77,
    message: msg,
  })
}

function uploadVideo() {
  //TODO 还需要检查封面
  vu.title = vu.title.trim()
  vu.intro = vu.intro.trim()
  if (vu.title.length === 0) {
    showError("请输入标题")
    titleInput.value?.focus()
    return
  }
  if (vu.region === "") {
    showError("请选择分区")
    regionSelect.value?.focus()
    return
  }
  ElMessage({
    type: 'success',
    offset: 77,
    message: "投稿成功",
  })
}
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}

.v-container .tip {
  text-align: center;
  font-size: 12px;
  color: #909399;
}

.v-container .setting {
  margin-top: 20px;
}

.v-container .setting>div {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.v-container .notice {
  font-size: 14px;
  margin-right: 10px;
  min-width: 75px;
  text-align: right;
}

.v-container .info {
  font-size: 14px;
  margin-left: 10px;
  color: #909399;
}

.v-container .upload-cover-div {
  border: 1px dashed #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.v-container .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
}

.v-container .tag-container {
  line-height: 35px;
}

.v-container .tag {
  margin-right: 5px;
}

.v-container .tag,
.v-container .new-tag-btn {
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
  min-width: 100px;
}

.v-container .new-tag-input {
  width: 78px;
}

.v-container input {
  outline: none;
  border-radius: 5px;
  border: 1px solid #c8c9cc;
  padding: 5px 10px;
  font-size: 14px;
  height: 18px;
}

.v-container input:hover {
  border: 1px solid #b1b3b8;
}

.v-container input:focus {
  border: 1px solid #409EFF;
}
</style>

<style>
.v-container .pg .el-progress__text {
  font-size: 14px !important;
  display: flex;
  justify-content: right;
  margin-left: -10px;
}

.v-container .pgf .el-progress__text {
  font-size: 14px !important;
  display: flex;
  justify-content: right;
  margin-left: -30px;
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
</style>