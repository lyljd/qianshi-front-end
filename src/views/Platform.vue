<template>
  <el-container class="container">
    <el-aside width="150px">
      <el-menu :default-active=$route.path router="true">
        <div class="page-title">创作中心</div>

        <el-menu-item v-for="i in item" :index="i.index">
          <span :class="`el-icon-${i.icon}`" class="iconfont"></span>
          <span class="span">{{ i.content }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>{{ curTitle }}</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useStore } from "../store"

let item = ref([
  { index: "/platform", content: "首页", icon: "home" },
  { index: "/platform/upload/video", content: "投稿", icon: "upload" },
  { index: "/platform/article/video", content: "稿件管理", icon: "article" },
])

const store = useStore()
store.setPlatformCurTitle = setCurTitle
store.setPlatformItemIndex = setItemIndex

let curTitle = ref("")

function setItemIndex(idx: number, index: string) {
  item.value[idx].index = index
  console.log(idx, index, item)
}

function setCurTitle(title: string) {
  curTitle.value = title
}
</script>

<style scoped>
.container {
  width: 1140px;
  margin-inline: auto;
  margin-top: 77px;
  margin-bottom: 20px;
  border: 1px solid #dedfe0;
  border-radius: 10px;
}

.container .el-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dedfe0;
  color: #409EFF;
}

.container .page-title {
  height: 59px;
  border-bottom: 1px solid #dedfe0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container .el-menu {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.container .el-menu .el-menu-item {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dedfe0;
}

.container .el-menu .el-menu-item:last-child {
  /* border-bottom: none; */
  border-bottom-left-radius: 10px;
}

.container .el-menu .el-menu-item .span {
  margin-left: 5px;
}
</style>