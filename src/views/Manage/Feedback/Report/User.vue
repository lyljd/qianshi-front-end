<template>
  <div v-if="data.records.length > 0" class="fru-container">
    <el-card v-for="(r, idx) in data.records">
      <template #header>
        <div class="header">
          <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
          }}</span></span>
          <span>举报时间：{{ cmjs.fmt.tsStandard(r.reportTime) }}</span>
          <div>
            <el-button v-blur @click="deal(idx)" type="primary">前往处理</el-button>
            <el-button v-blur @click="processed(idx)" type="success">已处理</el-button>
            <el-button v-blur @click="deny(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <FeedbackDescriptions :data="r.reportInfo" title="举报信息"></FeedbackDescriptions>

        <el-descriptions title="被举报用户信息" :column="1" border style="margin-top: 20px;">
          <el-descriptions-item label="用户">
            <span @click="cmjs.jump.user(r.userInfo.uid)" class="id-nickname">{{ r.userInfo.nickname }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的用户举报"></el-empty>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/feedback/report/user.json"
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Info = {
  uid: number,
  nickname: string,
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
  userInfo: Info
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

function deal(formIdx: number) {
  cmjs.jump.new(`/manage/user?key=${data.value.records[formIdx].userInfo.nickname}`)
}

function processed(formIdx: number) {
  ElMessageBox.prompt('请描述处理方式（可为空）', '用户举报', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      //TODO api
      console.log(data.value.records[formIdx].id)
      console.log("处理方式：" + value)

      data.value.records.splice(formIdx, 1)
      data.value.total--
      cmjs.prompt.success("已处理")
    })
    .catch(() => { })
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '用户举报', {
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
.fru-container {
  cursor: default;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nickname {
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
      max-width: 165px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .body {
    .id-nickname {
      color: #409EFF;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.fru-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}
</style>

<style>
.fru-container .el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 52px !important;
}

.fru-container .el-descriptions__header {
  margin-bottom: 3px;
}
</style>