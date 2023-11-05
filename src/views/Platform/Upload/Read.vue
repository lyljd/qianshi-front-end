<template>
  <el-empty description="敬请期待" />
</template>

<script setup lang="ts">
import { useStore } from "@/store"

const store = useStore()
store.setPlatformItemIndex(1, location.pathname)
</script>

<style lang="less" scoped>

</style>