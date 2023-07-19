<template>
  <el-table :data="form" empty-text="暂无待处理的个人认证" class="table" stripe border>
    <el-table-column label="用户" align="center">
      <template #default="scope">
        <span @click="common.ToUser(form[scope.$index].uid)" class="user">{{ form[scope.$index].nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="oldTitle" label="原个人认证" align="center" />

    <el-table-column prop="newTitle" label="新个人认证" align="center" />

    <el-table-column sortable :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" align="center" />

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button @click="pass(scope.$index)" type="success">通过</el-button>
        <el-button @click="deny(scope.$index)" type="danger">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import Form from "../../../mock/manage/review/title.json"
import * as common from "../../../common"
import { ElMessageBox } from 'element-plus'

type record = {
  id: number,
  uid: number,
  nickname: string,
  oldTitle: string,
  newTitle: string,
  applyTime: number,
}

const timestamp = Date.now()
console.log(`review/title timestamp: ${timestamp}`)

let form: record[] = reactive(getForm())

function getForm(): record[] {
  return Form
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return common.timestampFormatterStandard(time)
}

function pass(formIdx: number) {
  //TODO 需请求后端
  console.log(form[formIdx].id)

  form.splice(formIdx, 1)
  common.showSuccess("已通过")
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
      //TODO 需请求后端
      console.log(form[formIdx].id)
      console.log("理由：" + value)

      form.splice(formIdx, 1)
      common.showError("已驳回")
    })
    .catch(() => { })
}
</script>

<style scoped>
.table .user {
  cursor: pointer;
  text-decoration: underline;
  color: #409EFF;
}
</style>