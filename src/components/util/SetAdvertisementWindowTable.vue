<template>
  <el-table :id="customId" class="table" :data="data" empty-text="无广告" stripe border>
    <el-table-column label="内容" align="center">
      <template #default="scope">
        <el-button v-blur @click="preview(scope.$index)" type="primary" size="small">预览</el-button>
      </template>
    </el-table-column>

    <el-table-column prop="weight" label="权重" align="center" />

    <el-table-column sortable :formatter="tableTimeFormatter" prop="createdAt" label="添加时间" align="center" />

    <el-table-column sortable :formatter="tableTimeFormatter" prop="updatedAt" label="修改时间" align="center" />

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <div>
          <el-button v-blur @click="update(scope.$index)" type="warning" size="small">修改</el-button>
          <el-button v-blur @click="del(scope.$index)" type="danger" size="small">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="previewWindowVisible" :custom-class="'preview'" :show-close="false" destroy-on-close align-center>
    <div :style="{ width: `${pageSize.width}px`, height: `${pageSize.height}px` }">
      <Adv :data="data[previewDataIdx]"></Adv>
    </div>
  </el-dialog>

  <AddWindow @open="(f: Function) => { openAddWindow = f }"></AddWindow>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Adv from "@/components/common/Advertisement.vue"
import { ElMessageBox } from 'element-plus'
import AddWindow from "@/components/window/AddAdvertisementWindow.vue"

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

type PageSize = {
  width: number,
  height: number,
}

const props = defineProps<{
  data: Advertisement[]
  page: string
  customId: string
}>()

const stf = defineEmits<{
  (cen: "recEle", ele: HTMLElement): void
}>()

const pageSize = getPageSize()
let previewWindowVisible = ref(false)
let previewDataIdx = ref(-1)
let openAddWindow: Function

onMounted(() => {
  stf('recEle', document.querySelector(`#${props.customId}`) as HTMLElement)
})

function preview(idx: number) {
  previewDataIdx.value = idx
  previewWindowVisible.value = true
}

function update(idx: number) {
  openAddWindow((newAdv: Advertisement) => {
    if (newAdv) {
      props.data[idx] = newAdv
      props.data[idx].updatedAt = 0
    }
  }, props.page, props.data[idx])
}

function del(idx: number) {
  ElMessageBox.confirm('你确认要删除该广告吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api request
      props.data.splice(idx, 1)
    })
}

function tableTimeFormatter(_: any, __: any, time: number): string {
  if (time === 0) {
    return "待保存"
  }
  return cmjs.fmt.tsStandard(time)
}

function getPageSize(): PageSize {
  switch (props.page) {
    case "index": {
      return {
        width: 1140,
        height: 100,
      }
    }
    case "video": {
      return {
        width: 270,
        height: 151.88,
      }
    }
  }

  return {
    width: 0,
    height: 0,
  }
}
</script>

<style scoped>
.table {
  max-height: 300px;
  overflow: auto;
  border: 1px solid #ebeef5;
}

.table::-webkit-scrollbar {
  width: 5px;
}

.table::-webkit-scrollbar-thumb {
  background-color: #666;
}

.table::-webkit-scrollbar-track {
  background-color: #ccc;
}
</style>

<style>
.preview {
  width: auto;
  border-radius: 5px;
}

.preview .el-dialog__header {
  display: none;
}

.preview .el-dialog__body {
  padding: 0;
  width: auto;
}
</style>