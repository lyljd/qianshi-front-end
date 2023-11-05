<template>
  <el-card v-if="isMe" header="隐私设置">
    <div class="column">
      <div class="option">
        <span>公开我投币的视频</span>
        <el-switch v-model="userSetting.openCoin" />
      </div>
      <div class="option">
        <span>公开我点赞的视频</span>
        <el-switch v-model="userSetting.openLike" />
      </div>
      <div class="option">
        <span>公开我的收藏</span>
        <el-switch v-model="userSetting.openStar" />
      </div>
      <div class="option">
        <span>公开我的关注列表</span>
        <el-switch v-model="userSetting.openFan" />
      </div>
    </div>
  </el-card>
  <el-empty v-else description="无权访问" />
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useRoute } from 'vue-router'
import mockUserSetting from "@/mock/user/setting.json"
import { useStore } from '@/store'

type UserSetting = {
  openStar: boolean,
  openCoin: boolean,
  openLike: boolean,
  openFan: boolean,
}

const route = useRoute()
const store = useStore()
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = cmjs.biz.verifyLoginUid(parseInt(route.params.uid as string))
  } else {
    isMe.value = false
  }
  userSetting = reactive(getUserSetting())
})

let userSetting: UserSetting = reactive(getUserSetting())
let isMe = ref(cmjs.biz.verifyLoginUid(parseInt(route.params.uid as string)))

function getUserSetting(): UserSetting {
  if (store.isLogin) {
    //TODO api
    return mockUserSetting
  }
  return { openStar: false, openCoin: false, openLike: false, openFan: false }
}
</script>

<style lang="less" scoped>
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