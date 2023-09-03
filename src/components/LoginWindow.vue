<template>
  <div class="lw-container">
    <el-dialog @close="clearInput" v-model="dialogVisible" :width="480" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <el-tabs @tab-change="tabChange" v-model="option">
        <el-tab-pane label="邮箱登录/注册" name="vcode">
          <div class="input-box">
            <div class="row">
              <span class="tag">邮箱</span>
              <el-input style="width: calc(100% - 57px - 135px);" v-model="email" placeholder="请输入邮箱" />
              <el-button :disabled="!checkEmailValid()" @click="openCaptchaWindow" id="get-captcha-btn"
                class="get-captcha-btn">获取验证码</el-button>
            </div>
            <div class="row">
              <span class="tag">验证码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="6" v-model="vcode" placeholder="请输入验证码" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="密码登录" name="password">
          <div class="input-box">
            <div class="row">
              <span class="tag">邮箱</span>
              <el-input class="input" v-model="email" placeholder="请输入邮箱" />
            </div>
            <div class="row">
              <span class="tag">密码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="20" type="password" show-password
                v-model="password" placeholder="请输入密码" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="login" :disabled="!loginBtnCheck()" class="btn" type="primary">{{ btnText }}</el-button>
      </template>
    </el-dialog>
  </div>

  <CaptchaWindow ref="captchaWindow"></CaptchaWindow>
</template>

<script setup lang="ts">
import * as common from "../common"
import CaptchaWindow from "./CaptchaWindow.vue"
import { useStore } from "../store"
import { useRouter } from "vue-router"
import { ElNotification } from 'element-plus'

type LoginInfo = {
  uid: number,
  nickname: string,
  avatarUrl: string,
  token: string,
  refreshToken: string,
}

defineExpose({
  show
})

const store = useStore()
const router = useRouter()

const captchaWindow = ref<InstanceType<typeof CaptchaWindow>>()

let dialogVisible = ref(false)
let afterSuccDo: Function
let option = ref("vcode")
let btnText = ref("登录/注册")
let email = ref("")
let vcode = ref("")
let password = ref("")
let hasVerify = ref(false)

function show(afterSuccDoP: Function) {
  dialogVisible.value = true
  afterSuccDo = afterSuccDoP
}

function tabChange(newTabName: string) {
  switch (newTabName) {
    case "vcode": {
      btnText.value = "登录/注册"
      break
    }
    case "password": {
      btnText.value = "登录"
      break
    }
  }
}

function openCaptchaWindow() {
  captchaWindow.value?.show((cdTime: number) => {
    let btn = document.getElementById("get-captcha-btn") as HTMLButtonElement
    common.btnCD(btn, cdTime)
    hasVerify.value = true
    common.showSuccess("验证码已发送")
  })
}

function clearInput() {
  vcode.value = ""
  password.value = ""
}

function checkEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.value)
}

function checkVcodeValid(): boolean {
  const vcodeRegex = /^[0-9]{6}$/
  return vcodeRegex.test(vcode.value)
}

function checkPasswordValid(): boolean {
  return password.value.length >= 6 && password.value.length <= 20
}

function loginBtnCheck(): boolean {
  switch (option.value) {
    case "vcode": {
      if (hasVerify.value && checkVcodeValid()) {
        return true
      }
      break
    }
    case "password": {
      if (checkEmailValid() && checkPasswordValid()) {
        return true
      }
      break
    }
  }
  return false
}

function mockLogin(): LoginInfo {
  let li: LoginInfo = {
    "uid": 1,
    "nickname": "ljd",
    "avatarUrl": "/resource/avatar.jpeg",
    "token": "payload.signature-token",
    "refreshToken": "payload.signature-refreshToken",
  }
  return li
}

function saveLoginInfo(li: LoginInfo) {
  localStorage.setItem("uid", li.uid.toString())
  localStorage.setItem("nickname", li.nickname)
  localStorage.setItem("avatarUrl", li.avatarUrl)
  localStorage.setItem("token", li.token)
  localStorage.setItem("refreshToken", li.refreshToken)
}

function login() {
  if (!loginBtnCheck()) {
    return
  }

  let li = mockLogin()
  afterSuccDo(li.avatarUrl, li.nickname)
  saveLoginInfo(li)

  dialogVisible.value = false
  store.isLogin = true

  let index = location.href.lastIndexOf("from=")
  if (index !== -1) {
    router.replace(location.href.slice(index + 5))
  }

  showLoginSuccess(li.nickname)
}

function showLoginSuccess(nickname: string) {
  ElNotification.success({
    title: "登录成功",
    message: `欢迎你，${nickname}`,
    showClose: false,
    offset: 57,
    duration: 2000,
  })
}
</script>

<style scoped>
.lw-container .input-box {
  border: 1px solid #c8c9cc;
  border-radius: 5px;
}

.lw-container .input-box .row {
  padding: 15px;
  display: flex;
  align-items: center;
  height: 14px;
}

.lw-container .input-box .row .tag {
  width: 42px;
  color: black;
  margin-right: 15px;
  text-align: right;
}

.lw-container .input-box .row .input {
  width: calc(100% - 57px);
}

.lw-container .input-box .row .get-captcha-btn {
  width: 120px;
  margin-left: 15px;
}

.lw-container .input-box .row:not(:last-child) {
  border-bottom: 1px solid #c8c9cc;
}

.lw-container .btn {
  width: 100%;
  height: 37px;
}
</style>

<style>
.lw-container .el-dialog.is-align-center {
  border-radius: 10px;
}

.lw-container .el-dialog__header,
.lw-container .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.lw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.lw-container .el-tabs__nav-wrap::after,
.lw-container .el-tabs__active-bar {
  display: none;
}

.lw-container .el-tabs__item {
  padding: 0;
  font-size: 18px;
}

.lw-container .el-tabs__item:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  /* right: .el-tabs__nav gap的一半 */
  right: -20px;
  width: 1px;
  background-color: #c8c9cc;
}

.lw-container .el-tabs__nav {
  float: unset;
  gap: 40px;
  justify-content: center;
  align-items: center;
  height: 18px;
}

.lw-container .el-tabs__header {
  margin: 0 0 20px;
}

.lw-container .el-input__wrapper {
  box-shadow: unset !important;
  padding: 0;
}
</style>