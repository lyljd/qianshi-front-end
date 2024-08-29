<template>
  <el-empty description="暂无专栏"></el-empty>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(2, location.pathname)
</script>

<style lang="less" scoped>

</style>