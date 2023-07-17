<template>
  <el-menu class="menu" mode="horizontal" :default-active="$route.path" :ellipsis="false" router="true">
    <div class="logo">
      <span class="iconfont el-icon-review icon"></span>
      <div class="title">审批</div>
    </div>
    <el-menu-item index="/manage/review/video">视频</el-menu-item>
    <el-menu-item index="/manage/review/read">专栏</el-menu-item>
    <el-menu-item index="/manage/review/title">个人认证</el-menu-item>
  </el-menu>

  <router-view></router-view>
</template>

<script lang="ts" setup>
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
