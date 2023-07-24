<template>
  <div v-if="rs.length > 0" class="fm-container">
    <el-card v-for="(r, idx) in rs">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="common.ToUser(r.uid)" class="nickname">{{ r.nickname }}</span></span>
          <span>反馈时间：{{ common.timestampFormatterStandard(r.feedbackTime) }}</span>
          <div>
            <el-button @click="reply(idx)" type="success">回复</el-button>
            <el-button @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.feedbackInfo"></FeedbackDescriptions>
      </div>
    </el-card>

    <el-pagination :total="totalPageNum" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的站内留言"></el-empty>
</template>

<script setup lang="ts">
import Records from "../../../mock/manage/feedback/msg.json"
import * as common from "../../../common"
import FeedbackDescriptions from "../../../components/FeedbackDescriptions.vue"
import { useStore } from "../../../store"

type record = {
  id: number,
  uid: number,
  nickname: string,
  feedbackTime: number,
  feedbackInfo: {
    content: string,
    imgs: string[],
  }
}

const store = useStore()
store.setManegeItemIndex(2, location.pathname)

const timestamp = Date.now()
console.log(`feedback/msg timestamp: ${timestamp}`)

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

function reply(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  store.openSMSWindow({
    to: [rs[formIdx].nickname],
    afterSuccDo: () => {
      rs.splice(formIdx, 1)
    },
  })
}

function ignore(formIdx: number) {
  //TODO 需请求后端
  console.log(rs[formIdx].id)

  rs.splice(formIdx, 1)
  common.showSuccess("已忽略")
}
</script>

<style scoped>
.fm-container {
  cursor: default;
}

.fm-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.fm-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fm-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>