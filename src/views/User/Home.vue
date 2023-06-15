<template>
  <div class="home-container">
    <div class="left">
      <el-card>
        <template #header>
          <div class="header">
            <span>投币的视频</span>
            <el-button>更多</el-button>
          </div>
        </template>
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>点赞的视频</span>
            <el-button>更多</el-button>
          </div>
        </template>
      </el-card>
    </div>

    <div class="right">
      <el-card>
        个人认证
      </el-card>

      <el-card header="公告">
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>个人资料</span>
            <el-button v-if="common.isMe(parseInt($route.params.uid as string))">修改资料</el-button>
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from "../../common"
</script>

<style scoped>
.home-container {
  display: flex;
}

.home-container .left {
  width: 70%;
}

.home-container .right {
  width: 30%;
}

.home-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>