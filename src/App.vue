<template>
  <div v-if="!cmjs.util.isMobile()">
    <el-backtop style="z-index: 2000;" :right="50" :bottom="50" />

    <TopMenuBar v-if="store.topPath !== 'manage'"></TopMenuBar>

    <div v-if="$route.path !== '/' && store.topPath !== 'manage'" class="placeholder"></div>

    <div>
      <router-view></router-view>

      <div v-if="store.topPath === '' || store.topPath === 'read'" class="in-site-message-container">
        <span @click="inSiteMessage" v-if="store.isLogin" class="in-site-message">站内留言</span>
      </div>

      <FeedbackSubmissionWindow></FeedbackSubmissionWindow>

      <PreviewVideoWindow></PreviewVideoWindow>

      <CaptchaWindow></CaptchaWindow>

      <EmailVerifyWindow></EmailVerifyWindow>
    </div>
  </div>

  <div v-else>
    目前未做移动端适配，请用PC端访问（建议使用Edge或Safari浏览器访问以获得最好的体验）
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from "@/components/once/TopMenuBar.vue"
import FeedbackSubmissionWindow from "@/components/window/FeedbackSubmissionWindow.vue"
import PreviewVideoWindow from "@/components/window/PreviewVideoWindow.vue"
import CaptchaWindow from "@/components/window/CaptchaWindow.vue"
import EmailVerifyWindow from "@/components/window/EmailVerifyWindow.vue"
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import { UploadUserFile } from 'element-plus'

const store = useStore()

function inSiteMessage() {
  store.openFSWindow({
    title: "站内留言",
    placeholder: "有什么问题都可以直接留言，管理员会尽快回复的！",
    submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
      }),
        cmjs.prompt.success("提交成功")
      closeWindow()
    },
  })
}

cmjs.util.browserAlert()
</script>

<style lang="less" scoped>
.placeholder {
  margin-top: 57px;
}

.in-site-message-container {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.in-site-message {
  cursor: pointer;
  color: #FF6699;
}

.in-site-message:hover {
  color: #E84B85;
}
</style>