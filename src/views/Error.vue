<template>
  <div class="error-container">
    <span class="iconfont el-icon-cry ico"></span>
    <span class="code">{{ route.meta.code ? route.meta.code : code }}</span>
    <span class="msg">{{ route.meta.msg ? route.meta.msg : msg }}</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useStore } from '@/store'

const route = useRoute()
const store = useStore()

const code = store.errCode
const msg = store.errMsg

store.errCode = 404
store.errMsg = "未找到页面"
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

  .ico {
    font-size: 250px;
    margin-bottom: -20px;
  }

  .code {
    font-size: 100px;
  }

  .msg {
    font-size: 25px;
    color: #909399;
  }
}
</style>