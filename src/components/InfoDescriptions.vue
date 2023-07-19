<template>
  <div class="id-container">
    <el-descriptions :title="title" :column="1" border>
      <template v-if="data.vid || data.rid" #extra>
        <el-button @click="data.vid ? common.ToVideo(data.vid as number) : common.ToRead(data.rid as number)" type="primary"
          size="small">打开{{ data.vid ? '视频' : '专栏' }}页</el-button>
      </template>

      <el-descriptions-item label="发布者">
        <span @click="common.ToUser(data.uid)" class="nickname">{{ data.nickname }}</span>
      </el-descriptions-item>

      <el-descriptions-item label="发布时间">
        {{ common.timestampFormatterStandard(data.time) }}
      </el-descriptions-item>

      <el-descriptions-item label="发布内容">
        {{ data.content }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import * as common from "../common"

type info = {
  vid?: number,
  rid?: number,
  cid: number,
  uid: number,
  nickname: string,
  time: number,
  content: string,
}

withDefaults(defineProps<{
  title: string
  data: info
}>(), {
  title: "",
})
</script>

<style>
.id-container .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}
</style>

<style>
.id-container .el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 81px !important;
}

.id-container .el-descriptions__header {
  margin-bottom: 3px;
}

.id-container .el-descriptions__title {
  align-self: flex-end;
}
</style>