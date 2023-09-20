<template>
  <el-empty description="敬请期待"></el-empty>
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(0, location.pathname)
</script>

<style scoped>

</style>