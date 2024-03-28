<template>
  <span @click.stop="cmjs.jump.new('/vip')" class="vip-pri-ico" :style="{ fontSize: `${fs}px`, lineHeight: `${fs}px` }">会员专享</span>
</template>

<script setup lang="ts">
// Vip privilege Icon
import cmjs from '@/cmjs'

defineProps<{
  fs: number,
}>()
</script>

<style lang="less" scoped>
.vip-pri-ico {
  background-color: #FF6699;
  color: white;
  padding: 1px;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
  pointer-events: auto;
}
</style>