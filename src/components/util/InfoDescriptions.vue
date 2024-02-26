<template>
  <div class="id-container">
    <el-descriptions :title="title" :column="1" border>
      <template v-if="data.vid || data.rid" #extra>
        <el-button v-blur v-if="data.cid" @click="previewComment" type="info" size="small">查看评论上下文</el-button>
        <el-button v-blur
          @click="data.vid ? cmjs.jump.video(data.vid as number, data.t) : cmjs.jump.read(data.rid as number)"
          type="primary" size="small">打开{{ data.vid ? '视频' : '专栏' }}页</el-button>
      </template>

      <el-descriptions-item label="发布者">
        <span @click="cmjs.jump.user(data.uid)" class="id-nickname">{{ data.nickname }}</span>
      </el-descriptions-item>

      <el-descriptions-item label="发布时间">
        {{ cmjs.fmt.tsStandard(data.time) }}
      </el-descriptions-item>

      <el-descriptions-item label="发布内容">
        {{ data.content }}
      </el-descriptions-item>

      <el-descriptions-item v-if="data.t !== undefined" label="视频时间">
        {{ cmjs.fmt.videoDuration(data.t) }}
      </el-descriptions-item>
    </el-descriptions>

    <el-dialog v-model="previewCommentWindowVisible" title="评论上下文" width="75%" destroy-on-close align-center>
      <CommentReadonly :data="(commentContext as Comment)"></CommentReadonly>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Data from '@/mock/manage/feedback/report/comment-context.json'
import CommentReadonly from '@/components/common/CommentReadonly.vue'

type info = {
  vid?: number,
  rid?: number,
  cid?: number,
  did?: number,
  t?: number,
  uid: number,
  nickname: string,
  time: number,
  content: string,
}

type Comment = {
  cid: number
  avatarUrl: string
  uid: number
  nickname: string
  level: number
  isVip: boolean
  isUp: boolean
  isTop: boolean
  isUpLike: boolean
  content: string
  date: number
  ipLocation: string
  likeNum: number
  isLike: boolean
  isDislike: boolean
  isChild: boolean
  parentCid: number
  to?: {
    uid: number
    nickname: string
  }
  reply?: {
    total: number
    data: Comment[]
  }
}

withDefaults(defineProps<{
  title: string
  data: info
}>(), {
  title: "",
})

let commentContext = ref<Comment>()
let previewCommentWindowVisible = ref(false)

function getCommentContext(): Comment {
  return Data
}

function previewComment() {
  commentContext.value = getCommentContext()
  previewCommentWindowVisible.value = true
}
</script>

<style>
.id-nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.id-container {
  .el-dialog {
    border-radius: 10px;
    max-height: 75%;
    overflow: scroll;
  }

  .el-dialog__header {
    margin: 0;
    padding: 20px;
    padding-bottom: 0;
  }

  .el-dialog__body {
    padding: 20px;
  }
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