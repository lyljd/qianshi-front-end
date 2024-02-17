<template>
  <el-image :src="url" :preview-src-list="preview ? [url] : []" :fit="contain ? 'contain' : ''" hide-on-click-modal
    :lazy="lazy"
    :style="{ width: w + 'px', height: h + 'px', border: border ? '1px solid #dcdfe6' : '', borderRadius: circle ? '50%' : round ? '5px' : '', opacity: opacity }">
    <template #error>
      <div class="image-error flex-center" @click="$emit('click')" :style="{ fontSize: errorTextFontSize + 'px' }">{{
        errorText
      }}</div>
    </template>
  </el-image>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  url: string,
  w: number,
  h: number,
  preview: boolean,
  contain: boolean,
  border: boolean,
  circle: boolean,
  round: boolean,
  lazy: boolean,
  opacity: number,
  errorText: string,
  errorTextFontSize: number,
}>(), {
  preview: false,
  contain: false,
  border: false,
  circle: false,
  round: false,
  lazy: true,
  opacity: 1,
  errorText: "加载失败",
  errorTextFontSize: 14,
})
</script>

<style lang="less" scoped>
.image-error {
  width: 100%;
  height: 100%;
  white-space: pre-line;
  background-color: #909399;
  color: white;
  text-align: center;
}
</style>