<template>
  <ManageTopMenuBar title="权限" icon="key" :item="item"></ManageTopMenuBar>

  <RouterView></RouterView>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "@/components/util/ManageTopMenuBar.vue"

let item = reactive([
  { index: "/manage/power", content: "全部用户" },
  { index: "/manage/power/admin", content: "仅带有权限的用户" },
  { index: "/manage/power/table", content: "权限表一览" },
])
</script>

<style scoped></style>