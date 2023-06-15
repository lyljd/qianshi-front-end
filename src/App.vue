<template>
  <div v-if="common.isMobile()">
    <TopMenuBar></TopMenuBar>
    <div v-if="$route.path !== '/'" class="placeholder"></div>
    <router-view></router-view>
    <div @click="inSiteMessage" class="in-site-message">站内留言</div>
  </div>
  <div v-else>
    目前未做移动端适配，请用pc端访问
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from "./components/TopMenuBar.vue"
import * as common from "./common"

function inSiteMessage() {
  alert("敬请期待")
}
</script>

<style scoped>
.placeholder {
  margin-top: 57px;
}

.in-site-message {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #FF6699;
  cursor: pointer;
}
</style>