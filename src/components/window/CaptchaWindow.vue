<template>
  <div class="cw-container">
    <el-dialog @close="clearInput" v-model="dialogVisible" title="人机验证" :width="360" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <div style="display: flex;">
        <el-input @keyup.enter.native="verify" maxlength="4" v-model="input" class="vi" />
        <Image :url="captchaUrl" :w="100" :h="30" border :round="false"></Image>
      </div>
      <template #footer>
        <el-button v-blur @click="verify" :disabled="input.length !== 4" type="primary">验证</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useStore } from '@/store'

const store = useStore()
store.openCaptchaWindow = show

defineExpose({
  show
})

let dialogVisible = ref(false)
let afterSuccDo: Function
let captchaUrl = ref("")
let input = ref("")

function show(afterSuccDoP: Function) {
  dialogVisible.value = true
  afterSuccDo = afterSuccDoP
}

function clearInput() {
  input.value = ""
  captchaUrl.value = ""
}

function checkCaptchaInput(): boolean {
  const vcodeRegex = /^[0-9]{4}$/
  return vcodeRegex.test(input.value)
}

function verify() {
  if (!checkCaptchaInput()) {
    cmjs.prompt.error("请输入4位数字")
    return
  }
  // TODO api
  dialogVisible.value = false
  afterSuccDo()
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