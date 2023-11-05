<template>
  <div v-if="data.records.length > 0" class="frd-container">
    <el-card v-for="(r, idx) in data.records">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
          }}</span></span>
          <span>举报时间：{{ cmjs.fmt.tsStandard(r.reportTime) }}</span>
          <div>
            <el-button v-blur @click="del(idx)" type="success">删除弹幕</el-button>
            <el-button v-blur @click="deny(idx)" type="warning">驳回</el-button>
            <el-button v-blur @click="ignore(idx)" type="danger">忽略</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <InfoDescriptions style="margin-top: 20px;" :data="r.danmuInfo" title="弹幕信息"></InfoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的弹幕举报"></el-empty>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/feedback/report/danmu.json"
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import InfoDescriptions from "@/components/util/InfoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Info = {
  vid: number,
  did: number,
  t: number,
  uid: number,
  nickname: string,
  time: number,
  content: string,
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
  danmuInfo: Info
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
      //TODO api
      console.log(data.value.records[formIdx].id)

      data.value.records.splice(formIdx, 1)
      cmjs.prompt.success('已删除')
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
      //TODO api
      console.log(data.value.records[formIdx].id)
      console.log("理由：" + value)

      data.value.records.splice(formIdx, 1)
      cmjs.prompt.success("已驳回")
    })
    .catch(() => { })
}

function ignore(formIdx: number) {
  //TODO api
  console.log(data.value.records[formIdx].id)

  data.value.records.splice(formIdx, 1)
  cmjs.prompt.success("已忽略")
}
</script>

<style lang="less" scoped>
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