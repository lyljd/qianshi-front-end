<template>
  <el-empty description="暂无专栏" />
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setManegeItemIndex(1, location.pathname)
</script>

<style lang="less" scoped></style>