<template>
  <div v-if="rs.length > 0" class="fav-container">
    <el-card v-for="(r, idx) in rs">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="common.ToUser(r.uid)" class="nickname">{{ r.nickname }}</span></span>
          <span>反馈时间：{{ common.timestampFormatterStandard(r.feedbackTime) }}</span>
          <div>
            <el-button @click="pass(idx)" type="success">通过</el-button>
            <el-button @click="deny(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.feedbackInfo" title="申诉信息"></FeedbackDescriptions>

        <VideoDescriptions style="margin-top: 20px;" :data="r.videoInfo" title="视频信息"></VideoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="totalPageNum" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的视频申诉"></el-empty>
</template>

<script setup lang="ts">
import Records from "../../../../mock/manage/feedback/appeal/video.json"
import * as common from "../../../../common"
import FeedbackDescriptions from "../../../../components/FeedbackDescriptions.vue"
import VideoDescriptions from "../../../../components/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "../../../../store"

type video = {
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
  feedbackTime: number,
  feedbackInfo: {
    content: string,
    imgs: string[],
  },
  videoInfo: video
}

const timestamp = Date.now()
console.log(`feedback/appeal/video timestamp: ${timestamp}`)

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(1, location.pathname)

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

function pass(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  rs.splice(formIdx, 1)
  common.showSuccess("已通过")
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '视频申诉', {
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
</script>

<style scoped>
.fav-container {
  cursor: default;
}

.fav-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.fav-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>