<template>
  <el-dialog v-model="mainWindowVisible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false"
    :show-close="false" align-center>
    <div v-if="tip" class="tip" style="margin-top: 0;">
      <span style="color: red; margin-bottom: 3px;">{{ tip }}</span>
    </div>

    <el-input v-model="msg" ref="inputEle" :placeholder="placeholder" :readonly="submitting" resize="none" rows="5"
      :maxlength="msgMaxlength" show-word-limit type="textarea" />

    <el-upload v-model:file-list="fileList" ref="uploadRef" class="upload" multiple accept="image/*"
      :on-preview="(file: any) => { openPreviewWindow(file.url) }" :on-change="onChange" :on-exceed="onExceed"
      :before-remove="beforeRemove" list-type="picture-card" :auto-upload="false" :limit="fileNum"><el-icon>
        <Plus />
      </el-icon></el-upload>
    <div class="tip">
      <span>上传的单张图片大小上限为{{ fileSize }}M，最多上传{{ fileNum }}张图片。</span>
    </div>

    <template #footer>
      <el-button v-blur :disabled="submitting" @click="closeMainWindow">取消</el-button>
      <el-button v-blur v-loading="submitting" :disabled="submitting" @click="submit" type="primary">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="previewWindowVisible" align-center class="preview">
    <Image :url="previewImgUrl"></Image>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadInstance, ElInput, UploadFile, UploadUserFile } from 'element-plus'
import { useStore } from "@/store"
import cmjs from '@/cmjs'

type Opt = {
  title: string
  tip?: string
  placeholder?: string
  msgMaxlength?: number
  fileSize?: number
  fileNum?: number
  submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => void
  cancelHandler?: Function
}

const store = useStore()
store.openFSWindow = openMainWindow

const inputEle = ref<InstanceType<typeof ElInput>>()
const uploadRef = ref<UploadInstance>()

let submitting = ref(false)

let title: string
let tip = ""
let placeholder = ""
let msgMaxlength = 500
let fileSize = 5 // 单位：MB
let fileNum = 5
let submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => void
let cancelHandler: Function = () => { }

let mainWindowVisible = ref(false)
let previewWindowVisible = ref(false)
let msg = ref("")
let fileList = ref<UploadUserFile[]>([])
let previewImgUrl = ref("")
let changeCauseRemove = ref(false)
let hashs = new Set<string>()

function openMainWindow(opt: Opt) {
  title = opt.title
  tip = opt.tip ? opt.tip : ""
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
  hashs.clear()

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

  submitHandler(msg.value, fileList.value, submitting, closeMainWindow)
}

function onChange(file: UploadFile) {
  const hash = calcHash(file)
  if (hashs.has(hash)) {
    changeCauseRemove.value = true
    uploadRef.value!.handleRemove(file)
    changeCauseRemove.value = false
    cmjs.prompt.warning(`请不要添加重复图片"${file.name}"`)
    return
  } else {
    hashs.add(hash)
  }

  if (submitting.value) {
    changeCauseRemove.value = true
    uploadRef.value!.handleRemove(file)
    changeCauseRemove.value = false
    cmjs.prompt.warning("提交期间不能新增图片")
    return
  }

  if (file.status === "ready" && file.size! / 1024 / 1024 > fileNum) {
    uploadRef.value!.handleRemove(file)
    cmjs.prompt.warning(`上传的单张图片大小不能超过${fileNum}M`)
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

function beforeRemove(file: UploadFile): boolean {
  if (!changeCauseRemove.value && submitting.value) {
    cmjs.prompt.warning("提交期间不能删除图片")
    return false
  }

  if (!changeCauseRemove.value) {
    hashs.delete(calcHash(file))
  }

  return true
}

function calcHash(file: UploadFile): string {
  return file.raw!.lastModified + file.name + file.size
}
</script>

<style lang="less" scoped></style>

<style>
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

.preview {

  .el-dialog__header,
  .el-dialog__footer {
    padding: 0;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>