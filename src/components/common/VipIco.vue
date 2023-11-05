<template>
  <span @click="cmjs.jump.new('/vip')" class="vip-ico">会员</span>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
</script>

<style lang="less" scoped>
.vip-ico {
  background-color: #FF6699;
  color: white;
  font-size: 12px;
  line-height: 12px;
  padding: 1px;
  border-radius: 3px;
  cursor: pointer;
}
</style>