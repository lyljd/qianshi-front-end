<template>
  <a class="adv" href="" target="_blank">
    <el-image class="image" src="">
      <template #error>
        <div class="default">广告位（仅供学习使用，不招租）</div>
      </template>
    </el-image>
    <span class="notice">广告</span>
  </a>
</template>

<script setup lang="ts">

</script>

<style scoped>
.adv .image {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.adv .notice {
  position: absolute;
  font-size: 14px;
  margin-left: -40px;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2.5px;
}
</style>