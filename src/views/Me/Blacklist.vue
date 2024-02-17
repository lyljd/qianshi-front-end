<template>
  <div class="tip">
    <span class="sp-tip">黑名单上限为100</span>
    <span class="sp-tip">被拉黑的用户将不能对你“发起私信”、“发送评论”和“发送弹幕”</span>
  </div>

  <el-table :data="form" empty-text="你没有拉黑过任何人哦～_～" class="table" stripe border>
    <el-table-column label="用户" align="center" :width="170">
      <template #default="scope">
        <span @click="cmjs.jump.user(form[scope.$index].uid)" class="user">{{ form[scope.$index].nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column :formatter="tableTimeFormatter" prop="blockTime" label="拉黑时间" align="center" :width="170" />

    <el-table-column prop="notes" label="备注" align="center" />

    <el-table-column label="操作" align="center" :width="90">
      <template #default="scope">
        <el-button v-blur @click="cancelBlock(scope.$index)" type="danger">移除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import Form from "@/mock/me/blacklist.json"
import cmjs from '@/cmjs'
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Record = {
  id: number,
  uid: number,
  nickname: string,
  blockTime: number,
  notes: string,
}

const store = useStore()
store.setMeCurTitle("黑名单管理")

let form: Record[] = reactive(getForm())

function getForm(): Record[] {
  return Form
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return cmjs.fmt.tsStandard(time)
}

function cancelBlock(formIdx: number) {
  ElMessageBox.confirm('你确认要移除该用户吗？', '确认提示', {
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
      console.log(form[formIdx].id)

      form.splice(formIdx, 1)
      cmjs.prompt.success('移除成功')
    })
}
</script>

<style lang="less" scoped>
.sp-tip {
  margin-top: 0;
  margin-bottom: 3px;
}

.table .user {
  cursor: pointer;
  text-decoration: underline;
  color: #409EFF;
}
</style>