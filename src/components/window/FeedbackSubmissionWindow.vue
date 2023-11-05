<template>
  <el-dialog v-model="mainWindowVisible" :title="title" custom-class="main" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>
    <el-input v-model="msg" ref="inputEle" :placeholder="placeholder" resize="none" rows="5" maxlength="500"
      show-word-limit type="textarea" />

    <el-upload action="/api/test" v-model:file-list="fileList"
      :on-preview="(file: any) => { openPreviewWindow(file.url) }" :on-exceed="onExceed" :on-change="onChange"
      ref="uploadRef" accept="image/*" :limit="9" class="upload" :auto-upload="false" multiple
      list-type="picture-card"><el-icon>
        <Plus />
      </el-icon></el-upload>
    <div class="tip">
      <span>上传的图片大小上限为10M，最多上传9张图片。</span>
    </div>

    <template #footer>
      <el-button v-blur @click="closeMainWindow">取消</el-button>
      <el-button v-blur @click="submit" type="primary">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="previewWindowVisible" custom-class="preview" align-center>
    <Image :round="false" :url="previewImgUrl"></Image>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadInstance, ElInput } from 'element-plus'
import { useStore } from "@/store"
import cmjs from '@/cmjs'

const store = useStore()
store.openFSWindow = openMainWindow

const uploadRef = ref<UploadInstance>()
const inputEle = ref<InstanceType<typeof ElInput>>()

let title = ref("")
let bzUrl = ref("")
let placeholder = ref("")
let failMsg = ref("内容不能为空")
let succMsg = ref("提交成功")
let afterSuccDo: Function = () => { }
let afterDo: Function = () => { }

let mainWindowVisible = ref(false)
let previewWindowVisible = ref(false)
let msg = ref("")
let data = ref<object>({})
let fileList = ref([])
let previewImgUrl = ref("")

function openMainWindow(titleP: string, bzUrlP: string, dataP: object, placeholderP?: string, failMsgP?: string, succMsgP?: string, afterSuccDoP?: Function, afterDoP?: Function) {
  title.value = titleP
  bzUrl.value = bzUrlP
  data.value = dataP

  if (placeholderP) {
    placeholder.value = placeholderP
  }
  if (failMsgP) {
    failMsg.value = failMsgP
  }
  if (succMsgP) {
    succMsg.value = succMsgP
  }
  if (afterSuccDoP) {
    afterSuccDo = afterSuccDoP
  }
  if (afterDoP) {
    afterDo = afterDoP
  }

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  msg.value = ""
  fileList.value = []

  afterDo()
}

function openPreviewWindow(imgUrl: string) {
  previewImgUrl.value = imgUrl

  previewWindowVisible.value = true
}

function submit() {
  msg.value = msg.value.trim()
  if (msg.value === "") {
    inputEle.value?.focus()
    cmjs.prompt.error(failMsg.value)
    return
  }

  // TODO api
  // 1.向后端某一接口获取oss签名上传链接数组和文件名数组
  // 2.遍历该数组，每上传一张图片则修改一次upload的action（上传过程中禁止掉下方的按钮）
  // 3.向bzUrl(实际业务接口)发起post请求上传msg和文件名数组

  const uploadPayload = {
    msg: msg.value,
    data: data.value
  }
  // uploadPayload还有上传成功后的文件名列表
  console.log(uploadPayload)

  afterSuccDo()
  closeMainWindow()
  cmjs.prompt.success(succMsg.value)
}

function onExceed() {
  cmjs.prompt.error("最多上传9张图片")
}

function onChange(file: any) {
  if (file.status === "ready" && file.size / 1024 / 1024 > 10) {
    uploadRef.value!.handleRemove(file)
    cmjs.prompt.error("上传的图片大小不能超过10M")
  }
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