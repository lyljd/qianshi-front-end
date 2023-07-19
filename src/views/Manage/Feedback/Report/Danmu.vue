<template>
  <div v-if="rs.length > 0" class="frd-container">
    <el-card v-for="(r, idx) in rs">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="common.ToUser(r.uid)" class="nickname">{{ r.nickname }}</span></span>
          <span>举报时间：{{ common.timestampFormatterStandard(r.reportTime) }}</span>
          <div>
            <el-button @click="del(idx)" type="success">删除弹幕</el-button>
            <el-button @click="deny(idx)" type="warning">驳回</el-button>
            <el-button @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <InfoDescriptions style="margin-top: 20px;" :data="r.danmuInfo" title="弹幕信息"></InfoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="totalPageNum" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的弹幕举报"></el-empty>
</template>

<script setup lang="ts">
import Records from "../../../../mock/manage/feedback/report/danmu.json"
import * as common from "../../../../common"
import FeedbackDescriptions from "../../../../components/FeedbackDescriptions.vue"
import InfoDescriptions from "../../../../components/InfoDescriptions.vue"
import { ElMessageBox } from 'element-plus'

type info = {
  vid: number,
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
  danmuInfo: info
}

const timestamp = Date.now()
console.log(`feedback/report/danmu timestamp: ${timestamp}`)

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
  ElMessageBox.confirm('你确认要删除该弹幕吗？', '确认提示', {
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
  ElMessageBox.prompt('请输入驳回理由（可为空）', '弹幕举报', {
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
.frd-container {
  cursor: default;
}

.frd-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.frd-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frd-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>