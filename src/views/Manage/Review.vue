<template>
  <ManageTopMenuBar title="审批" icon="review" :item="item"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "../../components/ManageTopMenuBar.vue"

let item = reactive([
  { index: "/manage/review/video", content: "视频" },
  { index: "/manage/review/read", content: "专栏" },
  { index: "/manage/review/title", content: "个人认证" },
])
</script>

<style scoped></style>