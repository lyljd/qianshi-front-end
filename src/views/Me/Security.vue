<template>
  <div v-loading="loading" class="sec-container">
    <div>
      <span>
        <svg class="icon-symbol" aria-hidden="true">
          <use :xlink:href="meSecurity.isSetPassword ? '#el-icon-success' : '#el-icon-warning'"></use>
        </svg>
        <span class="notice">密码</span>
      </span>
      <span class="info">{{ meSecurity.isSetPassword ? "已设置" : "未设置" }}</span>
      <span @click="setPassword" class="btn">{{ meSecurity.isSetPassword ? "修改密码" : "设置密码" }}</span>
    </div>
    <div class="tip" style="margin-top: 17px;">
      <span>{{ meSecurity.isSetPassword ? "修改密码" : "设置密码" }}后会让之前在其它设备上的的登录状态均失效</span>
    </div>

    <el-divider style="margin-top: 3px;" />

    <div>
      <span>
        <svg class="icon-symbol" aria-hidden="true">
          <use :xlink:href="'#el-icon-success'"></use>
        </svg>
        <span class="notice">邮箱</span>
      </span>
      <span class="info">{{ meSecurity.email }}</span>
      <span @click="setEmail" class="btn">更换邮箱</span>
    </div>

    <el-divider />
  </div>

  <el-dialog :width="400" v-model="setPwdWindowVisible" :title="meSecurity.isSetPassword ? '修改密码' : '设置密码'"
    :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align-center>
    <el-input autocomplete="new-password" v-model="newPwd" placeholder="请输入新密码(6~20位)" type="password" show-password style="margin-bottom: 10px;" />
    <el-input autocomplete="new-password" v-model="newPwdConfirm" placeholder="请再次输入新密码" type="password" show-password />
    <div class="tip" style="margin-top: 8px;">
      <span v-if="setPwdTtl > 0">请在{{ setPwdTtl }}秒内完成操作</span>
      <span v-else style="color: #F56C6C;">操作已过期，请重新验证！</span>
    </div>

    <template #footer>
      <el-button v-blur id="pass-confirm-btn" @click="submitSetPwdWindow" :disabled="!passConfirmBtnCheck()"
        type="success">确认</el-button>
      <el-button v-blur @click="closeSetPwdWindow" type="danger">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog :width="400" v-model="setEmailWindowVisible" title="更换邮箱" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>
    <el-input v-model="newEmail" placeholder="请输入新邮箱" />
    <div class="tip" style="margin-top: 8px;">
      <span v-if="setEmailTtl > 0">请在{{ setEmailTtl }}秒内完成操作</span>
      <span v-else style="color: #F56C6C;">操作已过期，请重新验证！</span>
    </div>

    <template #footer>
      <el-button v-blur id="email-confirm-btn" @click="submitSetEmailWindow" :disabled="!emailConfirmBtnCheck()"
        type="success">确认</el-button>
      <el-button v-blur @click="closeSetEmailWindow" type="danger">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store"
import cmjs from "@/cmjs";
import * as API from '@/api/user'

type MeSecurity = {
  isSetPassword: boolean
  email: string
}

type disabledEleResp = {
  disabled: () => void,
  cancelDisabled: () => void,
  isCounting: () => boolean,
  countDown: (second: number, endStatus?: Function, endDo?: Function) => void,
  endCountDown: (disabled: boolean) => void,
}

const store = useStore()
store.setMeCurTitle("账号安全")

let passConfirmBtn: HTMLButtonElement
let pcbDis: disabledEleResp
let emailConfirmBtn: HTMLButtonElement
let ecbDis: disabledEleResp

let meSecurity = ref<MeSecurity>({ isSetPassword: false, email: "******" })
let loading = ref(false)
getMeSecurity()

let setPwdWindowVisible = ref(false)
let setPwdTtl = ref(0)
let setPwdTimerId: number
let newPwd = ref("")
let newPwdConfirm = ref("")

let setEmailWindowVisible = ref(false)
let setEmailTtl = ref(0)
let setEmailTimerId: number
let newEmail = ref("")

function getMeSecurity() {
  loading.value = true
  API.meSecurity()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取账号安全信息失败")
        return
      }

      meSecurity.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function setPassword() {
  store.openEVWindow(meSecurity.value.email, "pass", (ttl: number) => { openSetPwdWindow(ttl) })
}

