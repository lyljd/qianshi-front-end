<template>
  <el-dialog v-model="mainWindowVisible" :title="title" custom-class="main" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>
    <el-input v-model="msg" ref="inputEle" :placeholder="placeholder" resize="none" rows="5" :maxlength="msgMaxlength"
      show-word-limit type="textarea" />

    <el-upload v-model:file-list="fileList" ref="uploadRef" class="upload" multiple accept="image/*"
      :on-preview="(file: any) => { openPreviewWindow(file.url) }" :on-change="onChange" :on-exceed="onExceed"
      list-type="picture-card" :auto-upload="false" :limit="fileNum"><el-icon>
        <Plus />
      </el-icon></el-upload>
    <div class="tip">
      <span>上传的单张图片大小上限为{{ fileSize }}M，最多上传{{ fileNum }}张图片。</span>
    </div>

    <template #footer>
      <el-button v-blur @click="closeMainWindow">取消</el-button>
      <el-button v-blur @click="submit" type="primary">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="previewWindowVisible" custom-class="preview" align-center>
    <Image :url="previewImgUrl"></Image>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadInstance, ElInput } from 'element-plus'
import { useStore } from "@/store"
import cmjs from '@/cmjs'

type Opt = {
  title: string,
  placeholder?: string,
  msgMaxlength?: number,
  fileSize?: number,
  fileNum?: number,
  submitHandler: (msg: string, fileList: File[], closeWindow: Function) => void,
  cancelHandler?: Function,
}

const store = useStore()
store.openFSWindow = openMainWindow

const inputEle = ref<InstanceType<typeof ElInput>>()
const uploadRef = ref<UploadInstance>()

let title: string
let placeholder = ""
let msgMaxlength = 500
let fileSize = 5 // 单位：MB
let fileNum = 5
let submitHandler: (msg: string, fileList: File[], closeWindow: Function) => void
let cancelHandler: Function = () => { }

let mainWindowVisible = ref(false)
let previewWindowVisible = ref(false)
let msg = ref("")
let fileList = ref([])
let previewImgUrl = ref("")

function openMainWindow(opt: Opt) {
  title = opt.title
  opt.placeholder ? placeholder = opt.placeholder : undefined
  opt.msgMaxlength ? msgMaxlength = opt.msgMaxlength : undefined
  opt.fileSize ? fileSize = opt.fileSize : undefined
  opt.fileNum ? fileNum = opt.fileNum : undefined
  submitHandler = opt.submitHandler
  opt.cancelHandler ? cancelHandler = opt.cancelHandler : undefined

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  msg.value = ""
  fileList.value = []

  cancelHandler()
}

function openPreviewWindow(imgUrl: string) {
  previewImgUrl.value = imgUrl

  previewWindowVisible.value = true
}

function submit() {
  msg.value = msg.value.trim()
  if (msg.value === "") {
    inputEle.value?.focus()
    cmjs.prompt.error("输入不能为空")
    return
  }

  submitHandler(msg.value, fileList.value, closeMainWindow)
}

function onChange(file: any) {
  if (file.status === "ready" && file.size / 1024 / 1024 > fileNum) {
    uploadRef.value!.handleRemove(file)
    cmjs.prompt.error(`上传的单张图片大小不能超过${fileNum}M`)
  }
}

watch(fileList, () => {
  const addBox = document.getElementsByClassName("el-upload el-upload--picture-card")[0] as HTMLDivElement
  if (fileList.value.length === fileNum) {
    addBox.style.display = "none"
  } else {
    addBox.style.display = "flex"
  }
}, {
  deep: true,
})

function onExceed() {
  cmjs.prompt.error(`最多上传${fileNum}张图片`)
}
</script>

<style lang="less" scoped></style>

<style>
.main .el-dialog__header,
.main .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.main .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.upload {
  margin-top: 20px;
}

.upload .el-upload-list {
  display: flex;
  gap: 5px;
}

.upload .el-upload-list__item,
.upload .el-upload--picture-card {
  margin: 0 !important;
  width: calc((50vw - 40px) / 5 - 4px) !important;
  height: calc((50vw - 40px) / 5 - 4px) !important;
}

.preview .el-dialog__header {
  display: none;
}

.preview .el-dialog__body {
  padding: 0;
}
</style>