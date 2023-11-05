<template>
  <div class="sc">
    <el-statistic :value="total" :value-style="{ color: '#E6A23C' }">
      <template #title>
        <span :class="`iconfont el-icon-${icon}`" style="color: #303133;">{{ title }}</span>
      </template>
    </el-statistic>
    <div class="yesterday"><span style="color: #909399;">昨日+</span> <span style="color: #67C23A;">{{ divide(yesterday)
    }}</span></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  total: number
  yesterday: number
}>()

function divide(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style lang="less" scoped>
.sc {
  background-color: #f7fcfe;
  text-align: center;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  cursor: default;

  .yesterday {
    margin-top: 4px;
    font-size: 14px;
  }
}

.sc:hover {
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
</style>