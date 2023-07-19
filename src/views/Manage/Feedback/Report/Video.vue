<template>
  <div v-if="rs.length > 0" class="frv-container">
    <el-card v-for="(r, idx) in rs">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="common.ToUser(r.uid)" class="nickname">{{ r.nickname }}</span></span>
          <span>举报时间：{{ common.timestampFormatterStandard(r.reportTime) }}</span>
          <div>
            <el-button @click="process(idx)" type="success">隐藏并调整视频至未通过</el-button>
            <el-button @click="del(idx)" type="success">删除视频</el-button>
            <el-button @click="deny(idx)" type="warning">驳回</el-button>
            <el-button @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <VideoDescriptions style="margin-top: 20px;" :data="r.videoInfo" title="视频信息"></VideoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="totalPageNum" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的视频举报"></el-empty>
</template>

<script setup lang="ts">
import Records from "../../../../mock/manage/feedback/report/video.json"
import * as common from "../../../../common"
import FeedbackDescriptions from "../../../../components/FeedbackDescriptions.vue"
import VideoDescriptions from "../../../../components/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'

type video = {
  vid: number,
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean
}

type record = {
  id: number,
  uid: number,
  nickname: string,
  reportTime: number,
  reportInfo: {
    content: string,
    imgs: string[],
  },
  videoInfo: video
}

const timestamp = Date.now()
console.log(`feedback/report/video timestamp: ${timestamp}`)

let rs: record[] = reactive(getRecords())

let totalPageNum = ref(getTotalPageNum())
let curPage = ref(1)

watch(curPage, newVal => {
  //TODO
  console.log(`curPage: ${newVal}`)
})

function getTotalPageNum(): number {
  //TODO
  return 2
}

function getRecords(): record[] {
  return Records
}

function process(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  rs.splice(formIdx, 1)
  common.showSuccess("已处理")
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
      //TODO api request
      console.log(rs[formIdx].id)

      rs.splice(formIdx, 1)
      common.showSuccess('已删除')
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
      //TODO 需请求后端
      console.log(rs[formIdx].id)
      console.log("理由：" + value)

      rs.splice(formIdx, 1)
      common.showSuccess("已驳回")
    })
    .catch(() => { })
}

function ignore(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  rs.splice(formIdx, 1)
  common.showSuccess("已忽略")
}
</script>

<style scoped>
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