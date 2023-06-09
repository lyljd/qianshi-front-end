<template>
  <div class="container">
    <span class="iconfont el-icon-cry ico"></span>
    <span class="code">404</span>
    <span class="msg">未找到页面</span>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 57px);
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

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
</style>