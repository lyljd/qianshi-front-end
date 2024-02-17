<template>
  <div class="sec-container">
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

    <el-divider />

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
    <el-input v-model="newPwd" placeholder="请输入新密码(6~20位)" type="password" show-password style="margin-bottom: 10px;" />
    <el-input v-model="newPwdConfirm" placeholder="请再次输入新密码" type="password" show-password />

    <template #footer>
      <el-button v-blur @click="submitSetPwdWindow" :disabled="!setPwdInputCheck()" type="success">确认</el-button>
      <el-button v-blur @click="closeSetPwdWindow" type="danger">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog :width="400" v-model="setEmailWindowVisible" title="更换邮箱" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center>
    <el-input v-model="newEmail" placeholder="请输入新邮箱" />

    <template #footer>
      <el-button v-blur @click="submitSetEmailWindow" :disabled="!setEmailInputCheck()" type="success">确认</el-button>
      <el-button v-blur @click="closeSetEmailWindow" type="danger">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from "@/cmjs";
import mockMeSecurity from "@/mock/me/security.json"
import { useStore } from "@/store"

type MeSecurity = {
  isSetPassword: boolean
  email: string
}

const store = useStore()
store.setMeCurTitle("账号安全")

let meSecurity: MeSecurity = reactive(getMeSecurity())

let setPwdWindowVisible = ref(false)
let setPwdAPIToken = ref("")
let newPwd = ref("")
let newPwdConfirm = ref("")

let setEmailWindowVisible = ref(false)
let setEmailAPIToken = ref("")
let newEmail = ref("")

function getMeSecurity() {
  return mockMeSecurity //TODO api
}

function setPassword() {
  store.openEVWindow(meSecurity.email, (token: string) => { setPwdAPIToken.value = token; openSetPwdWindow() })
}

function openSetPwdWindow() {
  setPwdWindowVisible.value = true
}

function closeSetPwdWindow() {
  newPwd.value = ""
  newPwdConfirm.value = ""
  setPwdWindowVisible.value = false
}

function setPwdInputCheck() {
  return newPwd.value === newPwdConfirm.value && newPwd.value.length >= 6 && newPwd.value.length <= 20
}

function submitSetPwdWindow() {
  // TODO api（带上token）
  if (meSecurity.isSetPassword) {
    cmjs.prompt.success("修改密码成功")
  } else {
    cmjs.prompt.success("设置密码成功")
    meSecurity.isSetPassword = true
  }
  closeSetPwdWindow()
}

function setEmail() {
  store.openEVWindow(meSecurity.email, (token: string) => { setEmailAPIToken.value = token; openSetEmailWindow() })
}

function openSetEmailWindow() {
  setEmailWindowVisible.value = true
}

function closeSetEmailWindow() {
  newEmail.value = ""
  setEmailWindowVisible.value = false
}

function setEmailInputCheck() {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(newEmail.value)
}

function submitSetEmailWindow() {
  const ne = newEmail.value
  // TODO api：判断新邮箱是否已绑定其他账号（带上token）
  closeSetEmailWindow()
  store.openEVWindow(ne, (token: string) => { changeEmail(token, ne) })
}

function changeEmail(token: string, email: string) {
  // TODO api（真正的更换邮箱的api）（带上token）
  cmjs.prompt.success("更换邮箱成功")
  meSecurity.email = cmjs.util.encryptionEmailText(email)
}

</script>

<style lang="less" scoped>
.sec-container>* {
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