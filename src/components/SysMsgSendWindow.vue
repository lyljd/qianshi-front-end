<template>
  <el-dialog v-model="mainWindowVisible" title="发送系统消息" custom-class="smsw" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>
    <el-input v-model="title" ref="inputTitleEle" placeholder="消息标题" maxlength="50" show-word-limit />

    <el-input v-model="msg" ref="inputMsgEle" placeholder="消息内容（支持html）" resize="none" rows="5" maxlength="1000"
      show-word-limit type="textarea" id="input-msg-ele" />

    <div class="fc-bar">
      <el-button @click="setColor" id="color">设置颜色</el-button>
      <el-color-picker v-model="color" :predefine="predefinedmColors" />

      <el-button @click="setLink" id="link" style="margin-left: 20px;">设置链接</el-button>
      <el-input v-model="link" placeholder="支持但不推荐相对路径；绝对路径请加http(s)前缀" />
    </div>
    <div class="tip">1.选择颜色或输入链接；2.选中要设置的内容（注意不要将生成的style给选中了）；3.点击设置按钮</div>

    <div v-show="title !== '' && msg !== ''" class="row-title">预览消息实际显示效果</div>
    <SysMsgCard v-show="title !== '' && msg !== ''" :data="{ title: title, content: msg, time: Date.now() }"></SysMsgCard>

    <div class="row-title">收件人</div>
    <div class="rec-row">
      <el-checkbox v-model="recEveryone" border style="width: 100px; margin-right: 10px;">所有人</el-checkbox>
      <el-select v-show="!recEveryone" v-model="recipient" multiple filterable remote :remote-method="searchNickname"
        :loading="loading" loading-text="搜索中，请稍等" :no-data-text="hasSearch ? '无搜索结果' : '等待输入中'" placeholder=" "
        style="width: calc(100% - 110px)">
        <el-option v-for="nickname in option" :label="nickname" :value="nickname" :key="nickname"></el-option>
      </el-select>
    </div>
    <div v-show="!recEveryone" class="tip" style="margin-left: 110px;">请输入收件人昵称关键字</div>

    <template #footer>
      <el-button @click="closeMainWindow">取消</el-button>
      <el-button @click="send" type="primary">发送</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElButton, ElInput } from 'element-plus'
import { useStore } from "../store"
import * as common from "../common"
import SysMsgCard from "../components/SysMsgCard.vue"

type openPm = {
  afterSuccDo?: Function
  to?: string[]
}

const predefinedmColors = ref([
  '#FFFFFF',
  '#909399',
  '#000000',
  '#F56C6C',
  '#E6A23C',
  '#FFFF00',
  '#67C23A',
  '#409EFF',
  '#800080',
  '#FFC0CB',
])

const store = useStore()
store.openSMSWindow = openMainWindow

const inputTitleEle = ref<InstanceType<typeof ElInput>>()
const inputMsgEle = ref<InstanceType<typeof ElInput>>()
let inputMsgEleById: HTMLInputElement

let afterSuccDo: Function = () => { }

let mainWindowVisible = ref(false)
let title = ref("")
let msg = ref("")
let color = ref(null)
let link = ref("")
let recipient = ref<string[]>([])
let recEveryone = ref(false)
let option = ref<string[]>([])
let loading = ref(false)
let hasSearch = ref(false)

function openMainWindow(p?: openPm) {
  if (p) {
    if (p.afterSuccDo) {
      afterSuccDo = p.afterSuccDo
    }
    if (p.to) {
      p.to.forEach(nickname => {
        recipient.value.push(nickname)
      })
    }
  }

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  title.value = ""
  msg.value = ""
  color.value = null
  link.value = ""
  recipient.value = []
  recEveryone.value = false
}

function send() {
  title.value = title.value.trim()
  msg.value = msg.value.trim()

  if (title.value === "") {
    inputTitleEle.value?.focus()
    common.showError("标题不能为空")
    return
  }
  if (msg.value === "") {
    inputMsgEle.value?.focus()
    common.showError("内容不能为空")
    return
  }
  if (!recEveryone.value && recipient.value.length === 0) {
    common.showError("收件人不能为空")
    return
  }

  //TODO api请求
  console.log("标题：" + title.value)
  console.log("内容：" + msg.value)
  if (recEveryone.value) {
    console.log("收件人：所有人")
  } else {
    console.log("收件人：" + recipient.value)
  }

  afterSuccDo()
  closeMainWindow()
  common.showSuccess("发送成功")
}

function setColor() {
  if (color.value === null) {
    common.showError("请选择颜色")
    return
  }

  inputMsgEleById = document.getElementById("input-msg-ele") as HTMLInputElement
  const selectContent = msg.value.substring(inputMsgEleById.selectionStart as number, inputMsgEleById.selectionEnd as number)
  if (selectContent === '') {
    common.showError("请选中要设置的内容")
    return
  }

  const idx = msg.value.indexOf(selectContent)
  const fillText = `<span style="color: ${color.value};">${selectContent}</span>`
  msg.value = msg.value.substring(0, idx) + fillText + msg.value.substring(idx + selectContent.length)
}

function setLink() {
  if (link.value === '') {
    common.showError("请输入链接")
    return
  }

  inputMsgEleById = document.getElementById("input-msg-ele") as HTMLInputElement
  const selectContent = msg.value.substring(inputMsgEleById.selectionStart as number, inputMsgEleById.selectionEnd as number)
  if (selectContent === '') {
    common.showError("请选中要设置的内容")
    return
  }

  const idx = msg.value.indexOf(selectContent)
  const fillText = `<a href="${link.value}" target="_blank">${selectContent}</a>`
  msg.value = msg.value.substring(0, idx) + fillText + msg.value.substring(idx + selectContent.length)
}

const mockSearchSource = ["张三", "李四", "王五", "赵六", "Bonnenult", "惜缘灬冷颜"]
function searchNickname(searchKey: string) {
  hasSearch.value = false
  if (searchKey) {
    loading.value = true
    setTimeout(() => {
      hasSearch.value = true
      loading.value = false
      option.value = mockSearchSource.filter((item) => { return item.toLowerCase().includes(searchKey.toLowerCase()) })
    }, 1000);
  } else {
    option.value = []
  }
}
</script>

<style scoped>
.smsw .fc-bar {
  display: flex;
  align-items: center;
  margin-bottom: 3px !important;
}

.smsw .tip {
  font-size: 12px;
  color: #909399;
  margin-bottom: 0 !important;
}

.smsw .row-title {
  margin-bottom: 3px !important;
  font-size: 16px;
  color: black;
  margin-top: 20px;
  margin-left: 1px;
}

.smsw .rec-row {
  display: flex;
  align-items: center;
  margin-bottom: 3px !important;
}
</style>

<style>
.smsw .el-dialog__body>*:not(:last-child) {
  margin-bottom: 20px;
}

.smsw .el-dialog__header,
.smsw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.smsw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.el-color-dropdown__value {
  margin-top: -3px;
}

.el-color-dropdown__link-btn {
  background-color: white !important;
  border: 1px solid #dedfe0 !important;
}

.el-color-dropdown__link-btn:hover {
  color: #409EFF;
  border-color: #409EFF !important;
}

.el-color-dropdown {
  background-color: rgb(240, 240, 240) !important;
}
</style>