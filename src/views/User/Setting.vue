<template>
  <el-card style="margin-left: -1px; margin-right: -1px;" v-if="common.isMe(parseInt($route.params.uid as string))"
    header="隐私设置">
    <div class="column">
      <div class="option">
        <span>公开我投币的视频</span>
        <el-switch v-model="openCoin" />
      </div>
      <div class="option">
        <span>公开我点赞的视频</span>
        <el-switch v-model="openLike" />
      </div>
      <div class="option">
        <span>公开我的收藏</span>
        <el-switch v-model="openStar" />
      </div>
      <div class="option">
        <span>公开我的关注列表</span>
        <el-switch v-model="openFan" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import * as common from "../../common"

let openStar = ref(true)
let openCoin = ref(true)
let openLike = ref(true)
let openFan = ref(true)
</script>

<style scoped>
.column {
  width: 176px;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
</style>