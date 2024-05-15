<template>
  <div v-if="tags" class="vt-container">
    <div id="tag-row" class="tag-row">
      <el-tag class="tag" v-for="(tag) in tags" type="info" round>{{ tag }}</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>

<style lang="less" scoped>
.vt-container .tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.vt-container .tag-row .tag {
  font-size: 14px;
}
</style>