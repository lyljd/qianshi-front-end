<template>
  <el-dialog v-model="dialogVisible" :width="480" :close-on-press-escape=false :close-on-click-modal=false
    :align-center=true>
    <div class="window">

      <div class="option-raw">
        <strong ref="el" @click="switchEmailLogin" style="color: #409EFF; cursor: not-allowed;"
          class="option">邮箱登录/注册</strong>
        <span class="option-hr">｜</span>
        <strong ref="pl" @click="switchPasswordLogin" class="option">密码登录</strong>
      </div>

      <div v-show="option" class="email-login">
        <div class="input-container">
          <span class="info">邮箱</span>
          <span class="send-vcode-hr">｜</span>
          <span class="send-vcode-span">获取验证码</span>
          <el-input v-model="email" class="email" placeholder="请输入邮箱" />
          <div style="border-top: 1px solid #c8c9cc;"></div>
          <span class="info">验证码</span>
          <el-input @keyup.enter.native="emailLogin" maxlength="6" v-model="vcode" class="vcode" placeholder="请输入验证码" />
        </div>
        <el-button id="emailLoginBtn" @click="emailLogin" :class="{ loginBtnDisable: email === '' || vcode === '' }"
          class="login-btn" type="primary">登录/注册</el-button>
      </div>

      <div v-show="!option" class="password-login">
        <div class="input-container">
          <span class="info">邮箱</span>
          <el-input v-model="email" class="email" placeholder="请输入邮箱" />
          <div style="border-top: 1px solid #c8c9cc;"></div>
          <span class="info">密码</span>
          <el-input @keyup.enter.native="passwordLogin" v-model="password" class="password" type="password" show-password
            placeholder="请输入密码" />
        </div>
        <el-button id="passwordLoginBtn" @click="passwordLogin"
          :class="{ loginBtnDisable: email === '' || password === '' }" class="login-btn" type="primary">登录</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import * as common from "../common"
import { ElMessage, ElNotification } from 'element-plus'
import { useStore } from "../store"

type LoginInfo = {
  uid: number,
  nickname: string,
  avatarUrl: string,
  lastIpLocation: string,
  token: string,
  refreshToken: string,
}

defineExpose({
  show
})

const store = useStore()

const el = ref()
const pl = ref()

let CB: Function
let dialogVisible = ref(false)
let email = ref("")
let vcode = ref("")
let password = ref("")
let option = ref(true)

function show(cb: Function) {
  dialogVisible.value = true
  CB = cb
}

function switchEmailLogin() {
  option.value = true
  el.value.style.color = "#409EFF"
  pl.value.style.color = "#303133"
  el.value.style.cursor = "not-allowed"
  pl.value.style.cursor = "pointer"
}

function switchPasswordLogin() {
  option.value = false
  pl.value.style.color = "#409EFF"
  el.value.style.color = "#303133"
  pl.value.style.cursor = "not-allowed"
  el.value.style.cursor = "pointer"
}

function verifyEmail() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.value)
}

function verifyVcode() {
  const vcodeRegex = /^\d{6}$/
  return vcodeRegex.test(vcode.value)
}

function verifyPassword() {
  return password.value.length >= 6
}

function showLoginError(msg: string) {
  ElMessage({
    "message": msg,
    "offset": 60,
    "customClass": "zIndex999",
    "type": "error",
  })
}

function showLoginSuccess(nickname: string, lastIpLocation: string) {
  ElNotification.success({
    title: `欢迎你，${nickname}`,
    message: `上次登录ip地址：${lastIpLocation}`,
    showClose: false,
    offset: 57,
  })
}

function mockLogin() {
  let li: LoginInfo = {
    "uid": 1,
    "nickname": "Bonnenult",
    "avatarUrl": "../../public/avatar.jpeg",
    "lastIpLocation": "重庆",
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

function emailLogin() {
  let emailLoginBtn = document.getElementById("emailLoginBtn") as HTMLButtonElement
  if (emailLoginBtn.disabled) {
    return
  }
  common.btnCD(emailLoginBtn, 2000)
  if (!verifyEmail()) {
    showLoginError("邮箱格式有误")
    return
  }
  if (!verifyVcode()) {
    showLoginError("验证码为6位数字")
    return
  }
  dialogVisible.value = false
  store.isLogin = true
  let li = mockLogin()
  CB(li.avatarUrl)
  saveLoginInfo(li)
  showLoginSuccess(li.nickname, li.lastIpLocation)
  vcode.value = ""
}

function passwordLogin() {
  let passwordLoginBtn = document.getElementById("passwordLoginBtn") as HTMLButtonElement
  if (passwordLoginBtn.disabled) {
    return
  }
  common.btnCD(passwordLoginBtn, 5000)
  if (!verifyEmail()) {
    showLoginError("邮箱格式有误")
    return
  }
  if (!verifyPassword()) {
    showLoginError("密码至少6位")
    return
  }
  dialogVisible.value = false
  store.isLogin = true
  let li = mockLogin()
  CB(li.avatarUrl)
  saveLoginInfo(li)
  showLoginSuccess(li.nickname, li.lastIpLocation)
  password.value = ""
}
</script>

<style scoped>
.window {
  width: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
}

.option-raw {
  margin-bottom: 20px;
}

.option {
  font-size: 18px;
}

.option:hover {
  cursor: pointer;
}

.option-hr {
  color: #c8c9cc;
  margin-left: 10px;
  margin-right: 10px;
  cursor: default;
}

.email-login,
.password-login {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.email-login .input-container,
.password-login .input-container {
  border: 1px solid #c8c9cc;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 20px;
}

.input-container .info {
  position: absolute;
  margin-left: 24px;
  margin-top: 12px;
  z-index: 1;
  cursor: default;
}

.email-login .input-container .send-vcode-hr {
  position: absolute;
  margin-left: 296px;
  margin-top: 12px;
  z-index: 1;
  cursor: default;
  color: #c8c9cc;
}

.email-login .input-container .send-vcode-span {
  position: absolute;
  margin-left: 326px;
  margin-top: 12px;
  z-index: 1;
  cursor: default;
}

.email-login .input-container .send-vcode-span:hover {
  color: #409EFF;
  cursor: pointer;
}

.input-container .email,
.input-container .vcode,
.input-container .password,
.login-btn {
  width: 100%;
  height: 40px;
}

.email-login .input-container .email,
.email-login .input-container .vcode {
  padding-left: 74px;
  padding-right: 132px;
}

.password-login .input-container .email,
.password-login .input-container .password {
  padding-left: 62px;
  padding-right: 16px;
}

.login-btn {
  border-radius: 5px;
}

.loginBtnDisable {
  pointer-events: none;
  background-color: #c8c9cc;
  border: none;
}
</style>

<style>
.zIndex999 {
  z-index: 99999 !important;
}

.window .el-input__wrapper {
  border: none !important;
  box-shadow: none !important;
  padding: 0px;
}

.el-dialog.is-align-center {
  border-radius: 10px;
}
</style>