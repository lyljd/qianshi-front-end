<template>
  <div v-show="loading" v-loading="loading" style="height: calc(100% - 114px);" element-loading-text="加载中"></div>
  <div v-show="!loading">
    <div v-if="data.records.length > 0" class="fav-container">
      <el-card v-for="(r, idx) in data.records">
        <template #header>
          <div class="header">
            <span class="flex-center">用户：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
                }}</span></span>
            <span>反馈时间：{{ cmjs.fmt.tsStandard(r.feedbackTime) }}</span>
            <div>
              <el-button v-blur @click="pass(idx)" type="success">通过</el-button>
              <el-button v-blur @click="deny(idx)" type="danger">驳回</el-button>
            </div>
          </div>
        </template>

        <div class="body">
          <FeedbackDescriptions :data="r.feedbackInfo" title="申诉信息"></FeedbackDescriptions>

          <VideoDescriptions style="margin-top: 20px;" :data="r.videoInfo" title="视频信息"></VideoDescriptions>
        </div>
      </el-card>

      <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
        hide-on-single-page background layout="prev, pager, next" />
    </div>
    <el-empty v-else description="暂无待处理的视频申诉"></el-empty>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import FeedbackDescriptions from "@/components/util/FeedbackDescriptions.vue"
import VideoDescriptions from "@/components/util/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"
import * as API from '@/api/manage'

type Video = {
  videoUrl: string
  coverUrl: string
  title: string
  regionName: string
  regionSlug: string
  tags: string[]
  intro: string
  empower: boolean
}

type Record = {
  id: number
  uid: number
  nickname: string
  feedbackTime: number
  feedbackInfo: {
    content: string
    imgs: string[]
  },
  videoInfo: Video
}

type Data = {
  total: number
  records: Record[]
}

let timestamp = cmjs.util.getCurBETimestamp()
let loading = ref(false)
let passing = ref<number[]>([])
let denying = ref<number[]>([])

const store = useStore()
store.setManegeItemIndex(2, location.pathname)
store.setManegeFeedbackItemIndex(0, location.pathname)

let curPage = ref(1)
let data = ref<Data>({ total: 0, records: [] })
setData()

watch(curPage, newVal => {
  setData()
})

function setData() {
  loading.value = true
  API.getAppealVideos(timestamp, curPage.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      data.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function pass(formIdx: number) {
  ElMessageBox.confirm('你确认要通过该视频吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      const id = data.value.records[formIdx].id
      passing.value.push(id)
      API.operAppealVideo(id, "pass")
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          data.value.records.splice(formIdx, 1)
          data.value.total--
          cmjs.prompt.success("已通过")
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          const idx = passing.value.indexOf(id)
          passing.value.splice(idx, 1)
        })
    })
}

function deny(formIdx: number) {
  ElMessageBox.prompt('请输入驳回理由（可为空）', '视频申诉', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      const id = data.value.records[formIdx].id
      denying.value.push(id)
      API.operAppealVideo(id, "deny", value)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          data.value.records.splice(formIdx, 1)
          data.value.total--
          cmjs.prompt.success("已驳回")
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          const idx = denying.value.indexOf(id)
          denying.value.splice(idx, 1)
        })
    })
    .catch(() => { })
}
</script>

<style lang="less" scoped>
.fav-container {
  cursor: default;
}

.fav-container>.el-card:not(:last-child) {
  margin-bottom: 20px;
}

.fav-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>