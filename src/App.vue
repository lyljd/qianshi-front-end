<template>
  <div v-if="common.isMobile()">
    <TopMenuBar></TopMenuBar>
    <div v-if="$route.path !== '/'" class="placeholder"></div>
    <router-view id="rv"></router-view>
  </div>
  <div v-else>
    目前未做移动端适配，请用pc端访问
  </div>
</template>

<script setup lang="ts">
import TopMenuBar from "./components/TopMenuBar.vue"
import * as common from "./common"
</script>

<style scoped>
.placeholder {
  margin-top: 57px;
}
</style>