<template>
  <ManageTopMenuBar title="反馈" icon="feedback" :item="item.filter(i => store.mui.power >= i.power)"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "../../components/ManageTopMenuBar.vue"
import { useStore } from "../../store"

const store = useStore()
store.setManegeFeedbackItemIndex = setItemIndex

let item = reactive([
  { index: "/manage/feedback/appeal/video", content: "申诉", power: 1 },
  { index: "/manage/feedback/msg", content: "站内留言", power: 2 },
  { index: "/manage/feedback/report/video", content: "举报", power: 3 },
])

function setItemIndex(idx: number, index: string) {
  item[idx].index = index
}
</script>

<style scoped></style>