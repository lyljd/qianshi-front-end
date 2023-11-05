<template>
  <ManageTopMenuBar title="用户" icon="people"></ManageTopMenuBar>

  <div class="mu-container">
    <div class="search-bar">
      <el-input v-model="searchKey" @keyup.enter.native="search" placeholder="请输入欲搜索的用户名关键字" />
      <el-button v-blur @click="search" :icon="Search" type="primary">搜索</el-button>
    </div>

    <el-table :data="result.data" stripe border>
      <el-table-column label="用户" align="center">
        <template #default="scope">
          <span @click="cmjs.jump.user(scope.row.id)" class="nickname">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column :width="90" :formatter="tfFormatter" prop="isRestrict" label="交互限制" align="center" />

      <el-table-column :width="90" :formatter="tfFormatter" prop="isBan" label="账号封禁" align="center" />

      <el-table-column :width="90" prop="coinNum" label="硬币数" align="center" />

      <el-table-column :width="120" label="等级(经验)" align="center">
        <template #default="scope">
          <div class="flex-center">
            <svg class="icon-symbol level" aria-hidden="true">
              <use :xlink:href="'#el-icon-level_' + cmjs.biz.expToLevel(scope.row.exp)"></use>
            </svg>
            <span class="exp">({{ scope.row.exp }})</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :width="150" :formatter="vipExpireDateFormatter" prop="vipExpireDate" align="center">
        <template #header>
          会员过期日期
          <el-tooltip content="过期日期固定为每天0点" placement="top" :enterable="false">
            <span class="iconfont el-icon-info"></span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column :width="330" label="操作" align="center">
        <template #default="scope">
          <div class="flex-center" style="flex-wrap: wrap; gap: 5px;">
            <el-popconfirm @confirm="() => { restrict(scope.$index) }"
              :title="!scope.row.isRestrict ? '你确认要限制该用户吗？' : '你确认要取消限制该用户吗？'" confirm-button-text="确认"
              cancel-button-text="取消">
              <template #reference>
                <el-button v-blur :type="!scope.row.isRestrict ? 'success' : 'danger'" size="small">{{
                  !scope.row.isRestrict ?
                  "限制交互" : "取消限制交互" }}</el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm @confirm="() => { ban(scope.$index) }"
              :title="!scope.row.isBan ? '你确认要封禁该用户吗？' : '你确认要取消封禁该用户吗？'" confirm-button-text="确认"
              cancel-button-text="取消">
              <template #reference>
                <el-button v-blur :type="!scope.row.isBan ? 'success' : 'danger'" size="small">{{ !scope.row.isBan ?
                  "封禁账号" :
                  "取消封禁账号" }}</el-button>
              </template>
            </el-popconfirm>

            <el-button v-blur @click="setInfo(scope.$index)" size="small">调整信息</el-button>
            <el-button v-blur @click="setCoinNum(scope.$index)" size="small">调整硬币数</el-button>
            <el-button v-blur @click="setExp(scope.$index)" size="small">调整经验</el-button>
            <el-button v-blur @click="setvipExpireDate(scope.$index)" size="small">调整会员过期日期</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="page" v-model:current-page="curPage" :page="10" background layout="prev, pager, next"
      :total="result.total" hide-on-single-page />

    <DatePickerWindow @open="getOpenDPWindow" title="调整会员过期日期" :tips="[' 过期日期固定为每天0点', '右侧快捷选项以明天0点为基础开始计算']">
    </DatePickerWindow>

    <UserInfoSysSetWindow @open="getOpenUISSWindow"></UserInfoSysSetWindow>
  </div>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "@/components/util/ManageTopMenuBar.vue"
import Data from "@/mock/manage/user.json"
import cmjs from '@/cmjs'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import DatePickerWindow from "@/components/window/DatePickerWindow.vue"
import UserInfoSysSetWindow from "@/components/window/UserInfoSysSetWindow.vue"

type User = {
  id: number,
  nickname: string,
  isRestrict: boolean,
  isBan: boolean,
  coinNum: number,
  exp: number,
  vipExpireDate: number
}

type Result = {
  total: number,
  data: User[]
}

type UserInfo = {
  coverUrl: string,
  nickname: string,
  signature: string,
  gender: string,
  birthday: string,
  tags: string[],
}

let searchKey = ref("")
let result = ref<Result>({ total: 0, data: [] })
let curPage = ref(1)
let openDPWindow: Function // DatePickerWindow
let openUISSWindow: Function // UserInfoSysSetWindow

watch(curPage, newVal => {
  result.value = getData()
})

function getOpenDPWindow(f: Function) {
  openDPWindow = f
}

function getOpenUISSWindow(f: Function) {
  openUISSWindow = f
}

function getData(): Result {
  // TODO api
  console.log("获取第" + curPage.value + "页的数据")

  return Data
}

function search() {
  if (searchKey.value.trim() === "") {
    cmjs.prompt.error("关键字为空")
    return
  }

  //TODO api
  result.value = getData()
}

function tfFormatter(_: any, __: any, v: boolean): string {
  return v ? '✓' : '✕'
}

function vipExpireDateFormatter(_: any, __: any, v: number): string {
  return v > 0 ? cmjs.fmt.tsTmpl(v, "YYYY-MM-DD") : "无会员"
}

function restrict(idx: number) {
  // TODO api
  console.log(result.value.data[idx].id)

  result.value.data[idx].isRestrict = !result.value.data[idx].isRestrict
  cmjs.prompt.success("操作成功")
}

function ban(idx: number) {
  // TODO api
  console.log(result.value.data[idx].id)

  result.value.data[idx].isBan = !result.value.data[idx].isBan
  cmjs.prompt.success("操作成功")
}

function setInfo(idx: number) {
  openUISSWindow(result.value.data[idx].id, (userInfo: UserInfo) => {
    console.log(userInfo)

    result.value.data[idx].nickname = userInfo.nickname
  })
}

function setCoinNum(idx: number) {
  ElMessageBox.prompt('请输入新硬币数', '调整硬币数', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    showClose: false,
    inputValue: result.value.data[idx].coinNum.toString(),
    inputPattern: /^-?\d+$/,
    inputErrorMessage: '请输入整数',
  })
    .then(({ value }) => {
      // TODO api
      console.log(result.value.data[idx].id)

      result.value.data[idx].coinNum = parseInt(value)
      cmjs.prompt.success("操作成功")
    })
    .catch(() => { })
}

function setExp(idx: number) {
  ElMessageBox.prompt('请输入新经验', '调整经验', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    showClose: false,
    inputValue: result.value.data[idx].exp.toString(),
    inputPattern: /^(0|[1-9]\d*)$/,
    inputErrorMessage: '请输入非负整数',
  })
    .then(({ value }) => {
      //api请求
      console.log(result.value.data[idx].id)

      result.value.data[idx].exp = parseInt(value)
      cmjs.prompt.success("操作成功")
    })
    .catch(() => { })
}

function setvipExpireDate(idx: number) {
  openDPWindow(result.value.data[idx].id, (newVal: number) => {
    result.value.data[idx].vipExpireDate = newVal
  }, result.value.data[idx].vipExpireDate)
}
</script>

<style lang="less" scoped>
.mu-container .search-bar {
  display: flex;
  margin-bottom: 20px;
}

.mu-container .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.mu-container .level {
  font-size: 25px;
}

.mu-container .exp {
  font-size: 12px;
}

.mu-container .page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.mu-container .el-button+.el-button {
  margin-left: unset;
}
</style>