<template>
  <div class="mp-container">
    <el-table :data="result.data" stripe border>
      <el-table-column label="用户" align="center">
        <template #default="scope">
          <span @click="cmjs.jump.user(scope.row.id)" class="nickname">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column :width="120" prop="power" label="权限等级" align="center" sortable />

      <el-table-column label="初次被谁赋权" align="center">
        <template #default="scope">
          <span v-if="scope.row.initUser" @click="cmjs.jump.user(scope.row.initUser!.id)" class="nickname">{{
            scope.row.initUser!.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="近一次被谁调整" align="center">
        <template #default="scope">
          <span v-if="scope.row.adjustedUser" @click="cmjs.jump.user(scope.row.adjustedUser!.id)" class="nickname">{{
            scope.row.adjustedUser!.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column :width="180" :formatter="dateFormatter" prop="adjustedTime" label="近一次被调整时间" align="center"
        sortable />

      <el-table-column :width="120" label="操作" align="center">
        <template #default="scope">
          <div class="flex-center" style="flex-wrap: wrap; gap: 5px;">
            <el-button v-blur v-if="store.power > scope.row.power" @click="setPower(scope.$index)" type="danger"
              size="small">调整权限</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/power/admin.json"
import cmjs from '@/cmjs'
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type User = {
  id: number,
  nickname: string,
  power: number,
  initUser?: {
    id: number,
    nickname: string,
  },
  adjustedUser?: {
    id: number,
    nickname: string,
  },
  adjustedTime?: number,
}

type Result = {
  total: number,
  data: User[]
}

const store = useStore()
store.setManegeItemIndex(4, location.pathname)

let result = ref<Result>(getData())

function getData(): Result {
  // TODO api
  return Data
}

function setPower(idx: number) {
  ElMessageBox.prompt('请输入新权限等级', '调整权限', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    showClose: false,
    inputValue: result.value.data[idx].power.toString(),
    inputPattern: new RegExp(`^[0-${store.power - 1}]$`),
    inputErrorMessage: `请输入整数（0～${store.power - 1}）`,
  })
    .then(({ value }) => {
      // TODO api
      console.log(result.value.data[idx].id)
      const id = 1 // api响应值
      const nickname = "Bonnenult" // api响应值

      result.value.data[idx].power = parseInt(value)

      result.value.data[idx].adjustedUser = {
        id: id,
        nickname: nickname
      }
      result.value.data[idx].adjustedTime = Date.now()

      if (!result.value.data[idx].initUser) {
        result.value.data[idx].initUser = {
          id: id,
          nickname: nickname
        }
      }
      cmjs.prompt.success("操作成功")
    })
    .catch(() => { })
}

function dateFormatter(_: any, __: any, v: number): string {
  if (v) {
    return cmjs.fmt.tsStandard(v)
  }
  return ""
}
</script>

<style lang="less" scoped>
.mp-container .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.mp-container .page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.mp-container .el-button+.el-button {
  margin-left: unset;
}
</style>