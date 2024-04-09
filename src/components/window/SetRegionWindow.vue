<template>
  <el-dialog v-model="mainWindowVisible" width="33%" title="设置分区" class="srw" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <el-card style="max-height: 33vh; overflow: auto;">
        <div v-if="data.length > 0" v-for="(r, idx) in data" class="row"
          :style="{ borderColor: activeIdx === idx ? '#409EFF' : '#DCDFE6' }">
          <el-input :readonly="saveLoading" @focus="activeIdx = idx" :id="`r-name-${r.name}`" v-model="r.name"
            placeholder="name" />
          <div class="divider"></div>
          <el-input :readonly="saveLoading" @focus="activeIdx = idx" :id="`r-slug-${r.slug}`" v-model="r.slug"
            placeholder="slug" />
        </div>
        <div v-else class="flex-center" style="color: #909399;">暂无分区</div>
      </el-card>
    </div>

    <template #footer>
      <div style="float: left">
        <el-button :disabled="saveLoading" v-blur @click="newItem" type="success" tabindex="-1">+</el-button>
        <el-button v-blur :disabled="activeIdx === -1 || activeIdx === 0 || saveLoading" @click="moveUp" type="info"
          tabindex="-1">↑</el-button>
        <el-button v-blur :disabled="activeIdx === -1 || activeIdx === data.length - 1 || saveLoading" @click="moveDown"
          type="info" tabindex="-1">↓</el-button>
        <el-button v-blur :disabled="activeIdx === -1 || saveLoading" @click="delItem" type="danger" tabindex="-1"><span
            class="iconfont el-icon-ashbin"></span></el-button>
      </div>
      <el-button :disabled="saveLoading" v-blur @click="closeMainWindow" tabindex="-1">取消</el-button>
      <el-button :disabled="saveLoading" v-loading="saveLoading" v-blur @click="save" type="primary"
        tabindex="-1">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useStore } from "@/store"
import { ElMessageBox } from 'element-plus'
import * as ManageAPI from '@/api/manage'

type Data = {
  sort?: number
  name: string
  slug: string
}

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openMainWindow)

const store = useStore()

let mainWindowVisible = ref(false)
let data: Data[] = reactive([])
let dataCopy: Data[] = reactive([])
let activeIdx = ref(-1)
let saveLoading = ref(false)

async function setData() {
  if (store.regions.length === 0) {
    await store.getRegions()
  }

  data = reactive([...store.regions])
  dataCopy = reactive([...store.regions])
}

async function openMainWindow() {
  await setData()
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
      activeIdx.value = -1
    }).catch(() => { })
  } else {
    mainWindowVisible.value = false
    activeIdx.value = -1
  }
}

async function save() {
  let nameSeen: string[] = []
  let slugSeen: string[] = []

  for (let i = 0; i < data.length; i++) {
    if (data[i].name === "") {
      (document.getElementById(`r-name-${data[i].name}`) as HTMLElement).focus()
      cmjs.prompt.error(`name不能为空`)
      return
    }

    if (data[i].slug === "") {
      (document.getElementById(`r-slug-${data[i].slug}`) as HTMLElement).focus()
      cmjs.prompt.error(`slug不能为空`)
      return
    }

    if (nameSeen.includes(data[i].name)) {
      (document.getElementById(`r-name-${data[i].name}`) as HTMLElement).focus()
      cmjs.prompt.error(`name "${data[i].name}" 重复`)
      return
    } else {
      nameSeen.push(data[i].name)
    }

    if (slugSeen.includes(data[i].slug)) {
      (document.getElementById(`r-slug-${data[i].slug}`) as HTMLElement).focus()
      cmjs.prompt.error(`slug "${data[i].slug}" 重复`)
      return
    } else {
      slugSeen.push(data[i].slug)
    }
  }

  let errOccur = false
  if (store.switchAsk) {
    for (let i = 0; i < data.length; i++) {
      data[i].sort = i + 1
    }

    saveLoading.value = true
    await ManageAPI.setRegions(data)
      .then((res => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        store.regions = []
      }))
      .catch((err => {
        errOccur = true
        cmjs.prompt.error(err)
      }))
      .finally(() => {
        saveLoading.value = false
      })
  }

  if (!errOccur) {
    store.switchAsk = false
    closeMainWindow()
    cmjs.prompt.success("保存成功")
  }
}

function newItem() {
  data.push({ name: "", slug: "" })
  setTimeout(() => {
    const iis = document.getElementsByClassName("el-input__inner")
    const e = iis[iis.length - 2] as HTMLElement
    e.focus()
  }, 0) //这里0是有意义的
}

function moveUp() {
  [data[activeIdx.value], data[activeIdx.value - 1]] = [data[activeIdx.value - 1], data[activeIdx.value]]
  activeIdx.value--
}

function moveDown() {
  [data[activeIdx.value], data[activeIdx.value + 1]] = [data[activeIdx.value + 1], data[activeIdx.value]]
  activeIdx.value++
}

function delItem() {
  data.splice(activeIdx.value, 1)
}
</script>

<style lang="less" scoped>
.row {
  display: flex;
  border: 1px solid;
  border-radius: 4px;

  .divider {
    border-right: 1px solid #DCDFE6;
    margin: 5px 0;
  }
}

.row:not(:last-child) {
  margin-bottom: 5px;
}
</style>

<style>
.srw {

  .el-dialog__header,
  .el-dialog__footer {
    padding: 20px;
    margin: 0;
  }

  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  .el-input__inner {
    text-align: center;
  }

  .el-input__wrapper {
    box-shadow: none;
  }
}
</style>