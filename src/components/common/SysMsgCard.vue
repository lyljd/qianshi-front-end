<template>
  <el-card>
    <template #header>
      <div class="smc-header">
        <div class="title">{{ data.title }}</div>
        <div class="time">{{ cmjs.fmt.tsStandard(data.time) }}</div>
      </div>
    </template>
    <div v-html="data.content" class="smc-body"></div>
  </el-card>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'

defineProps<{
  data: {
    title: string,
    content: string,
    time: number,
  }
}>()
</script>

<style lang="less" scoped>
.smc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.smc-header .title {
  font-size: 18px;
}

.smc-header .time {
  color: #909399;
  min-width: 150px;
  text-align: right;
}
</style>

<style>
.smc-body a {
  color: #409EFF;
  text-decoration: underline;
}
</style>