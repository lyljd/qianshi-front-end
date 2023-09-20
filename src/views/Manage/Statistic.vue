<template>
  <ManageTopMenuBar title="统计" icon="statistic"></ManageTopMenuBar>

  <div class="ms-container">
    <div class="tip">
      <span style="margin-top: 0;">数据截止时间：{{ cmjs.fmt.tsStandard(timestamp) }}</span>
    </div>

    <el-card>
      <Statistic title="网站总访问量" :value="data.total"></Statistic>
    </el-card>

    <el-tabs type="border-card">
      <el-tab-pane v-for="(i, idx) in data.items" :label="i.label">
        <div class="row">
          <Statistic title="总访问量" :value="i.total"
            :change="idx === 0 ? calcChange(data.items[0].total, data.items[1].total) : undefined"></Statistic>
          <div class="unique">
            <Statistic title="独立访问量" :value="i.unique.sum"
              :change="idx === 0 ? calcChange(data.items[0].unique.sum, data.items[1].unique.sum) : undefined">
            </Statistic>
            =
            <Statistic title="用户" :value="i.unique.user"
              :change="idx === 0 ? calcChange(data.items[0].unique.user, data.items[1].unique.user) : undefined">
            </Statistic>
            +
            <Statistic title="游客" :value="i.unique.guest"
              :change="idx === 0 ? calcChange(data.items[0].unique.guest, data.items[1].unique.guest) : undefined">
            </Statistic>
          </div>
        </div>

        <div class="row">
          <Statistic title="视频投稿量" :value="i.video"
            :change="idx === 0 ? calcChange(data.items[0].video, data.items[1].video) : undefined"></Statistic>
          <Statistic title="专栏投稿量" :value="i.read"
            :change="idx === 0 ? calcChange(data.items[0].read, data.items[1].read) : undefined"></Statistic>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import ManageTopMenuBar from "@/components/util/ManageTopMenuBar.vue"
import Data from "@/mock/manage/statistic.json"
import cmjs from '@/cmjs'
import Statistic from "@/components/util/Statistic.vue"

type item = {
  label: string,
  total: number,
  unique: {
    sum: number,
    user: number,
    guest: number,
  },
  video: number,
  read: number,
}

type statistic = {
  total: number,
  items: item[]
}

type change = {
  value: string,
  up: boolean,
}

const data: statistic = getData()

const timestamp = Date.now()
console.log(`statistic timestamp: ${timestamp}`)

function getData(): statistic {
  return Data
}

function calcChange(t: number, y: number): change {
  if (t === 0 && y === 0) {
    return {
      value: "0",
      up: true
    }
  }

  let value = "∞"

  if (t >= y) {
    if (y !== 0) {
      value = cmjs.util.toFixed((t / y - 1) * 100, 0)
    }
    return {
      value: value,
      up: true
    }
  }

  if (t !== 0) {
    value = cmjs.util.toFixed((y / t - 1) * 100, 0)
  }
  return {
    value: value,
    up: false
  }
}
</script>

<style scoped>
.ms-container>*:not(:last-child) {
  margin-bottom: 10px;
}

.ms-container .row {
  display: flex;
  justify-content: space-around;
}

.ms-container .row:not(:last-child) {
  margin-bottom: 20px;
}

.ms-container .row .unique {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>