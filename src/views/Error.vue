<template>
  <div class="error-container">
    <span class="iconfont el-icon-cry ico"></span>
    <span class="code">{{ route.meta.code ? route.meta.code : 404 }}</span>
    <span class="msg">{{ route.meta.msg ? route.meta.msg : "未找到页面" }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<style lang="less" scoped>
.error-container {
  width: 100%;
  height: calc(100vh - 93px);
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.error-container .ico {
  font-size: 250px;
  margin-bottom: -20px;
}

.error-container .code {
  font-size: 100px;
}

.error-container .msg {
  font-size: 25px;
  color: #909399;
}
</style>