<template>
  <el-dialog v-model="mainWindowVisible" title="设置广告" width="75%" custom-class="saw" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="首页" name="index">
          <Table @recEle="(ele: HTMLElement) => { indexTableEle = ele }" customId="index-table" page="index"
            :data="data.index"></Table>
        </el-tab-pane>

        <el-tab-pane label="视频页" name="video">
          <Table @recEle="(ele: HTMLElement) => { videoTableEle = ele }" customId="video-table" page="video"
            :data="data.video"></Table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="tip">
      <span>广告为空时对应页面的广告区域将不会显示</span>
      <span style="color: red;">每个页面的所有广告权重之和需为100</span>
    </div>

    <template #footer>
      <div style="float: left;">
        <el-button v-blur @click="add" type="success">添加</el-button>
      </div>
      <el-button v-blur @click="closeMainWindow">取消</el-button>
      <el-button v-blur @click="save" type="primary">保存</el-button>
    </template>
  </el-dialog>

  <AddWindow @open="(f: Function) => { openAddWindow = f }"></AddWindow>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Table from "@/components/util/SetAdvertisementWindowTable.vue"
import AddWindow from "@/components/window/AddAdvertisementWindow.vue"
import Data from "@/mock/manage/advertisement.json"
import { ElMessageBox } from 'element-plus'

type Data = {
  index: Advertisement[],
  video: Advertisement[],
}

type Advertisement = {
  type: string,
  content: string | Text,
  linkUrl: string,
  weight: number,
  createdAt: number,
  updatedAt: number,
}

type Text = {
  text: string,
  fontSize: number,
  fontColor: string,
  bgColor: string,
}

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openMainWindow)

let mainWindowVisible = ref(false)
let data: Data = reactive({ index: [], video: [] })
let dataCopy: Data = reactive({ index: [], video: [] })
let activeTab = ref("index")
let openAddWindow: Function
let indexTableEle: HTMLElement
let videoTableEle: HTMLElement
let switchAsk = ref(false)

function setData() {
  //TODO api请求
  data = reactive(Data)
  dataCopy = reactive({ index: Data.index, video: Data.video })
}

function openMainWindow() {
  setData()
  mainWindowVisible.value = true

  watch(data, newVal => {
    if (newVal !== dataCopy) {
      switchAsk.value = true
    } else {
      switchAsk.value = false
    }
  })
}

function closeMainWindow() {
  if (switchAsk.value) {
    ElMessageBox.confirm(
      '你所做的更改可能未保存',
      '关闭窗口？',
      {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'warning',
        autofocus: false,
        showClose: false,
      }
    ).then(() => {
      switchAsk.value = false
      mainWindowVisible.value = false
    }).catch(() => { })
  } else {
    mainWindowVisible.value = false
  }
}

function checkDataWeight(data: Advertisement[], tabName: string, pageName: string): boolean {
  if (data.length === 0) {
    return true
  }
  let res = true
  let weightSum = 0
  data.forEach(adv => {
    weightSum += adv.weight
  })
  if (weightSum !== 100) {
    activeTab.value = tabName
    cmjs.prompt.error(pageName + "的所有广告权重之和需为100")
    res = false
  }
  return res
}

function save() {
  if (!checkDataWeight(data.index, "index", "首页")) {
    return
  }

  if (!checkDataWeight(data.video, "video", "视频页")) {
    return
  }

  if (switchAsk.value) {
    //api请求，只有修改了才请求
    console.log(data)
    switchAsk.value = false
  }

  closeMainWindow()
  cmjs.prompt.success("保存成功")
}

function add() {
  openAddWindow((newAdv: Advertisement) => {
    if (activeTab.value === "index") {
      data.index.push(newAdv)
      setTimeout(() => {
        indexTableEle.scrollTo({
          top: indexTableEle.scrollHeight,
          behavior: 'smooth',
        })
      }, 0);
    } else if (activeTab.value === "video") {
      data.video.push(newAdv)
      setTimeout(() => {
        videoTableEle.scrollTo({
          top: videoTableEle.scrollHeight,
          behavior: 'smooth',
        })
      }, 0);
    }
  }, activeTab.value)
}
</script>

<style scoped></style>

<style>
.saw .el-dialog__header,
.saw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.saw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>