<template>
  <ManageTopMenuBar title="审批" icon="review" :item="item" :menuIdx="1"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "../../components/ManageTopMenuBar.vue"
import { useStore } from "../../store"

const store = useStore()
store.setManegeReviewItemIndex = setItemIndex

let item = reactive([
  { index: "/manage/review/video", content: "视频" },
  { index: "/manage/review/read", content: "专栏" },
  { index: "/manage/review/title", content: "个人认证" },
])

function setItemIndex(idx: number, index: string) {
  item[idx].index = index
}
</script>

<style scoped></style>