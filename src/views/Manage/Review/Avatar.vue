<template>
  <el-table :data="data.records" empty-text="暂无待处理的头像" class="table" stripe border>
    <el-table-column label="用户" align="center">
      <template #default="scope">
        <span @click="cmjs.jump.user(scope.row.uid)" class="user">{{ scope.row.nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column label="新头像" align="center">
      <template #default="scope">
        <Avatar :url="scope.row.newAvatar" size="large"></Avatar>
      </template>
    </el-table-column>

    <el-table-column :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" align="center" />

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button v-blur @click="pass(scope.$index)" type="success">通过</el-button>
        <el-button v-blur @click="deny(scope.$index)" type="danger">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
    hide-on-single-page background layout="prev, pager, next" />
</template>

<script setup lang="ts">
import Data from "@/mock/manage/review/avatar.json"
import cmjs from '@/cmjs'
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"
import Avatar from '@/components/common/Avatar.vue'

type Record = {
  id: number,
  uid: number,
  nickname: string,
  newAvatar: string,
  applyTime: number,
}

type Data = {
  total: number,
  records: Record[]
}

const store = useStore()
store.setManegeItemIndex(1, location.pathname)

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

function tableTimeFormatter(_: any, __: any, time: number) {
  return cmjs.fmt.tsStandard(time)
}

function pass(formIdx: number) {
  //TODO api
  console.log(data.value.records[formIdx].id)

  data.value.records.splice(formIdx, 1)
  data.value.total--
  cmjs.prompt.success("已通过")
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '头像审批', {
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
.table {

  margin-bottom: 20px;

  .user {
    cursor: pointer;
    text-decoration: underline;
    color: #409EFF;
  }
}
</style>