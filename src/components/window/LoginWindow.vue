<template>
  <div class="lw-container">
    <el-dialog @close="beforeClose" v-model="dialogVisible" :width="480" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <el-tabs @tab-change="tabChange" v-model="option">
        <el-tab-pane name="vcode">
          <template #label>
            <span :style="{ cursor: option === 'vcode' ? 'not-allowed' : 'pointer' }">邮箱登录/注册</span>
          </template>
          <div class="input-box">
            <div class="row">
              <span class="tag">邮箱</span>
              <el-input style="width: calc(100% - 57px - 135px);" v-model="email" placeholder="请输入邮箱" />
              <el-button v-blur :disabled="!checkEmailValid()" @click="openCaptchaWindow" id="get-captcha-btn"
                class="get-captcha-btn">获取验证码</el-button>
            </div>
            <div class="row">
              <span class="tag">验证码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="6" v-model="vcode" placeholder="请输入验证码" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="password">
          <template #label>
            <span :style="{ cursor: option === 'password' ? 'not-allowed' : 'pointer' }">密码登录</span>
          </template>
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
        <el-button v-blur @click="login" :disabled="!loginBtnCheck()" class="btn" type="primary">{{ btnText }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useStore } from "@/store"
import { useRouter } from "vue-router"
import { ElNotification } from 'element-plus'

type LoginInfo = {
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

// TODO 接入后端接口后清除预填充数据
let dialogVisible = ref(false)
// let option = ref("vcode")
let option = ref("password")
let btnText = ref("登录/注册")
// let email = ref("")
let email = ref("test@qianshi.fun")
let vcode = ref("")
// let password = ref("")
let password = ref("123456")
let hasVerify = ref(false)
let resetGetCaptchaBtn: Function

function show(tip?: string) {
  dialogVisible.value = true

  if (tip === undefined) {
    tip = "请登录后再操作"
  }
  tip = tip.trim()
  if (tip.length > 0) {
    cmjs.prompt.info(tip)
  }
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
  const btn = document.getElementById("get-captcha-btn") as HTMLButtonElement
  store.openCaptchaWindow(() => {
    // TODO api：发送验证码（若发送失败时则检查响应值是否有ttl(表示欲发送邮箱目前还处于cd中，还有ttl秒才能发送)，若有则直接让按钮进入cd ttl秒）
    resetGetCaptchaBtn = cmjs.util.btnCD(btn, 180, () => { hasVerify.value = false })
    hasVerify.value = true
    cmjs.prompt.success("验证码已发送")
  })
}

function beforeClose() {
  // TODO 接入后端接口后解除下方两行代码的注释
  // vcode.value = ""
  // password.value = ""
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
  // TODO api
  let li: LoginInfo = {
    "nickname": "Bonnenult",
    "avatarUrl": "/resource/avatar.jpeg",
    "token": "1",
    "refreshToken": "1",
  }
  return li
}

function saveLoginInfo(li: LoginInfo) {
  const avatar = li.avatarUrl
  cmjs.cache.setCookie("avatar", avatar, 3600)
  store.setTopMenuBarAvatar(avatar)
  cmjs.cache.setLS("token", li.token)
  cmjs.cache.setLS("refreshToken", li.refreshToken)
}

function login() {
  if (!loginBtnCheck()) {
    return
  }

  let li = mockLogin()
  saveLoginInfo(li)

  dialogVisible.value = false
  if (resetGetCaptchaBtn) {
    resetGetCaptchaBtn()
  }
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

<style lang="less" scoped>
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