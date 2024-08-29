<template>
  <div class="v-container">
    <div class="upload-form">
      <div class="row">
        <span class="notice"><span class="require">*</span>标题：</span>
        <el-input ref="titleInputRef" v-model="read.title" maxlength="50" placeholder="请输入标题" show-word-limit />
      </div>

      <div class="row">
        <span class="notice"><span class="require">*</span>正文：</span>
        <RichTextEditor v-model="read.htmlContent"></RichTextEditor>
      </div>

      <div class="row">
        <span class="notice">封面：</span>
        <ImageUpload @setImgUrl="(f: Function) => { setCoverUrl = f }" :w="270" :h="151.88" proportion="16:9"
          :uploadHandler="coverUploadHandler">
        </ImageUpload>
      </div>

      <div class="row">
        <span class="notice">分区：</span>
        <el-select @visible-change="selectShow" ref="regionSelect" v-model="read.region" placeholder="请选择分区">
          <template #empty>
            <div v-loading="loading">暂无分区</div>
          </template>
          <el-option v-for="r in store.readRegions" :label="r.name" :value="r.slug" />
        </el-select>
      </div>

      <div class="row">
        <span class="notice">标签：</span>
        <TagInput :tags="read.tags" :limit="10"></TagInput>
      </div>

      <div class="row">
        <span class="notice">自动发布：</span>
        <div>
          <el-checkbox v-model="read.autoPublish" label="审批通过后自动发布" />
          <div class="tip">
            <span>若未勾选该项，则在审批通过后需要自行手动点击发布</span>
          </div>
        </div>
      </div>

      <div class="row" style="justify-content: center;">
        <el-button v-blur v-loading="uploading"
          :disabled="coverUploading || uploading || read.title.trim() === '' || read.content.trim() === ''"
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
import TagInput from '@/components/common/TagInput.vue'
import * as ReadAPI from '@/api/read'
import * as AuthAPI from '@/api/auth'
import * as UploadAPI from '@/api/upload'
import { AxiosProgressEvent } from "axios"
import RichTextEditor from '@/components/common/RichTextEditor.vue'

type Read = {
  title: string
  content: string
  htmlContent: string
  coverName: string
  region: string
  tags: string[]
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
let loading = ref(false) // 加载分区中
let uploading = ref(false) // 投稿中

let read: Read = reactive({
  title: "",
  content: "",
  htmlContent: "",
  coverName: "",
  region: "",
  tags: [],
  autoPublish: true,
})
let setCoverUrl: Function

const unwatch = watch(read, () => {
  store.switchAsk = true
  unwatch()
})

onMounted(() => {
  let unUsedCoverName = cmjs.cache.getCookie("upload:read:coverName")
  let unUsedCoverUrl = cmjs.cache.getCookie("upload:read:coverUrl")

  if (unUsedCoverName !== "" && unUsedCoverUrl != "") {
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
        read.coverName = unUsedCoverName
        setCoverUrl(unUsedCoverUrl)
      })
      .catch(() => {
        cmjs.cache.delCookie("upload:read:coverName")
        cmjs.cache.delCookie("upload:read:coverUrl")
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
        return
      }

      read.coverName = up.filename
      cmjs.cache.setCookie("upload:read:coverName", up.filename, 3600)
      cmjs.cache.setCookie("upload:read:coverUrl", res.data.url, 3600)
      succ()
    })
    .catch((err) => {
      fail(err)
    })
    .finally(() => {
      coverUploading.value = false
    })
}

function submit() {
  read.title = read.title.trim()

  if (read.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInputRef.value?.focus()
    return
  }

  if (read.content.trim().length === 0) {
    read.content = read.content.trim()
    cmjs.prompt.error("请输入正文")
    return
  }

  uploading.value = true
  ReadAPI.uploadRead(read)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      cmjs.cache.delCookie("upload:read:videoName")
      cmjs.cache.delCookie("upload:read:coverName")
      store.switchAsk = false
      cmjs.prompt.success("投稿成功")
      read.coverName = "" // 防止在跳转前的1秒内再次点击
      setTimeout(() => {
        cmjs.jump.push("../article/read?tab=isPubing")
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
  if (store.readRegions.length === 0) {
    loading.value = true
    await store.getReadRegions()
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