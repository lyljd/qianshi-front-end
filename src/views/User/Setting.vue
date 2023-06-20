<template>
  <el-card style="margin-left: -1px; margin-right: -1px;" v-if="isMe"
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
//TODO 如果设置了不公开，后端返回数据时就直接返回空，前端不需要其他ui了
import * as common from "../../common"
import { useRoute } from 'vue-router'

let route: any
let isMe = ref(false)
let openStar = ref(true)
let openCoin = ref(true)
let openLike = ref(true)
let openFan = ref(true)

onMounted(()=>{
  route = useRoute();
  isMe.value = common.isMe(parseInt(route.params.uid as string))
})
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