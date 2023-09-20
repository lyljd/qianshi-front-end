<template>
  <div v-if="rs.length > 0" class="frc-container">
    <el-card v-for="(r, idx) in rs">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname }}</span></span>
          <span>举报时间：{{ cmjs.fmt.tsStandard(r.reportTime) }}</span>
          <div>
            <el-button v-blur @click="del(idx)" type="success">删除评论</el-button>
            <el-button v-blur @click="deny(idx)" type="warning">驳回</el-button>
            <el-button v-blur @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <InfoDescriptions style="margin-top: 20px;" :data="r.commentInfo" title="评论信息"></InfoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="totalPageNum" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的评论举报"></el-empty>
</template>

<script setup lang="ts">
import Records from "@/mock/manage/feedback/report/comment.json"
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import InfoDescriptions from "@/components/util/InfoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type info = {
  vid?: number,
  rid?: number,
  cid: number,
  uid: number,
  nickname: string,
  time: number,
  content: string,
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
  commentInfo: info
}

const timestamp = Date.now()
console.log(`feedback/report/comment timestamp: ${timestamp}`)

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(2, location.pathname)

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

function del(formIdx: number) {
  ElMessageBox.confirm('你确认要删除该评论吗？', '确认提示', {
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
      cmjs.prompt.success('已删除')
    })
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '评论举报', {
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
      cmjs.prompt.success("已驳回")
    })
    .catch(() => { })
}

function ignore(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  rs.splice(formIdx, 1)
  cmjs.prompt.success("已忽略")
}
</script>

<style scoped>
.frc-container {
  cursor: default;
}

.frc-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.frc-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frc-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>