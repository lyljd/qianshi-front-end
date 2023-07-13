<template>
  <div v-if="common.isMobile()">
    <el-backtop :right="50" :bottom="50" />

    <TopMenuBar></TopMenuBar>

    <div v-if="$route.path !== '/'" class="placeholder"></div>

    <router-view></router-view>

    <div class="in-site-message-container">
      <span @click="store.openFSWindow('站内留言', '#', '有什么问题都可以直接留言，管理员会在24小时内回复的～', '留言不能为空')" v-if="store.isLogin"
        class="in-site-message">站内留言</span>
    </div>

    <FeedbackSubmissionWindow></FeedbackSubmissionWindow>
  </div>

  <div v-else>
    目前未做移动端适配，请用PC端访问（推荐使用Edge浏览器）
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from "./components/TopMenuBar.vue"
import FeedbackSubmissionWindow from "./components/FeedbackSubmissionWindow.vue"
import * as common from "./common"
import { useStore } from "./store"

const store = useStore()
</script>

<style scoped>
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