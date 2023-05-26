<template>
  <el-button class="refresh">
    <span class="info"><el-icon class="icon">
        <Refresh />
      </el-icon>换一换</span>
  </el-button>
</template>

<script setup lang="ts">

</script>

<style scoped>
.refresh {
  width: 40px;
  height: 80px;
  margin-left: 1150px;
  position: absolute;
}

.refresh .info {
  writing-mode: vertical-lr;
  letter-spacing: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.refresh .info .icon {
  font-size: 18px;
  margin-bottom: 3px;
}
</style>