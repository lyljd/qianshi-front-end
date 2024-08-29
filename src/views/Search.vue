<template>
  <div class="search-container">
    <div class="search-box">
      <el-input @keyup.enter.native="search" v-model="keyword" placeholder="搜索" clearable>
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button @click="search" type="primary" v-blur>搜索</el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-change="search">
      <el-tab-pane v-for="t in tabs" :label="t.label" :name="t.name">
        <div v-show="loading" v-loading="loading" class="loading"></div>
        <el-empty v-show="!loading" :description="`暂无数据`" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs';

type Tab = {
  label: string
  name: string
}

const tabs: Tab[] = [
  { label: '视频', name: 'video' },
  { label: '专栏', name: 'read' },
  { label: '用户', name: 'user' },
]

let loading = ref(false)

let activeTab = ref('video')
let keyword = ref(cmjs.util.getUrlQuery('keyword') !== null ? cmjs.util.getUrlQuery('keyword') as string : '')
document.title = `${keyword.value} - 浅时`
search()

function search() {
  cmjs.util.addUrlQuery('keyword', keyword.value)
  document.title = `${keyword.value} - 浅时`
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>

<style lang="less" scoped>
.search-container {
  width: 1140px;
  margin-top: 77px;
  margin-bottom: 20px;
  margin-inline: auto;

  .search-box {
    display: flex;
    width: 50%;
    margin-inline: auto;
    margin-bottom: 20px;
  }
}

.loading {
  height: 300px;
}
</style>