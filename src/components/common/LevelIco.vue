<template>
  <svg @click="cmjs.jump.new('/me')" class="icon-symbol level" aria-hidden="true">
    <use :xlink:href="'#el-icon-level_' + data.level"></use>
  </svg>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'

const data = defineProps<{
  level: number
}>()
</script>

<style lang="less" scoped>
.level {
  font-size: 27.5px;
  cursor: pointer;
}
</style>