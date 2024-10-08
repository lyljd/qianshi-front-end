<template>
  <div class="lw-container">
    <el-dialog @close="beforeClose" v-model="dialogVisible" :width="480" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <el-tabs v-model="option">
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
              <el-input :autocomplete="autocomplete" @keyup.enter.native="login" class="input" maxlength="20"
                type="password" show-password v-model="password" placeholder="请输入密码" />
            </div>
          </div>
          <div class="tip" style="text-align: center;">
            <span>首次登录请使用【验证码登录】</span>
          </div>
        </el-tab-pane>

        <el-tab-pane name="vcode">
          <template #label>
            <span :style="{ cursor: option === 'vcode' ? 'not-allowed' : 'pointer' }">验证码登录</span>
          </template>
          <div class="input-box">
            <div class="row">
              <span class="tag">邮箱</span>
              <el-input style="width: calc(100% - 57px - 135px);" v-model="email" placeholder="请输入邮箱" />
              <el-button v-blur :disabled="!getCaptchaBtnCheck()" @click="openCaptchaWindow" id="get-captcha-btn"
                class="get-captcha-btn">获取验证码</el-button>
            </div>
            <div class="row">
              <span class="tag">验证码</span>
              <el-input @keyup.enter.native="login" class="input" maxlength="6" v-model="vcode" placeholder="请输入验证码" />
            </div>
          </div>
          <div class="tip" style="text-align: center;">
            <span>当您首次登录成功后，将自动为您注册账号。</span>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button v-blur @click="login" :disabled="!loginBtnCheck()" class="btn" id="login-btn"
          type="primary">登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useStore } from "@/store"
import { useRouter } from "vue-router"
import { ElNotification } from 'element-plus'
import * as VCodeAPI from '@/api/vcode'
import * as UserAPI from '@/api/user'

type LoginInfo = {
  nickname: string,
  avatarUrl: string,
  token: string,
  refreshToken: string,
  newMessageNum: number,
}

type disabledEleResp = {
  disabled: () => void,
  cancelDisabled: () => void,
  isCounting: () => boolean,
  countDown: (second: number, endStatus?: Function, endDo?: Function) => void,
  endCountDown: (disabled: boolean) => void,
}

defineExpose({
  show
})

const store = useStore()
const router = useRouter()

let getCaptchaBtn: HTMLButtonElement
let gcbDis: disabledEleResp
let loginBtn: HTMLButtonElement
let lbDis: disabledEleResp

let dialogVisible = ref(false)
let option = ref("")
let email = ref("")
let vcode = ref("")
let password = ref("")
let autocomplete = ref("")

function show(cfg?: { tip?: string, option?: 'password' | 'vcode' }) {
  if (!cfg) {
    cfg = {}
  }

  if (cfg.tip === undefined) {
    cfg.tip = "请登录后再操作"
  }
  cfg.tip = cfg.tip.trim()

  if (!cfg.option) {
    cfg.option = 'password'
  }
  if (cfg.option !== 'password') {
    autocomplete.value = 'new-password'
  }

  option.value = cfg.option
  dialogVisible.value = true
  if (cfg.tip.length > 0) {
    cmjs.prompt.info(cfg.tip)
  }
}

function beforeClose() {
  vcode.value = ""
  // 清除密码会导致关闭再打开窗口时浏览器的密码自动填充失效
  // password.value = ""
}

function openCaptchaWindow() {
  if (!checkEmailValid()) {
    return
  }

  if (!getCaptchaBtn) {
    getCaptchaBtn = document.getElementById("get-captcha-btn") as HTMLButtonElement
    gcbDis = cmjs.util.disabledButton(getCaptchaBtn)
  }

  gcbDis.countDown(5, checkEmailValid)

  store.openCaptchaWindow((captchaId: string) => {
    gcbDis.endCountDown(false)
    gcbDis.disabled()

    VCodeAPI.login(email.value, captchaId)
      .then((res) => {
        gcbDis.cancelDisabled()
        if (res.code !== 0) {
          cmjs.prompt.error("验证码发送失败")
          return
        }

        gcbDis.countDown(180, checkEmailValid)
        cmjs.prompt.success("验证码已发送")
      })
      .catch((err) => {
        gcbDis.cancelDisabled()
        cmjs.prompt.error(err)
      })
  })
}

function checkEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.value)
}

function checkPasswordValid(): boolean {
  return password.value.length >= 6 && password.value.length <= 20
}

function checkVcodeValid(): boolean {
  const vcodeRegex = /^[0-9A-Za-z]{6}$/
  return vcodeRegex.test(vcode.value)
}

function getCaptchaBtnCheck(): boolean {
  if (gcbDis && gcbDis.isCounting()) {
    return false
  }

  return checkEmailValid()
}

function loginBtnCheck(): boolean {
  if (lbDis && lbDis.isCounting()) {
    return false
  }

  switch (option.value) {
    case "password": {
      return checkEmailValid() && checkPasswordValid()
    }
    case "vcode": {
      return checkEmailValid() && checkVcodeValid()
    }
  }

  return false
}

function login() {
  if (!loginBtnCheck()) {
    return
  }

  if (!loginBtn) {
    loginBtn = document.getElementById("login-btn") as HTMLButtonElement
    lbDis = cmjs.util.disabledButton(loginBtn)
  }

  lbDis.disabled()

  switch (option.value) {
    case "password": {
      UserAPI.passLogin(email.value, password.value)
        .then((res) => {
          lbDis.cancelDisabled()
          lbDis.countDown(3, loginBtnCheck)

          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          loginSuccDo(res.data)
        })
        .catch((err) => {
          lbDis.cancelDisabled()
          lbDis.countDown(3, loginBtnCheck)
          cmjs.prompt.error(err)
        })
      break
    }
    case "vcode": {
      UserAPI.emailLogin(email.value, vcode.value)
        .then((res) => {
          lbDis.cancelDisabled()
          lbDis.countDown(3, loginBtnCheck)

          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          loginSuccDo(res.data)
        })
        .catch((err) => {
          lbDis.cancelDisabled()
          lbDis.countDown(3, loginBtnCheck)
          cmjs.prompt.error(err)
        })
      break
    }
  }
}

function saveLoginInfo(li: LoginInfo) {
  const avatar = li.avatarUrl
  cmjs.cache.setCookie("avatar", avatar, 3600)
  store.setTopMenuBarAvatar(avatar)
  cmjs.cache.setLS("token", li.token)
  cmjs.cache.setLS("refreshToken", li.refreshToken)
}

function loginSuccDo(li: LoginInfo) {
  saveLoginInfo(li)

  dialogVisible.value = false
  lbDis.endCountDown(false)
  store.isLogin = true
  // store.setNewMessageNum(li.newMessageNum)
  setTimeout(() => {
    store.setTopMenuBarAvatar(li.avatarUrl)
  }, 0)

  let index = location.href.lastIndexOf("from=")
  if (index !== -1) {
    router.replace(location.href.slice(index + 5))
  }

  ElNotification.success({
    title: "登录成功",
    message: `欢迎你，${li.nickname}`,
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
  width: 43px;
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