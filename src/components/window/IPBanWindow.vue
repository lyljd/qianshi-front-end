<template>
  <el-dialog v-model="mainWindowVisible" width="33%" title="IP封禁" class="ipb" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <el-card style="max-height: 33vh; overflow: auto;">
        <div v-if="data.length > 0" v-for="(_, idx) in data" class="row">
          <el-input :id="`ip-input-${idx}`" v-model="data[idx]" />
          <el-button v-blur @click="delItem(idx)" type="danger" tabindex="-1"><span
              class="iconfont el-icon-ashbin"></span></el-button>
        </div>
        <div v-else class="flex-center" style="color: #909399;">暂无ip</div>
      </el-card>
    </div>

    <template #footer>
      <div style="float: left;">
        <el-button v-blur @click="newItem" type="success" tabindex="-1">新增一项</el-button>
      </div>
      <el-button v-blur @click="closeMainWindow" tabindex="-1">取消</el-button>
      <el-button v-blur @click="save" type="primary" tabindex="-1">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Data from "@/mock/manage/ipban.json"
import { useStore } from "@/store"
import { ElMessageBox } from 'element-plus'

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openMainWindow)

const store = useStore()

const ipRegex = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

let mainWindowVisible = ref(false)
let data: string[] = reactive([])
let dataCopy: string[] = reactive([])

function setData() {
  //TODO api
  data = reactive([...Data])
  dataCopy = reactive([...Data])
}

function openMainWindow() {
  setData()
  mainWindowVisible.value = true

  watch(data, newVal => {
    if (newVal !== dataCopy) {
      store.switchAsk = true
    } else {
      store.switchAsk = false
    }
  })
}

function closeMainWindow() {
  if (store.switchAsk) {
    ElMessageBox.confirm(
      '你所做的更改可能未保存',
      '关闭窗口？',
      {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'warning',
        autofocus: false,
        showClose: false,
      }
    ).then(() => {
      store.switchAsk = false
      mainWindowVisible.value = false
    }).catch(() => { })
  } else {
    mainWindowVisible.value = false
  }
}

function save() {
  for (let i = 0; i < data.length; i++) {
    if (!ipRegex.test(data[i])) {
      (document.getElementById(`ip-input-${i}`) as HTMLElement).focus()
      cmjs.prompt.error(`"${data[i]}"不符合ip格式`)
      return
    }

    if (data.slice(i + 1).indexOf(data[i]) !== -1) {
      const lidx = data.lastIndexOf(data[i]);
      (document.getElementById(`ip-input-${lidx}`) as HTMLElement).focus()
      cmjs.prompt.error(`"${data[i]}"重复`)
      return
    }
  }

  if (store.switchAsk) {
    //TODO api
    console.log(data)
  }

  store.switchAsk = false
  closeMainWindow()
  cmjs.prompt.success("保存成功")
}

function newItem() {
  data.push("")
  setTimeout(() => {
    const iis = document.getElementsByClassName("el-input__inner")
    const e = iis[iis.length - 1] as HTMLElement
    e.focus()
  }, 0) //这里0是有意义的
}

function delItem(idx: number) {
  data.splice(idx, 1)
}
</script>

<style lang="less" scoped>
.row {
  display: flex;
}

.row:not(:last-child) {
  margin-bottom: 10px;
}
</style>

<style>
.ipb .el-dialog__header,
.ipb .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.ipb .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>