<template>
  <el-dialog :width="400" @close="closeMainWindow" v-model="mainWindowVisible" title="邮箱验证" class="main"
    :close-on-click-modal="false" :close-on-press-escape="false" align-center>
    <div style="margin-bottom: 10px;">为了确保您的账号安全，在进行对应操作前，需要先进行<strong>邮箱验证</strong>，<span class="click-here"
        @click="sendEmail">点此</span>发送验证码至<span class="email">{{ email
        }}</span></div>
    <el-input v-model="code" @keyup.enter.native="verify" maxlength="6" placeholder="请输入6位验证码" />

    <template #footer>
      <el-button v-blur id="email-verify-btn" @click="verify" :disabled="!verifyBtnCheck()" type="primary">验证</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import * as VcodeAPI from '@/api/vcode'
import * as UserAPI from '@/api/user'

type disabledEleResp = {
  disabled: () => void,
  cancelDisabled: () => void,
  isCounting: () => boolean,
  countDown: (second: number, endStatus?: Function, endDo?: Function) => void,
  endCountDown: (disabled: boolean) => void,
}

const store = useStore()
store.openEVWindow = openMainWindow

let clickHereSpan: HTMLSpanElement
let chsDis: disabledEleResp
let verifyBtn: HTMLButtonElement
let vbDis: disabledEleResp

let mainWindowVisible = ref(false)
let code = ref("")
let email = ref("")
let option = ref("")
let afterSuccDo: Function = () => { }

function openMainWindow(emailP: string, optionP: "pass" | "email-1" | "email-2", afterSuccDoP: Function) {
  email.value = emailP
  option.value = optionP
  afterSuccDo = afterSuccDoP

  mainWindowVisible.value = true
}

function closeMainWindow() {
  mainWindowVisible.value = false
  code.value = ""
}

function sendEmail() {
  if (!clickHereSpan) {
    clickHereSpan = document.querySelector('.click-here') as HTMLSpanElement
    chsDis = cmjs.util.disabledSpan(clickHereSpan)
  }

  chsDis.countDown(5)

  store.openCaptchaWindow((captchaId: string) => {
    chsDis.endCountDown(false)
    chsDis.disabled()
    cmjs.prompt.info("发送验证码中，请稍等")

    let sendEmailOption = ""
    let sendEmail
    if (option.value === "pass") {
      sendEmailOption = "password"
    } else if (option.value === "email-1" || option.value === "email-2") {
      if (option.value === "email-1") {
        sendEmail = ""
      } else {
        sendEmail = email.value
      }
      sendEmailOption = "email"
    }

    VcodeAPI.changePasswordOrEmail(sendEmailOption as "password" | "email", captchaId, sendEmail)
      .then((res) => {
        chsDis.cancelDisabled()
        if (res.code !== 0 && res.code !== 200) {
          cmjs.prompt.error("验证码发送失败")
          return
        }

        if (res.code === 200) {
          cmjs.prompt.info("你在短时内验证过，验证码未发送，跳过邮箱验证")
          verifySuccDo(res.data.ttl)
          return
        }

        if (res.data.ttl > 0) {
          chsDis.countDown(res.data.ttl)
          cmjs.prompt.info("你有未使用的验证码，请检查邮箱")
          return
        }

        chsDis.countDown(180)
        cmjs.prompt.success("验证码已发送")
      })
      .catch(() => {
        chsDis.cancelDisabled()
        cmjs.prompt.error("发送验证码失败")
      })
  })
}

function verifyBtnCheck(): boolean {
  if (vbDis && vbDis.isCounting()) {
    return false
  }

  return code.value.length === 6
}

function verify() {
  if (!verifyBtnCheck()) {
    return
  }

  if (!verifyBtn) {
    verifyBtn = document.getElementById("email-verify-btn") as HTMLButtonElement
    vbDis = cmjs.util.disabledButton(verifyBtn)
  }

  let verifyOption = ""
  let verifyEmail
  if (option.value === "pass") {
    verifyOption = "pass"
  } else if (option.value === "email-1" || option.value === "email-2") {
    if (option.value === "email-1") {
      verifyEmail = ""
    } else {
      verifyEmail = email.value
    }
    verifyOption = "email"
  }

  vbDis.disabled()

  UserAPI.mePassOrEmailVerify(verifyOption as "pass" | "email", code.value, verifyEmail)
    .then((res) => {
      vbDis.cancelDisabled()
      vbDis.countDown(3, verifyBtnCheck)

      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      verifySuccDo(res.data.ttl)
    })
    .catch((err) => {
      vbDis.cancelDisabled()
      vbDis.countDown(3, verifyBtnCheck)
      cmjs.prompt.error(err)
    })
}

function verifySuccDo(ttl: number) {
  closeMainWindow()
  chsDis.endCountDown(false)
  afterSuccDo(ttl)
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