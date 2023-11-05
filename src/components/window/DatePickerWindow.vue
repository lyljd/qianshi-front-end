<template>
  <el-dialog v-model="dialogVisible" :title="title" width="25%" custom-class="dpw" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <el-config-provider :locale="locale">
        <el-date-picker v-model="date" value-format="x" type="date" placeholder="请选择日期"
          :disabled-date="dateSelectCheck" :shortcuts="shortcuts" style="width: 100%;" />
      </el-config-provider>

      <div v-for="t in tips" class="tip">
        <span>{{ t }}</span>
      </div>
    </div>

    <template #footer>
      <el-button v-blur @click="closeWindow">取消</el-button>
      <el-button v-blur @click="save" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import cmjs from '@/cmjs'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

withDefaults(defineProps<{
  title: string,
  tips: string[],
}>(), {
  title: "选择时间",
  tips: <any>[],
})

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openWindow)

const shortcuts = [
  {
    text: '一天',
    value: getVIPDate(1),
  },
  {
    text: '一周',
    value: getVIPDate(7),
  },
  {
    text: '一月(30天)',
    value: getVIPDate(30),
  },
  {
    text: '一季(90天)',
    value: getVIPDate(90),
  },
  {
    text: '半年(180天)',
    value: getVIPDate(180),
  },
  {
    text: '一年(365天)',
    value: getVIPDate(365),
  },
]
const locale = zhCn

let dialogVisible = ref(false)
let afterSuccDo: Function = () => { }
let uid = ref(-1)
let date = ref()

function openWindow(uidP: number, afterSuccDoP?: Function, dateP?: string) {
  dialogVisible.value = true
  uid.value = uidP
  if (afterSuccDoP) {
    afterSuccDo = afterSuccDoP
  }
  if (dateP) {
    date.value = dateP
  }
}

function closeWindow() {
  dialogVisible.value = false
  date.value = ""
}

function dateSelectCheck(date: Date) {
  return date.getTime() <= Date.now()
}

function save() {
  // TODO api
  afterSuccDo(date.value ? date.value : 0)
  closeWindow()
  cmjs.prompt.success("保存成功")
}

function getVIPDate(day: number): Date {
  const date = new Date()
  date.setTime(date.getTime() + 86400000 * (1 + day))
  return date
}
</script>

<style lang="less" scoped></style>

<style>
.dpw .el-dialog__header,
.dpw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.dpw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.dpw .el-button+.el-button {
  margin-left: 12px !important;
}

.el-picker-panel__shortcut {
  padding-left: unset;
  text-align: center;
}
</style>