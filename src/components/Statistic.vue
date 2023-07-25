<template>
  <div class="s-container">
    <el-statistic :title="title" :value="value" :value-style="{ fontSize: '25px' }" />

    <div v-if="change" class="change">
      <span style="color: #909399;">相较于昨天</span>

      <div v-if="change.up" class="incr">
        {{ change.value }}%
        <el-icon>
          <CaretTop />
        </el-icon>
      </div>

      <div v-else class="dec">
        {{ change.value }}%
        <el-icon>
          <CaretBottom />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string,
  value: number,
  change: {
    value: string,
    up: boolean,
  }
}>(), {
  change: undefined
})
</script>

<style scoped>
.s-container {
  cursor: default;
}

.s-container .change {
  font-size: 12px;
  display: flex;
  gap: 5px;
  margin-top: 3px;
  justify-content: center;
}

.s-container .change .incr {
  color: #67C23A;
  display: flex;
}

.s-container .change .dec {
  color: #F56C6C;
  display: flex;
}
</style>

<style>
.s-container .el-statistic {
  text-align: center;
}
</style>