<template>
  <div
    :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', border: border ? '1px solid #dcdfe6' : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '' }"
    class="Image-container" :class="customClass">
    <el-image :src="url" :preview-src-list="preview ? [url] : []" :fit="contain ? 'contain' : ''"
      :style="{ width: w ? `${w}px` : '', height: h ? `${h}px` : '', borderRadius: (round || circle) ? (circle ? '50%' : '5px') : '' }"
      class="img">
      <template #error>
        <div :style="{ borderRadius: round ? '5px' : '' }" class="default">加载失败</div>
      </template>
    </el-image>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  url: string,
  w: number,
  h: number,
  preview: boolean,
  contain: boolean,
  border: boolean,
  round: boolean,
  circle: boolean,
  customClass: string,
}>(), {
  w: undefined,
  h: undefined,
  preview: false,
  contain: false,
  border: false,
  round: true,
  circle: false,
  customClass: "",
})
</script>

<style scoped>
.Image-container .img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>