<template>
  <div class="cw-container">
    <el-dialog @close="beforeClose" v-model="dialogVisible" title="人机验证" :width="300" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <div style="display: flex;">
        <el-input @keyup.enter.native="verify" maxlength="4" v-model="input" class="vi" placeholder="请输入右侧图片中的数字" />
        <Image @click="reloadCaptcha" :url="captchaUrl" :w="100" :h="30" border style="border-left: none;"
          :style="{ cursor: reloadCDing ? 'not-allowed' : 'pointer' }"></Image>
      </div>
      <template #footer>
        <el-button v-blur id="verify-btn" @click="verify" :disabled="!verifyBtnCheck()" type="primary">验证</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useStore } from '@/store'
import * as API from '@/api/captcha'

type disabledEleResp = {
  disabled: () => void,
  cancelDisabled: () => void,
  isCounting: () => boolean,
  countDown: (second: number, endStatus?: Function, endDo?: Function) => void,
  endCountDown: (disabled: boolean) => void,
}

const store = useStore()
store.openCaptchaWindow = show

defineExpose({
  show
})

let verifyBtn: HTMLButtonElement
let vbDis: disabledEleResp

let dialogVisible = ref(false)
let afterSuccDo: Function
let captchaId = ref("")
let captchaUrl = ref("")
let input = ref("")
let captchaLoadFail = ref(false)
let reloadCDing = ref(false)

function show(afterSuccDoP: Function) {
  API.generateCaptchaId()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取验证码失败")
        return
      }

      captchaId.value = res.data.id
      API.getCaptcha(captchaId.value)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error("获取验证码失败")
            return
          }

          captchaUrl.value = res.data.image
          dialogVisible.value = true
          afterSuccDo = afterSuccDoP
          return
        })
        .catch((err) => {
          cmjs.prompt.error(err)
          return
        })
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
}

function beforeClose() {
  input.value = ""
  captchaId.value = ""
  captchaUrl.value = ""
  captchaLoadFail.value = false
}

function reloadCaptcha() {
  if (reloadCDing.value) {
    return
  }

  reloadCDing.value = true
  setTimeout(() => {
    reloadCDing.value = false
  }, 3000)

  API.reloadCaptcha(captchaId.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("刷新验证码失败")
        return
      }

      API.getCaptcha(captchaId.value)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error("获取验证码失败")
            captchaUrl.value = ""
            captchaLoadFail.value = true
            return
          }

          captchaUrl.value = res.data.image
          captchaLoadFail.value = false
          return
        })
        .catch((err) => {
          cmjs.prompt.error(err)
          captchaUrl.value = ""
          captchaLoadFail.value = true
          return
        })
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
}

function verifyBtnCheck(): boolean {
  if (vbDis && vbDis.isCounting()) {
    return false
  }

  const vcodeRegex = /^[0-9]{4}$/
  return vcodeRegex.test(input.value) && !captchaLoadFail.value
}

function verify() {
  if (!verifyBtnCheck()) {
    return
  }

  if (!verifyBtn) {
    verifyBtn = document.getElementById("verify-btn") as HTMLButtonElement
    vbDis = cmjs.util.disabledButton(verifyBtn)
  }

  vbDis.disabled()

  API.verifyCaptcha(captchaId.value, input.value)
    .then((res) => {
      vbDis.cancelDisabled()
      vbDis.countDown(3, verifyBtnCheck)

      if (res.code === 0) {
        dialogVisible.value = false
        afterSuccDo(captchaId.value)
        return
      }

      cmjs.prompt.error("验证验证码失败")
      input.value = ""

      API.generateCaptchaId()
        .then((res) => {
          if (res.code !== 0) {
            captchaId.value = ""
            captchaUrl.value = ""
            captchaLoadFail.value = true
            cmjs.prompt.error("重置验证码失败")
            return
          }

          captchaId.value = res.data.id
          API.getCaptcha(captchaId.value)
            .then((res) => {
              if (res.code !== 0) {
                captchaUrl.value = ""
                captchaLoadFail.value = true
                cmjs.prompt.error("重置验证码失败")
                return
              }

              captchaLoadFail.value = false
              captchaUrl.value = res.data.image
              return
            })
            .catch((err) => {
              captchaUrl.value = ""
              captchaLoadFail.value = true
              cmjs.prompt.error(err)
              return
            })
        })
        .catch((err) => {
          cmjs.prompt.error(err)
          captchaId.value = ""
          captchaUrl.value = ""
          captchaLoadFail.value = true
        })
    })
    .catch((err) => {
      vbDis.cancelDisabled()
      vbDis.countDown(3, verifyBtnCheck)
      cmjs.prompt.error(err)
      input.value = ""
    })
}
</script>

<style lang="less" scoped>
.cw-container .vi :deep(.el-input__wrapper) {
  border-radius: unset;
}
</style>

<style>
.cw-container .el-dialog.is-align-center {
  border-radius: 5px;
}

.cw-container .el-dialog__header,
.cw-container .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.cw-container .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>