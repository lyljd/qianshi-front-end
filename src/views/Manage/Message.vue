<template>
  <el-menu class="menu" mode="horizontal" :default-active="$route.path" :ellipsis="false" router="true">
    <div class="logo">
      <span class="iconfont el-icon-message icon"></span>
      <div class="title">消息</div>
    </div>
  </el-menu>

  <!-- <router-view></router-view> -->
  <el-button @click="store.openSMSWindow()">发送系统消息</el-button>
</template>

<script lang="ts" setup>
import { useStore } from "../../store"

const store = useStore()
</script>

<style>
.menu {
  margin-left: -20px;
  margin-right: -20px;
  margin-top: -15px;
  margin-bottom: 20px;
  height: 65px;
  border-bottom: 1px solid rgb(222, 223, 224);
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
