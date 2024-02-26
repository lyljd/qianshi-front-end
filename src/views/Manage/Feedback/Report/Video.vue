<template>
  <div v-if="data.records.length > 0" class="frv-container">
    <el-card v-for="(r, idx) in data.records">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
          }}</span></span>
          <span>举报时间：{{ cmjs.fmt.tsStandard(r.reportTime) }}</span>
          <div>
            <el-button v-blur @click="process(idx)" type="success">调整视频至未通过</el-button>
            <el-button v-blur @click="del(idx)" type="warning">删除视频</el-button>
            <el-button v-blur @click="deny(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <VideoDescriptions style="margin-top: 20px;" :data="r.videoInfo" title="视频信息"></VideoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的视频举报"></el-empty>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/feedback/report/video.json"
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import VideoDescriptions from "@/components/util/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Video = {
  vid: number,
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean
}

type Record = {
  id: number,
  uid: number,
  nickname: string,
  reportTime: number,
  reportInfo: {
    content: string,
    imgs: string[],
  },
  videoInfo: Video
}

type Data = {
  total: number
  records: Record[]
}

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(2, location.pathname)

let curPage = ref(1)
let data = ref<Data>(getData())

watch(curPage, newVal => {
  data.value = getData()
})

function getData(): Data {
  // TODO api
  console.log("获取第" + curPage.value + "页的数据")

  return Data
}

function process(formIdx: number) {
  ElMessageBox.confirm('你确认要调整该视频至未通过吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api
      console.log(data.value.records[formIdx].id)

      data.value.records.splice(formIdx, 1)
      data.value.total--
      cmjs.prompt.success("已处理")
    })
}

function del(formIdx: number) {
  ElMessageBox.confirm('你确认要删除该视频吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api
      console.log(data.value.records[formIdx].id)

      data.value.records.splice(formIdx, 1)
      data.value.total--
      cmjs.prompt.success('已删除')
    })
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '视频举报', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      //TODO api
      console.log(data.value.records[formIdx].id)
      console.log("理由：" + value)

      data.value.records.splice(formIdx, 1)
      data.value.total--
      cmjs.prompt.success("已驳回")
    })
    .catch(() => { })
}
</script>

<style lang="less" scoped>
.frv-container {
  cursor: default;
}

.frv-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.frv-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frv-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>