<template>
  <el-dialog :width="480" :close-on-press-escape=false :align-center=true>
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
          <el-input maxlength="6" v-model="vcode" class="vcode" placeholder="请输入验证码" />
        </div>
        <el-button class="login-btn" type="primary">登录/注册</el-button>
      </div>

      <div v-show="!option" class="password-login">
        <div class="input-container">
          <span class="info">邮箱</span>
          <el-input v-model="email" class="email" placeholder="请输入邮箱" />
          <div style="border-top: 1px solid #c8c9cc;"></div>
          <span class="info">密码</span>
          <el-input v-model="password" class="password" type="password" show-password placeholder="请输入密码" />
        </div>
        <el-button class="login-btn" type="primary">登录</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const el = ref()
const pl = ref()

let email = ref("")
let vcode = ref("")
let password  = ref("")

let option = ref(true)

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

.email-login, .password-login {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.email-login .input-container, .password-login .input-container {
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
</style>

<style>
.el-input__wrapper {
  border: none !important;
  box-shadow: none !important;
  padding: 0px;
}

.el-dialog.is-align-center {
  border-radius: 10px;
}
</style>