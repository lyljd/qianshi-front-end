<template>
  <div v-if="data.records.length > 0" class="fm-container">
    <el-card v-for="(r, idx) in data.records">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
          }}</span></span>
          <span>反馈时间：{{ cmjs.fmt.tsStandard(r.feedbackTime) }}</span>
          <div>
            <el-button v-blur @click="reply(idx)" type="success">回复</el-button>
            <el-button v-blur @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.feedbackInfo" title=""></FeedbackDescriptions>
      </div>
    </el-card>

    <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的站内留言"></el-empty>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/feedback/msg.json"
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import { useStore } from "@/store"

type Record = {
  id: number,
  uid: number,
  nickname: string,
  feedbackTime: number,
  feedbackInfo: {
    content: string,
    imgs: string[],
  }
}

type Data = {
  total: number,
  records: Record[]
}

const store = useStore()
store.setManegeItemIndex(2, location.pathname)

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

function reply(formIdx: number) {
  store.openSMSWindow({
    to: [{ uid: data.value.records[formIdx].uid, nickname: data.value.records[formIdx].nickname }],
    afterSuccDo: () => {
      data.value.records.splice(formIdx, 1)
    },
  })
}

function ignore(formIdx: number) {
  //TODO api
  console.log(data.value.records[formIdx].id)

  data.value.records.splice(formIdx, 1)
  cmjs.prompt.success("已忽略")
}
</script>

<style lang="less" scoped>
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