function openSetPwdWindow(ttl: number) {
  setPwdTtl.value = ttl
  setPwdTimerId = setInterval(() => {
    setPwdTtl.value--
    if (setPwdTtl.value === 0) {
      clearInterval(setPwdTimerId)
    }
  }, 1000)
  setPwdWindowVisible.value = true
}

function closeSetPwdWindow() {
  setPwdWindowVisible.value = false
  newPwd.value = ""
  newPwdConfirm.value = ""
  clearInterval(setPwdTimerId)
  setPwdTtl.value = 0
}

function passConfirmBtnCheck(): boolean {
  if (pcbDis && pcbDis.isCounting()) {
    return false
  }

  return newPwd.value === newPwdConfirm.value && newPwd.value.length >= 6 && newPwd.value.length <= 20 && setPwdTtl.value > 0
}

function submitSetPwdWindow() {
  if (!passConfirmBtnCheck()) {
    return
  }

  if (!passConfirmBtn) {
    passConfirmBtn = document.getElementById("pass-confirm-btn") as HTMLButtonElement
    pcbDis = cmjs.util.disabledButton(passConfirmBtn)
  }

  pcbDis.disabled()

  API.mePassChange(newPwd.value)
    .then((res) => {
      pcbDis.cancelDisabled()
      pcbDis.countDown(3, passConfirmBtnCheck)

      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      cmjs.cache.setLS("token", res.data.token)
      cmjs.cache.setLS("refreshToken", res.data.refreshToken)
      if (meSecurity.value.isSetPassword) {
        cmjs.prompt.success("修改密码成功")
      } else {
        cmjs.prompt.success("设置密码成功")
        meSecurity.value.isSetPassword = true
      }
      closeSetPwdWindow()
    })
    .catch((err) => {
      pcbDis.cancelDisabled()
      pcbDis.countDown(3, passConfirmBtnCheck)
      cmjs.prompt.error(err)
    })
}

function setEmail() {
  store.openEVWindow(meSecurity.value.email, "email-1", (ttl: number) => { openSetEmailWindow(ttl) })
}

function openSetEmailWindow(ttl: number) {
  setEmailTtl.value = ttl
  setEmailTimerId = setInterval(() => {
    setEmailTtl.value--
    if (setEmailTtl.value === 0) {
      clearInterval(setEmailTimerId)
    }
  }, 1000)
  setEmailWindowVisible.value = true
}

function closeSetEmailWindow() {
  setEmailWindowVisible.value = false
  newEmail.value = ""
  clearInterval(setEmailTimerId)
  setEmailTtl.value = 0
}

function emailConfirmBtnCheck(): boolean {
  if (ecbDis && ecbDis.isCounting()) {
    return false
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(newEmail.value)
}

function submitSetEmailWindow() {
  if (!emailConfirmBtnCheck()) {
    return
  }

  if (!emailConfirmBtn) {
    emailConfirmBtn = document.getElementById("email-confirm-btn") as HTMLButtonElement
    ecbDis = cmjs.util.disabledButton(emailConfirmBtn)
  }

  ecbDis.disabled()

  API.meEmailChange(newEmail.value)
    .then((res) => {
      ecbDis.cancelDisabled()
      ecbDis.countDown(3, emailConfirmBtnCheck)

      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      const ne = newEmail.value
      closeSetEmailWindow()
      store.openEVWindow(ne, "email-2", () => { changeEmail(ne) })
    })
    .catch((err) => {
      ecbDis.cancelDisabled()
      ecbDis.countDown(3, emailConfirmBtnCheck)
      cmjs.prompt.error(err)
    })
}

function changeEmail(email: string) {
  meSecurity.value.email = cmjs.util.encEmail(email)
  cmjs.prompt.success("更换邮箱成功")
}

</script>

<style lang="less" scoped>
.sec-container>*:not(.tip) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sec-container .notice {
  margin-left: 3px;
}

.sec-container .info {
  font-size: 14px;
  color: #909399;
}

.sec-container .btn {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
}

.sec-container .btn:hover {
  color: #337ecc;
}
</style>

<style>
.el-dialog__header,
.el-dialog__footer {
  padding: 20px !important;
  margin: 0 !important;
}

.el-dialog__body {
  padding: 0 20px !important;
}
</style>