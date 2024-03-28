<template>
  <div class="v-container">
    <div class="upload-form">
      <div class="row">
        <span class="notice"><span class="require">*</span>视频：</span>
        <VideoUpload style="width: 100%;" @setVideoUrl="(f: Function) => { setVideoUrl = f }"
          :uploadHandler="videoUploadHandler">
        </VideoUpload>
      </div>

      <div class="row">
        <span class="notice"><span class="require">*</span>封面：</span>
        <ImageUpload @setImgUrl="(f: Function) => { setCoverUrl = f }" :w="270" :h="151.88" proportion="16:9"
          :uploadHandler="coverUploadHandler">
        </ImageUpload>
      </div>

      <div class="row">
        <span class="notice"><span class="require">*</span>标题：</span>
        <el-input ref="titleInputRef" v-model="video.title" maxlength="50" placeholder="请输入标题" show-word-limit />
      </div>

      <div class="row">
        <span class="notice"><span class="require">*</span>分区：</span>
        <el-select ref="regionSelect" v-model="video.region" placeholder="请选择分区">
          <el-option label="番剧" value="anime" />
          <el-option label="游戏" value="game" />
          <el-option label="音乐" value="music" />
          <el-option label="科技" value="tech" />
          <el-option label="其它" value="other" />
        </el-select>
      </div>

      <div class="row">
        <span class="notice">标签：</span>
        <TagInput :tags="video.tags" :limit="10"></TagInput>
      </div>

      <div class="row">
        <span class="notice">简介：</span>
        <el-input v-model="video.intro" maxlength="250" rows="3" placeholder="请输入简介" type="textarea" show-word-limit />
      </div>

      <div class="row">
        <span class="notice">权益声明：</span>
        <div>
          <el-checkbox v-model="video.empower" label="未经作者授权，禁止转载" />
          <div class="tip">
            <span>勾选后该文案会显示在视频播放页中</span>
            <span style="color: #FF6699;">若在初次投稿时未勾选该项，后续在编辑时将不能勾选。</span>
          </div>
        </div>
      </div>

      <div class="row">
        <span class="notice">自动发布：</span>
        <div>
          <el-checkbox v-model="video.autoPublish" label="审批通过后自动发布" />
          <div class="tip">
            <span>若未勾选该项，则在审批通过后需要自行手动点击发布</span>
          </div>
        </div>
      </div>

      <div class="row" style="justify-content: center;">
        <el-button v-blur
          :disabled="videoUploading || coverUploading || video.videoUrl === '' || video.coverUrl === '' || video.title === '' || video.region === ''"
          @click="submit" type="primary" size="large">投稿</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSelect, ElInput } from 'element-plus'
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import ImageUpload from "@/components/common/ImageUpload.vue"
import VideoUpload from "@/components/common/VideoUpload.vue"
import TagInput from '@/components/common/TagInput.vue'

type Video = {
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean,
  autoPublish: boolean
}

const store = useStore()
store.setPlatformItemIndex(1, location.pathname)

const titleInputRef = ref<InstanceType<typeof ElInput>>()

let video: Video = reactive({
  videoUrl: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: true,
  autoPublish: true,
})
let coverUploading = ref(false)
let videoUploading = ref(false)
let setCoverUrl: Function
let setVideoUrl: Function

const unwatch = watch(video, () => {
  store.switchAsk = true
  unwatch()
})

function coverUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  coverUploading.value = true

  // TODO api

  const url = URL.createObjectURL(file)
  setCoverUrl(url)
  const timer = setInterval(() => {
    const randPercent = Math.floor(Math.random() * 26) + 25 // [25,50]，整数
    if (percent.value + randPercent < 100) {
      percent.value += randPercent
    } else {
      percent.value = 100
      clearInterval(timer)
      coverUploading.value = false
      video.coverUrl = url // fail时不能设置！！
      succ()
      // fail()
    }
  }, 1000)
}

function videoUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  videoUploading.value = true

  // TODO api

  const url = URL.createObjectURL(file)
  setVideoUrl(url)
  const timer = setInterval(() => {
    const randPercent = Math.floor(Math.random() * 11) + 10 // [10,20]，整数
    if (percent.value + randPercent < 100) {
      percent.value += randPercent
    } else {
      percent.value = 100
      clearInterval(timer)
      videoUploading.value = false
      video.videoUrl = url // fail时不能设置！！
      succ()
      // fail()
    }
  }, 1000)
}

function submit() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInputRef.value?.focus()
    return
  }

  //TODO api
  console.log(video)

  store.switchAsk = false
  cmjs.prompt.success("投稿成功")
  cmjs.jump.push("../article/video?tab=isPubing")
}
</script>

<style lang="less" scoped>
.v-container {
  margin-top: 20px;

  .upload-form {
    .row {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .notice {
        font-size: 14px;
        margin-right: 10px;
        min-width: 75px;
        text-align: right;

        .require {
          color: red;
        }
      }
    }
  }
}
</style>