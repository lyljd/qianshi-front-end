<template>
  <ManageTopMenuBar title="反馈" icon="feedback" :item="item" :menuIdx="2"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "../../components/ManageTopMenuBar.vue"
import { useStore } from "../../store"

const store = useStore()
store.setManegeFeedbackItemIndex = setItemIndex

let item = reactive([
  { index: "/manage/feedback/msg", content: "站内留言" },
  { index: "/manage/feedback/appeal/video", content: "申诉" },
  { index: "/manage/feedback/report/video", content: "举报" },
])
if (store.feedbackItemIndexPreSetValue !== '') {
  item[store.feedbackItemIndexPreSetIdx].index = store.feedbackItemIndexPreSetValue
  store.feedbackItemIndexPreSetIdx = 0
  store.feedbackItemIndexPreSetValue = ''
}

function setItemIndex(idx: number, index: string) {
  item[idx].index = index
}
</script>

<style scoped></style>