<template>
  <div class="db-layer-progress" :style="{ height: `${h}px`, borderRadius: `${br}px` }">
    <div class="fir-layer" :style="{ height: `${h}px`, width: `${flp}%`, borderRadius: `${br}px` }"></div>
    <div class="sec-layer" :style="{ height: `${h}px`, width: `${slp}%`, borderRadius: `${br}px` }"></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  h: number // height
  flp: number // first layer percentage
  slp: number // second layer percentage
  br: number // border radius
}>(), {
  h: 6,
  flp: 0,
  slp: 0,
  br: 0,
})
</script>

<style lang="less" scoped>
.db-layer-progress {
  position: relative;
  background-color: #EBEEF5;

  .fir-layer {
    position: absolute;
    z-index: 1;
    background-color: #CDD0D6;
    transition: width 0.25s ease;
  }

  .sec-layer {
    position: absolute;
    z-index: 2;
    background-color: #409EFF;
    transition: width 0.25s ease;
  }
}
</style>