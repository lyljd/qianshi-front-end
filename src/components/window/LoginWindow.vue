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
              <el-button v-blur :disabled="!getCaptchaBtnCheck()" @click="openCaptchaWindow" id="get-captcha-btn"
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
        <el-button v-blur @click="login" :disabled="!loginBtnCheck()" class="btn" id="login-btn" type="primary">{{
      btnText
          }}</el-button>
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
  newDynamicNum: number,
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
let option = ref("vcode")
let btnText = ref("登录/注册")
let email = ref("")
let vcode = ref("")
let password = ref("")

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

function beforeClose() {
  vcode.value = ""
  password.value = ""
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
    cmjs.prompt.info("发送验证码中，请稍等")

    VCodeAPI.login(email.value, captchaId)
      .then((res) => {
        gcbDis.cancelDisabled()
        if (res.code !== 0) {
          cmjs.prompt.error("验证码发送失败")
          return
        }

        if (res.data.ttl > 0) {
          gcbDis.countDown(res.data.ttl, checkEmailValid)
          cmjs.prompt.info("你有未使用的验证码，请检查邮箱")
          return
        }

        gcbDis.countDown(180, checkEmailValid)
        cmjs.prompt.success("验证码已发送")
      })
      .catch(() => {
        gcbDis.cancelDisabled()
        cmjs.prompt.error("发送验证码失败")
      })
  })
}

function checkEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.value)
}

function checkVcodeValid(): boolean {
  const vcodeRegex = /^[0-9A-Za-z]{6}$/
  return vcodeRegex.test(vcode.value)
}

function checkPasswordValid(): boolean {
  return password.value.length >= 6 && password.value.length <= 20
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
    case "vcode": {
      return checkEmailValid() && checkVcodeValid()
    }
    case "password": {
      return checkEmailValid() && checkPasswordValid()
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
  store.setNewMessageNum(li.newMessageNum)
  store.setNewDynamicNum(li.newDynamicNum)
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