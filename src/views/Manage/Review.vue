<template>
  <ManageTopMenuBar title="审批" icon="review" :item="item.filter(i => store.power >= i.power)"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "@/components/util/ManageTopMenuBar.vue"
import { useStore } from "@/store"

const store = useStore()

let item = reactive([
  { index: "/manage/review/video", content: "视频", power: 1 },
  { index: "/manage/review/read", content: "专栏", power: 1 },
  { index: "/manage/review/avatar", content: "头像", power: 1 },
  { index: "/manage/review/title", content: "个人认证", power: 2 },
])
</script>

<style lang="less" scoped></style>