<template>
  <div class="cw-container">
    <el-dialog @close="clearInput" v-model="dialogVisible" title="人机验证" :width="360" :close-on-press-escape=false
      :close-on-click-modal=false :align-center=true>
      <div style="display: flex;">
        <el-input @keyup.enter.native="verify" maxlength="4" v-model="input" />
        <Image :url="captchaUrl" :w="100" :h="30" border :round="false"></Image>
      </div>
      <template #footer>
        <el-button @click="verify" :disabled="input.length !== 4" type="primary">验证</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import * as common from "../common"

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
  if (input.value.length !== 4) {
    return
  }

  if (!checkCaptchaInput()) {
    common.showError("请输入4位数字")
  }
  dialogVisible.value = false
  afterSuccDo(180)
}
</script>

<style scoped></style>

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