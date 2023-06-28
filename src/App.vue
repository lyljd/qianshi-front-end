<template>
  <el-backtop :right="50" :bottom="50" />

  <div v-if="common.isMobile()">
    <TopMenuBar></TopMenuBar>
    <div v-if="$route.path !== '/'" class="placeholder"></div>
    <router-view></router-view>
    <div @click="inSiteMessage" class="in-site-message-container">
      <span v-if="store.isLogin" class="in-site-message">站内留言</span>
    </div>
  </div>
  <div v-else>
    目前未做移动端适配，请用pc端访问
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from "./components/TopMenuBar.vue"
import * as common from "./common"
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from "./store"

const store = useStore()

let message = ref("")

function inSiteMessage() {
  ElMessageBox({
    title: '站内留言',
    message: h('div', { style: 'margin-right: 10px;' }, [
      h('div', null, [
        h('textarea', { id: 'in-site-message', onInput: onMessageChange, placeholder: '有什么问题都可以直接留言，管理员会在24小时内回复的～' }),
      ]),
      h('span', { id: 'notice' }, '留言不能为空哦'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeMessageWindowClose,
  })
}

function onMessageChange() {
  message.value = (document.getElementById("in-site-message") as HTMLTextAreaElement).value;
  checkInput()
}

function beforeMessageWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    message.value = message.value.trim();
    (document.getElementById("in-site-message") as HTMLTextAreaElement).value = ""
    if (!checkInput()) {
      return
    }
    ElMessage({
      type: 'success',
      offset: 77,
      message: "提交成功",
    })
  }
  message.value = ""
  done()
}

function checkInput() {
  if (message.value.length > 0) {
    (document.getElementById("notice") as HTMLSpanElement).style.display = "none"
    return true
  }
  (document.getElementById("notice") as HTMLSpanElement).style.display = "inline"
  return false
}
</script>

<style scoped>
.placeholder {
  margin-top: 57px;
}

.in-site-message-container {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.in-site-message {
  cursor: pointer;
  color: #FF6699;
}

.in-site-message:hover {
  color: #E84B85;
}
</style>

<style>
#in-site-message {
  width: 100%;
  resize: none;
  border: 1px solid #dedfe0;
  border-radius: 5px;
  padding: 5px;
  height: 150px;
}

#in-site-message:hover {
  border-color: #c8c9cc;
}

#notice {
  color: red;
  font-size: 12px;
  display: none;
}
</style>