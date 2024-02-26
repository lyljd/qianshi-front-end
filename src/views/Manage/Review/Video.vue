<template>
  <div v-if="data.records.length > 0" class="rv-container">
    <el-card v-for="(r, idx) in data.records">
      <template #header>
        <div class="header">
          <span class="flex-center">作者：<span @click="cmjs.jump.user(r.uid)" class="nickname">{{ r.nickname
          }}</span></span>
          <span>申请时间：{{ cmjs.fmt.tsStandard(r.applyTime) }}</span>
          <div class="flex-center">
            <span>操作：{{ r.vid ? "修改" : "新发布" }}</span>
            <el-button v-blur v-if="r.vid" @click="cmjs.jump.video(r.vid)" class="to-video" type="primary">原视频</el-button>
          </div>
          <div>
            <el-button v-blur @click="pass(idx)" type="success">通过</el-button>
            <el-button v-blur @click="deny(idx)" type="danger">驳回</el-button>
          </div>
        </div>
      </template>

      <div class="body">
        <VideoDescriptions class="vd" v-if="r.infoOld" title="原信息" :data="r.infoOld"></VideoDescriptions>

        <VideoDescriptions :class="r.infoOld ? 'vd' : 'vdFull'" :title="r.infoOld ? '新信息' : ''" :data="r.info">
        </VideoDescriptions>
      </div>
    </el-card>

    <el-pagination :total="data.total" v-model:current-page="curPage" :default-page-size="5" class="flex-center"
      hide-on-single-page background layout="prev, pager, next" />
  </div>
  <el-empty v-else description="暂无待处理的视频"></el-empty>
</template>

<script setup lang="ts">
import Data from "@/mock/manage/review/video.json"
import cmjs from '@/cmjs'
import VideoDescriptions from "@/components/util/VideoDescriptions.vue"
import { ElMessageBox } from 'element-plus'
import { useStore } from "@/store"

type Video = {
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
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

let curPage = ref(1)
let data = ref<Data>(getData())

watch(curPage, newVal => {
  data.value = getData()
})

function getData(): Data {
  // TODO api
  console.log("获取第" + curPage.value + "页的数据")

  return Data
}

function pass(formIdx: number) {
  //TODO api
  console.log(data.value.records[formIdx].id)

  data.value.records.splice(formIdx, 1)
  data.value.total--
  cmjs.prompt.success("已通过")
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
      //TODO api
      console.log(data.value.records[formIdx].id)
      console.log("理由：" + value)

      data.value.records.splice(formIdx, 1)
      data.value.total--
      cmjs.prompt.success("已驳回")
    })
    .catch(() => { })
}
</script>

<style lang="less" scoped>
.rv-container {
  cursor: default;
}

.rv-container>.el-card:not(:last-child) {
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