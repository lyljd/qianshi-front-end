<template>
  <div class="nf-container">
    <span class="iconfont el-icon-cry ico"></span>
    <span class="code">404</span>
    <span class="msg">未找到页面</span>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.nf-container {
  width: 100%;
  height: calc(100vh - 93px);
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.nf-container .ico {
  font-size: 250px;
  margin-bottom: -20px;
}

.nf-container .code {
  font-size: 100px;
}

.nf-container .msg {
  font-size: 25px;
  color: #909399;
}
</style>