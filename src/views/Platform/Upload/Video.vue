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
        <span class="notice">分区：</span>
        <el-select @visible-change="selectShow" ref="regionSelect" v-model="video.region" placeholder="请选择分区">
          <template #empty>
            <div v-loading="loading">暂无分区</div>
          </template>
          <el-option v-for="r in store.regions" :label="r.name" :value="r.slug" />
        </el-select>
      </div>

      <div class="row">
        <span class="notice">标签：</span>
        <TagInput :tags="video.tags" :limit="10"></TagInput>
      </div>

      <div class="row">
        <span class="notice">简介：</span>
        <el-input v-model="video.intro" maxlength="1000" rows="3" placeholder="请输入简介" type="textarea" show-word-limit />
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
        <el-button v-blur v-loading="uploading"
          :disabled="videoUploading || coverUploading || uploading || video.videoName === '' || video.coverName === '' || video.title.trim() === ''"
          @click="submit" type="primary" size="large">投稿</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSelect, ElInput, ElMessageBox } from 'element-plus'
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import ImageUpload from "@/components/common/ImageUpload.vue"
import VideoUpload from "@/components/common/VideoUpload.vue"
import TagInput from '@/components/common/TagInput.vue'
import * as VideoAPI from '@/api/video'
import * as AuthAPI from '@/api/auth'
import * as UploadAPI from '@/api/upload'
import { AxiosProgressEvent } from "axios"

type Video = {
  videoName: string,
  coverName: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean,
  autoPublish: boolean
}

type UploadPara = {
  url: string
  filename: string
  contentType: string
  xOssCallback: string
}

const store = useStore()
store.setPlatformItemIndex(1, location.pathname)

const titleInputRef = ref<InstanceType<typeof ElInput>>()

let coverUploading = ref(false)
let videoUploading = ref(false)
let loading = ref(false) // 加载分区中
let uploading = ref(false) // 投稿中

let video: Video = reactive({
  videoName: "",
  coverName: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: true,
  autoPublish: true,
})
let setCoverUrl: Function
let setVideoUrl: Function

const unwatch = watch(video, () => {
  store.switchAsk = true
  unwatch()
})

onMounted(() => {
  let unUsedVideoName = cmjs.cache.getCookie("upload:video:videoName")
  let unUsedVideoUrl = cmjs.cache.getCookie("upload:video:videoUrl")
  let unUsedCoverName = cmjs.cache.getCookie("upload:video:coverName")
  let unUsedCoverUrl = cmjs.cache.getCookie("upload:video:coverUrl")

  if (unUsedVideoName !== "" && unUsedVideoUrl != "" || unUsedCoverName !== "" && unUsedCoverUrl != "") {
    ElMessageBox.confirm(
      '你有上传至云端但未使用的文件，是否要继续使用？',
      '文件提醒',
      {
        confirmButtonText: '使用',
        cancelButtonText: '不使用',
        type: 'info',
        autofocus: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }
    )
      .then(() => {
        video.videoName = unUsedVideoName
        setVideoUrl(unUsedVideoUrl)
        video.coverName = unUsedCoverName
        setCoverUrl(unUsedCoverUrl)
      })
      .catch(() => {
        cmjs.cache.delCookie("upload:video:videoName")
        cmjs.cache.delCookie("upload:video:videoUrl")
        cmjs.cache.delCookie("upload:video:coverName")
        cmjs.cache.delCookie("upload:video:coverUrl")
      })
  }
})

async function coverUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  let up: UploadPara = { url: "", filename: "", contentType: "", xOssCallback: "" }

  await AuthAPI.getUploadUrl("cover", cmjs.util.getFileSuffix(file.name))
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
        return
      }

      up = res.data
    })
    .catch((err) => {
      fail(err)
    })

  if (up === undefined) {
    return
  }

  coverUploading.value = true
  let fileBinStr = URL.createObjectURL(file)
  setCoverUrl(fileBinStr)

  UploadAPI.upload({
    uploadUrl: up.url,
    file: file,
    contentType: up.contentType,
    xOssCallback: up.xOssCallback,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      percent.value = Math.round((progressEvent.loaded / (progressEvent.total as number)) * 100)
    },
  })
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
      }

      video.coverName = up.filename
      cmjs.cache.setCookie("upload:video:coverName", up.filename, 3600)
      cmjs.cache.setCookie("upload:video:coverUrl", res.data.url, 3600)
      succ()
    })
    .catch((err) => {
      fail(err)
    })
    .finally(() => {
      coverUploading.value = false
    })
}

async function videoUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  let up: UploadPara = { url: "", filename: "", contentType: "", xOssCallback: "" }

  await AuthAPI.getUploadUrl("video", cmjs.util.getFileSuffix(file.name))
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
        return
      }

      up = res.data
    })
    .catch((err) => {
      fail(err)
    })

  if (up === undefined) {
    return
  }

  videoUploading.value = true
  let fileBinStr = URL.createObjectURL(file)
  setVideoUrl(fileBinStr)

  UploadAPI.upload({
    uploadUrl: up.url,
    file: file,
    contentType: up.contentType,
    xOssCallback: up.xOssCallback,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      percent.value = Math.round((progressEvent.loaded / (progressEvent.total as number)) * 100)
    },
  })
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
      }

      video.videoName = up.filename
      cmjs.cache.setCookie("upload:video:videoName", up.filename, 3600)
      cmjs.cache.setCookie("upload:video:videoUrl", res.data.url, 3600)
      succ()
    })
    .catch((err) => {
      fail(err)
    })
    .finally(() => {
      videoUploading.value = false
    })
}

function submit() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInputRef.value?.focus()
    return
  }

  uploading.value = true
  VideoAPI.uploadVideo(video)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      cmjs.cache.delCookie("upload:video:videoName")
      cmjs.cache.delCookie("upload:video:coverName")
      store.switchAsk = false
      cmjs.prompt.success("投稿成功")
      video.videoName = "" // 防止在跳转前的1秒内再次点击
      setTimeout(() => {
        cmjs.jump.push("../article/video?tab=isPubing")
      }, 1000) // 跳转过快会无法加载最新的数据（应该是后端数据库还没来得及）
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      uploading.value = false
    })
}

async function selectShow() {
  if (store.regions.length === 0) {
    loading.value = true
    await store.getRegions()
    loading.value = false
  }
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