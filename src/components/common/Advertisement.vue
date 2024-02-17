<template>
  <a class="adv" :href="data.linkUrl !== '' ? data.linkUrl : undefined" target="_blank">
    <Image v-if="data.type === 'image'" :url="data.content" round errorText="广告加载失败" :errorTextFontSize="18"
      style="width: 100%; height: 100%;"></Image>

    <div v-if="data.type === 'text'"
      :style="{ 'background-color': (data.content as Text).bgColor, 'color': (data.content as Text).fontColor, 'fontSize': `${(data.content as Text).fontSize}px` }"
      class="text">
      {{ (data.content as Text).text }}
    </div>

    <span class="notice">广告</span>
  </a>
</template>

<script setup lang="ts">
type Advertisement = {
  type: string,
  content: string | Text,
  linkUrl: string,
}

type Text = {
  text: string,
  fontSize: number,
  fontColor: string,
  bgColor: string,
}

defineProps<{
  data: Advertisement
}>()
</script>

<style lang="less" scoped>
.adv {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;

  .notice {
    position: absolute;
    font-size: 14px;
    color: #303133;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 2.5px;
    width: 32px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 10px;
    top: 10px;
    pointer-events: none;
  }

  .text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 5px;
    white-space: pre-line;
    pointer-events: none;
  }
}
</style>