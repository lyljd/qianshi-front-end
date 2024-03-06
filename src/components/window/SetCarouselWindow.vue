<template>
  <el-dialog v-model="mainWindowVisible" title="设置轮播图" :width="data.length > 0 ? '80%' : '40%'" class="scw"
    :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <el-card v-if="data.length > 0" class="card">
        <template #header>
          <div class="card-header">
            <span class="header">{{ `轮播图${viewItem} (${viewItem}/${data.length})` }}</span>
            <div>
              <el-button v-blur @click="moveUp" :disabled="viewItem === 1 || uploading" size="small">上移</el-button>
              <el-button v-blur @click="moveDown" :disabled="viewItem === data.length || uploading"
                size="small">下移</el-button>
              <el-button v-blur @click="delItem" :disabled="uploading" type="danger" size="small">删除</el-button>
            </div>
          </div>
        </template>

        <div :style="{ height: `${cardBodyHeight}px` }" class="card-body">
          <div class="row">
            <div class="label">标题</div>
            <el-input v-model="data[viewItem - 1].title" placeholder="可为空" :maxlength="30" show-word-limit clearable />
          </div>

          <div class="row">
            <div class="label">链接</div>
            <el-input v-model="data[viewItem - 1].linkUrl" placeholder="可为空；支持但不推荐相对路径，绝对路径请加http(s)前缀" clearable />
          </div>

          <div class="row">
            <div style="margin-left: -3px;" class="label">
              <span style="color: red; margin-left: -3px;">*</span>图片
            </div>

            <ImageUpload @setImgUrl="(f: Function) => { setImgUrl = f }" :initImgUrl="data[viewItem - 1].imgUrl"
              :upload-handler="imageUploadHandler" proportion="4:3" :w="200" :h="150"></ImageUpload>
          </div>
        </div>
      </el-card>

      <div :style="{ width: data.length > 0 ? '50%' : '100%' }" class="carousel-container">
        <Carousel :data="data" :height="carouselHeight"></Carousel>
      </div>
    </div>

    <div class="tip">
      <span>轮播图为空时主页的轮播图区域将不会显示，推荐区的视频将由4个变为8个</span>
    </div>

    <template #footer>
      <div style="float: left;">
        <el-button v-blur @click="newItem" :disabled="uploading" type="success">新增一项</el-button>
        <el-button v-blur @click="pre" :disabled="viewItem === 1 || uploading" v-show="data.length > 0">上一项</el-button>
        <el-button v-blur @click="next" :disabled="viewItem === data.length || uploading"
          v-show="data.length > 0">下一项</el-button>
      </div>
      <el-button v-blur @click="closeMainWindow" :disabled="uploading">取消</el-button>
      <el-button v-blur @click="save" :disabled="uploading" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Carousel from "@/components/common/Carousel.vue"
import ImageUpload from "@/components/common/ImageUpload.vue"
import cmjs from '@/cmjs'
import Data from "@/mock/manage/carousel.json"
import { useStore } from "@/store"
import { ElMessageBox } from 'element-plus'

type carousel = {
  title: string,
  imgUrl: string,
  linkUrl: string,
}

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openMainWindow)

const store = useStore()

let carouselHeight = (window.innerWidth * 0.8 - 60) / 2 * 0.75
let cardBodyHeight = carouselHeight - 103 //103 = 61(header) + 20(padding)*2 + 2(border)

let mainWindowVisible = ref(false)
let data: carousel[] = reactive([])
let dataCopy: carousel[] = reactive([])
let viewItem = ref(1)
let setImgUrl: Function
let uploading = ref(false)

watch(viewItem, newVal => {
  if (newVal === 0) {
    return
  }
  setImgUrl(data[newVal - 1].imgUrl)
})

function setData() {
  //TODO api
  data = reactive([...Data])
  dataCopy = reactive([...Data])
}

function openMainWindow() {
  setData()
  mainWindowVisible.value = true

  watch(data, newVal => {
    if (newVal !== dataCopy) {
      store.switchAsk = true
    } else {
      store.switchAsk = false
    }
  })
}

function closeMainWindow() {
  if (store.switchAsk) {
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
      store.switchAsk = false
      mainWindowVisible.value = false
      viewItem.value = 1
    }).catch(() => { })
  } else {
    mainWindowVisible.value = false
    viewItem.value = 1
  }
}

function save() {
  for (let i = 0; i < data.length; i++) {
    if (data[i].imgUrl === '') {
      viewItem.value = i + 1
      cmjs.prompt.error("图片不能为空")
      return
    }
  }

  // TODO api
  console.log(data)

  store.switchAsk = false
  closeMainWindow()
  cmjs.prompt.success("保存成功")
}

function pre() {
  viewItem.value--
}

function next() {
  viewItem.value++
}

function newItem() {
  if (data.length >= 7) {
    cmjs.prompt.error("轮播图最多有7项")
    return
  }
  data.push({
    title: "",
    imgUrl: "",
    linkUrl: ""
  })
  viewItem.value = data.length
}

function delItem() {
  data.splice(viewItem.value - 1, 1)
  if (viewItem.value - 1 === data.length) {
    viewItem.value--
  } else {
    setImgUrl(data[viewItem.value - 1].imgUrl)
  }
}

function moveUp() {
  [data[viewItem.value - 1], data[viewItem.value - 2]] = [data[viewItem.value - 2], data[viewItem.value - 1]]
  viewItem.value--
}

function moveDown() {
  [data[viewItem.value - 1], data[viewItem.value]] = [data[viewItem.value], data[viewItem.value - 1]]
  viewItem.value++
}

function imageUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  uploading.value = true

  // TODO api

  const url = URL.createObjectURL(file)
  setImgUrl(url)
  const timer = setInterval(() => {
    const randPercent = Math.floor(Math.random() * 26) + 25 // [25,50]，整数
    if (percent.value + randPercent < 100) {
      percent.value += randPercent
    } else {
      percent.value = 100
      clearInterval(timer)
      uploading.value = false
      data[viewItem.value - 1].imgUrl = url // fail时不能设置！！
      succ()
      // fail()
    }
  }, 1000)
}
</script>

<style lang="less" scoped>
.scw .body {
  display: flex;
  gap: 20px;
}

.scw .body .card {
  width: 50%;
}

.scw .body .card .header {
  font-size: 18px;
}

.scw .body .card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scw .body .card .card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.scw .body .card .row {
  display: flex;
  align-items: center;
}

.scw .body .card .row .label {
  width: 40px;
}

.scw .body .carousel-container {
  height: 100%;
}
</style>

<style>
.scw .el-dialog__header,
.scw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.scw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>