<template>
  <el-empty description="敬请期待" />
</template>

<script setup lang="ts">
import { useStore } from "../../store"

const store = useStore()
store.setPlatformCurTitle("申诉管理")
</script>

<style scoped>

</style>