<template>
  <div v-show="loading" v-loading="loading" style="height: calc(100% - 64px);" element-loading-text="加载中"></div>
  <div v-show="!loading">
    <div v-if="data.records.length > 0" class="rv-container">
      <div v-for="(r, idx) in data.records" class="r-item">
        <div v-if="timestamp - r.applyTime <= 300" class="tip" style="margin-top: 0; margin-bottom: 3px;">
          <span style="color: red;">除非绝对信任该作者，否则请在申请时间过5分钟后再处理本条申请</span>
        </div>
        <el-card>
          <template #header>
            <div class="header">
              <span class="flex-center">作者：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
                  }}</span></span>
              <span>申请时间：{{ cmjs.fmt.tsStandard(r.applyTime) }}</span>
              <div class="flex-center">
                <span>操作：{{ r.vid ? "修改" : "新发布" }}</span>
                <el-button v-blur v-if="r.vid" @click="cmjs.jump.video(r.vid)" class="to-video"
                  type="primary">原视频</el-button>
              </div>
              <div>
                <el-button :disabled="passing.includes(r.id) || denying.includes(r.id)"
                  v-loading="passing.includes(r.id)" v-blur @click="pass(idx)" type="success">通过</el-button>
                <el-button :disabled="passing.includes(r.id) || denying.includes(r.id)"
                  v-loading="denying.includes(r.id)" v-blur @click="deny(idx)" type="danger">驳回</el-button>
              </div>
            </div>
          </template>

          <div class="body">
            <VideoDescriptions class="vd" v-if="r.infoOld" title="原信息" :data="r.infoOld"></VideoDescriptions>

            <VideoDescriptions :class="r.infoOld ? 'vd' : 'vdFull'" :title="r.infoOld ? '新信息' : ''" :data="r.info">
            </VideoDescriptions>
          </div>
        </el-card>
      </div>

      <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5"
        :disabled="passing.length > 0 || denying.length > 0" class="flex-center" hide-on-single-page background
        layout="prev, pager, next" />
    </div>
    <el-empty v-else description="暂无待处理的视频"></el-empty>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import VideoDescriptions from "@/components/util/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"
import * as API from '@/api/manage'

type Video = {
  videoUrl: string,
  coverUrl: string,
  title: string,
  regionName: string,
  regionSlug: string,
  tags: string[],
  intro: string,
  empower: boolean
}

type Record = {
  id: number,
  vid?: number,
  uid: number,
  nickname: string,
  applyTime: number,
  infoOld?: Video,
  info: Video
}

type Data = {
  total: number,
  records: Record[]
}

const store = useStore()
store.setManegeItemIndex(1, location.pathname)

const timestamp = cmjs.util.getCurBETimestamp()

let loading = ref(false)
let passing = ref<number[]>([])
let denying = ref<number[]>([])

let curPage = ref(1)
let data = ref<Data>({ total: 0, records: [] })
setData()


watch(curPage, newVal => {
  setData()
})

function setData() {
  loading.value = true
  API.getReviewVideos(timestamp, curPage.value)
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
      API.operReviewVideo(id, "pass")
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
  ElMessageBox.prompt('请输入驳回理由（可为空）', '视频审批', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      const id = data.value.records[formIdx].id
      denying.value.push(id)
      API.operReviewVideo(id, "deny", value)
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
.rv-container {
  cursor: default;
}

.rv-container>.r-item:not(:last-child) {
  margin-bottom: 20px;
}

.rv-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rv-container .header .nickname {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
  max-width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rv-container .header .to-video {
  margin-left: 5px;
}

.rv-container .body {
  display: flex;
  gap: 10px;
}

.rv-container .body .vd {
  width: 50%;
}

.rv-container .body .vdFull {
  width: 100%;
}
</style>