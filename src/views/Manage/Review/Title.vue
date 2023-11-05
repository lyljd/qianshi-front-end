<template>
  <el-table :data="form" empty-text="暂无待处理的个人认证" class="table" stripe border>
    <el-table-column label="用户" align="center">
      <template #default="scope">
        <span @click="cmjs.jump.user(form[scope.$index].uid)" class="user">{{ form[scope.$index].nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="oldTitle" label="原个人认证" align="center" />

    <el-table-column prop="newTitle" label="新个人认证" align="center" />

    <el-table-column sortable :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" align="center" />

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button v-blur @click="pass(scope.$index)" type="success">通过</el-button>
        <el-button v-blur @click="deny(scope.$index)" type="danger">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import Form from "@/mock/manage/review/title.json"
import cmjs from '@/cmjs'
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Record = {
  id: number,
  uid: number,
  nickname: string,
  oldTitle: string,
  newTitle: string,
  applyTime: number,
}

const store = useStore()
store.setManegeItemIndex(1, location.pathname)

let form: Record[] = reactive(getForm())

function getForm(): Record[] {
  return Form
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return cmjs.fmt.tsStandard(time)
}

function pass(formIdx: number) {
  //TODO api
  console.log(form[formIdx].id)

  form.splice(formIdx, 1)
  cmjs.prompt.success("已通过")
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '个人认证审批', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      //TODO api
      console.log(form[formIdx].id)
      console.log("理由：" + value)

      form.splice(formIdx, 1)
      cmjs.prompt.error("已驳回")
    })
    .catch(() => { })
}
</script>

<style lang="less" scoped>
.table .user {
  cursor: pointer;
  text-decoration: underline;
  color: #409EFF;
}
</style>