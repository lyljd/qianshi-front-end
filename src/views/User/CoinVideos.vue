<template>
  <el-card :header="`${who}投币的视频`">
    <el-empty :description="`${who}还没有投币的视频哦～`" />
  </el-card>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useRoute } from "vue-router"

const route = useRoute()

const queryId = ref(parseInt(route.params.uid as string))
let myId = ref(cmjs.biz.getUid())
let who = ref(myId.value === queryId.value ? '我' : 'Ta')
</script>

<style lang="less" scoped></style>