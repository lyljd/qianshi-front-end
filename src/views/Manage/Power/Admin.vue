<template>
  <div class="mp-container">
    <div class="tip">
      <span style="margin-top: 0; margin-bottom: 3px;">共{{ result.total }}条数据，数据截止时间：{{ cmjs.fmt.tsStandard(timestamp) }}</span>
    </div>

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
            <el-button v-blur v-if="store.mui.power > scope.row.power" @click="setPower(scope.$index)" type="danger" size="small">调整权限</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/powerAdmin.json"
import cmjs from '@/cmjs'
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type user = {
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

type result = {
  total: number,
  data: user[]
}

const store = useStore()
store.setManegeItemIndex(4, location.pathname)

const timestamp = Date.now()
console.log(`power/admin timestamp: ${timestamp}`)

let result = ref<any>(getData())
let curPage = ref(1)

watch(curPage, newVal => {
  //TODO
  console.log(`curPage: ${newVal}`)
})

function getData(): result {
  return Data
}

function setPower(idx: number) {
  ElMessageBox.prompt('请输入新权限等级', '调整权限', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    showClose: false,
    inputValue: result.value.data[idx].power.toString(),
    inputPattern: new RegExp(`^[0-${store.mui.power-1}]$`),
    inputErrorMessage: `请输入整数（0～${store.mui.power-1}）`,
  })
    .then(({ value }) => {
      //api请求
      console.log(result.value.data[idx].id)

      result.value.data[idx].power = parseInt(value)
      
      result.value.data[idx].adjustedUser = {
        id: store.mui.id,
        nickname: store.mui.nickname
      }
      result.value.data[idx].adjustedTime = Date.now()
      
      if (!result.value.data[idx].initUser) {
        result.value.data[idx].initUser = {
          id: store.mui.id,
          nickname: store.mui.nickname
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

<style scoped>
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