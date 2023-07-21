<template>
  <el-menu @select="select" class="menu" mode="horizontal" :default-active="$route.path" :ellipsis="false" router="true">
    <div class="logo">
      <span v-if="icon !== ''" :class="`el-icon-${icon}`" class="iconfont icon"></span>
      <div class="title">{{ title }}</div>
    </div>
    <el-menu-item v-for="i in item" :index="i.index">{{ i.content }}</el-menu-item>
  </el-menu>

  <div class="placeholder"></div>
</template>

<script lang="ts" setup>
import { useStore } from "../store"

const store = useStore()

const data = withDefaults(defineProps<{
  title: string,
  icon: string,
  item: {
    index: string,
    content: string,
  }[],
  menuIdx: number
}>(), {
  icon: "",
  item: <any>[],
  menuIdx: -1,
})

function select(index: string) {
  if (data.menuIdx > -1) {
    store.setManegeItemIndex(data.menuIdx, index)
  }
}
</script>

<style>
.menu {
  margin-left: -20px;
  margin-right: -20px;
  margin-top: -20px;
  margin-bottom: 20px;
  height: 65px;
  border-bottom: 1px solid rgb(222, 223, 224);
  position: fixed;
  width: 100%;
  z-index: 2000;
}

.menu .logo {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.menu .logo .icon {
  font-size: 37.5px;
}

.menu .logo .title {
  display: flex;
  align-items: center;
  font-size: 30px;
  cursor: default;
}

.placeholder {
  margin-top: 65px;
}
</style>

<style>
.menu .el-menu-item:focus,
.menu .el-menu-item:hover {
  background-color: transparent !important;
}

.menu .el-menu-item {
  border-bottom: unset !important;
  margin-right: -20px !important;
  font-size: 16px;
}
</style>
