<template>
  <div class="v-container">
    <el-tabs @tab-change="tabChange" v-model="viewItem">
      <el-tab-pane :label="`已通过 ${listNum.pubedNum}`" name="pubed">
        <el-table :data="pubed.list" :max-height="300" border stripe>
          <el-table-column prop="coverUrl" label="封面" />
          <el-table-column prop="title" label="标题" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`进行中 ${listNum.isPubingNum}`" name="isPubing">
        <el-table :data="isPubing.list" :max-height="300" border stripe>
          <el-table-column prop="coverUrl" label="封面" />
          <el-table-column prop="title" label="标题" />
          <el-table-column :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`未通过 ${listNum.notPubedNum}`" name="notPubed">
        <el-table :data="notPubed.list" :max-height="300" border stripe>
          <el-table-column prop="coverUrl" label="封面" />
          <el-table-column prop="title" label="标题" />
          <el-table-column :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" />
          <el-table-column :formatter="tableTimeFormatter" prop="processTime" label="处理时间" />
          <el-table-column prop="reason" label="原因" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import * as common from "../../../common"

import mockListNum from "../../../mock/platform/article/video.json"
import mockPubed from "../../../mock/platform/article/video/pubed.json"
import mockIsPubing from "../../../mock/platform/article/video/is_pubing.json"
import mockNotPubed from "../../../mock/platform/article/video/not_pubed.json"

type ListNum = {
  pubedNum: number,
  isPubingNum: number,
  notPubedNum: number
}

type Pubed = {
  num: number,
  list: {
    coverUrl: string,
    title: string
  }[]
}

type IsPubing = {
  num: number,
  list: {
    coverUrl: string,
    title: string,
    applyTime: number
  }[]
}

type NotPubed = {
  num: number,
  list: {
    coverUrl: string,
    title: string,
    applyTime: number,
    processTime: number,
    reason: string
  }[]
}

let listNum: ListNum = reactive(getListNum())
let pubed: Pubed = reactive(getPubed())
let isPubing: IsPubing = reactive({
  num: 0,
  list: []
})
let notPubed: NotPubed = reactive({
  num: 0,
  list: []
})

let viewItem = ref("pubed")

function tabChange(item: string) {
  switch (item) {
    case "pubed": {
      pubed = getPubed()
      listNum.pubedNum = pubed.num
      break
    }
    case "isPubing": {
      isPubing = getIsPubing()
      listNum.isPubingNum = isPubing.num
      break
    }
    case "notPubed": {
      notPubed = getNotPubed()
      listNum.notPubedNum = notPubed.num
      break
    }
  }
}

function getListNum(): ListNum {
  return mockListNum
}

function getPubed(): Pubed {
  return mockPubed
}

function getIsPubing(): IsPubing {
  return mockIsPubing
}

function getNotPubed(): NotPubed {
  return mockNotPubed
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return common.timestampFormatterStandard(time)
}
</script>

<style scoped></style>

<style>
.el-tabs__nav-wrap::after {
  display: none;
}

.el-tabs__active-bar {
  display: none;
}

.el-tabs__item {
  height: 100%;
}

.el-tabs__item:not(:last-child) {
  border-right: 1px solid #c8c9cc;
}

.el-tabs--top {
  margin-top: 10px;
}

.el-tabs__header {
  margin-bottom: 10px;
}
</style>