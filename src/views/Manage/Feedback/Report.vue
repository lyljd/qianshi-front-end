<template>
  <el-tabs v-model="viewItem" @tab-change="(tbn: string) => { $router.push(tbn) }">
    <el-tab-pane label="视频" name="video"></el-tab-pane>
    <el-tab-pane label="专栏" name="read"></el-tab-pane>
    <el-tab-pane label="评论" name="comment"></el-tab-pane>
    <el-tab-pane label="弹幕" name="danmu"></el-tab-pane>
  </el-tabs>

  <router-view></router-view>
</template>

<script setup lang="ts">
let viewItem = ref(location.href.split('/').pop())
</script>

<style scoped></style>

<style>
.el-tabs {
  --el-tabs-header-height: unset;
}

.el-tabs__item {
  margin-bottom: 10px;
  padding: 0 10px;
  font-size: 18px;
}

.el-tabs__item.is-active {
  margin-bottom: 10px;
}
</style>