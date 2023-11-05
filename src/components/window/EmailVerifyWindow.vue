<template>
  <el-dialog :width="400" @close="closeMainWindow" v-model="mainWindowVisible" title="邮箱验证" custom-class="main"
    :close-on-click-modal="false" :close-on-press-escape="false" align-center>
    <div style="margin-bottom: 10px;">为了确保您的账号安全，在进行对应操作前，需要先进行<strong>邮箱验证</strong>，<span class="click-here"
        @click="sendEmail">点此</span>发送验证码至<span class="email">{{ email
        }}</span></div>
    <el-input v-model="code" @keyup.enter.native="verify" maxlength="6" placeholder="请输入6位验证码" />

    <template #footer>
      <el-button v-blur @click="verify" :disabled="!hasVerify || code.length !== 6" type="primary">验证</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import cmjs from '@/cmjs'

const store = useStore()
store.openEVWindow = openMainWindow

let mainWindowVisible = ref(false)
let resetClickHereSpanEle: Function
let code = ref("")
let email = ref("")
let afterSuccDo: Function = () => { }
let hasVerify = ref(false)

function openMainWindow(emailP: string, afterSuccDoP: Function) {
  email.value = emailP
  afterSuccDo = afterSuccDoP

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  code.value = ""
}

function sendEmail() {
  const clickHereSpan = document.querySelector('.click-here') as HTMLSpanElement
  store.openCaptchaWindow(() => {
    // TODO api：发送验证码（若发送失败时则检查响应值是否有ttl(表示欲发送邮箱目前还处于cd中，还有ttl秒才能发送)，若有则直接让标签进入cd ttl秒）
    resetClickHereSpanEle = cmjs.util.spanCD(clickHereSpan, 180, () => { hasVerify.value = false })
    hasVerify.value = true
    cmjs.prompt.success("验证码已发送")
  })
}

function verify() {
  if (!hasVerify || code.value.length !== 6) {
    return
  }

  // TODO api
  const token = "uid.oid.sig" // 在验证成功后服务器会发来一个token（内部有oid和uid）
  // 在进行下一步需要验证的操作时带上这个token则可以正常访问api

  afterSuccDo(token)
  resetClickHereSpanEle()
  closeMainWindow()
}
</script>

<style lang="less" scoped>
.click-here {
  color: #67C23A;
  cursor: pointer;
}

.click-here:hover {
  color: #529b2e;
}

.email {
  color: #409EFF;
}
</style>

<style>
.main .el-dialog__header,
.main .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.main .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>