<template>
  <div class="tabs-container">
    <el-tabs v-model="viewItem" @tab-change="tabChange" class="tabs">
      <el-tab-pane label="视频" name="video"></el-tab-pane>
      <el-tab-pane label="专栏" name="read"></el-tab-pane>
    </el-tabs>
  </div>

  <div class="placeholder"></div>

  <router-view></router-view>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useStore } from "../../../store"

const router = useRouter()
const store = useStore()

let viewItem = ref(location.href.split('/').pop())

function tabChange(tbn: string) {
  router.push(tbn)

  let index = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1) + tbn
  store.setManegeFeedbackItemIndex(1, index)
  store.setManegeItemIndex(2, index)
}
</script>

<style scoped>
.tabs-container {
  position: fixed;
  width: calc(100% - 170px);
  height: 50px;
  z-index: 2000;
  background-color: white;
  margin-top: -20px;
  margin-left: -20px;
}

.tabs-container .tabs {
  margin-top: 20px;
  margin-left: 20px;
}

.placeholder {
  margin-bottom: 115px;
}
</style>

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