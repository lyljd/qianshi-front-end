<template>
  <div class="read-container">
    <el-affix :offset="77">
      <el-card class="left">
        <div @click="selectRegion(r.slug)" :class="{ regionItemHighlight: r.slug === region }" class="region-item"
          v-for="r in regions">{{ r.name }}
        </div>
      </el-card>
    </el-affix>

    <el-card class="middle">
      <template #header>
        <div class="sort">
          <div @click="selectSort('recommended')" :class="{ sortHighlight: sort === 'recommended' }" class="sort-item">
            推荐
          </div>
          <div @click="selectSort('newest')" :class="{ sortHighlight: sort === 'newest' }" class="sort-item">最新</div>
        </div>
      </template>

      <div v-show="!loading" v-for="(r, idx) in data">
        <div class="record" @click="cmjs.jump.read(r.id)">
          <div class="text" :style="{ width: r.cover ? 'calc(100% - 132.6px)' : '100%' }">
            <div class="title">{{ r.title }}</div>
            <div class="content">{{ r.content }}</div>
            <div class="info-row">
              <div class="info">
                <span class="nickname" @click.stop="cmjs.jump.user(r.uid)">{{ r.nickname }}</span>
                <span class="bar">｜</span>
                <div class="interaction">
                  <span class="iconfont el-icon-browse icon">{{ cmjs.fmt.numWE(r.readNum) }}</span>
                  <span class="iconfont el-icon-good icon">{{ cmjs.fmt.numWE(r.likeNum) }}</span>
                  <span class="iconfont el-icon-lishijilu icon">{{ cmjs.fmt.tsYRichTmpl(r.publishAt, 'MM-DD') }}</span>
                </div>
              </div>
              <div class="tags">
                <el-tag v-for="t in r.tags" type="info" size="small">{{ t }}</el-tag>
              </div>
            </div>
          </div>
          <Image v-if="r.cover" :url="r.cover" :w="112.6" :h="63.34" round></Image>
        </div>
        <el-divider class="divider" v-if="idx < data.length - 1"></el-divider>
      </div>
      <div class="loading" v-show="loading" v-loading="loading" element-loading-text="加载中"></div>
    </el-card>

    <el-affix :offset="77">
      <div class="right">
        <el-card>
          <div class="notice">
            <div class="tip-box">
              <b>{{ getCurTimePeriod() }}好！</b>
              <div class="tip">{{ getCurTimeSentence() }}</div>
            </div>
            <el-button type="primary" plain @click="cmjs.jump.new('/platform/upload/read')">去发帖</el-button>
          </div>
        </el-card>

        <el-card class="hots-container">
          <template #header>
            <b style="cursor: default;">热门榜</b>
          </template>

          <div class="hots">
            <div class="hot-item" v-for="(h, idx) in hots" @click="cmjs.jump.read(h.rid)">
              <b class="index" :style="{ color: getHotItemIdxColor(idx) }">{{ idx + 1 }}</b>
              <span class="title">{{ h.title }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-affix>
  </div>

  <hr>

  <DeveloperInfo></DeveloperInfo>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { useRoute } from "vue-router"
import { useStore } from '@/store'
import * as ReadAPI from '@/api/read'
import DeveloperInfo from "@/components/once/DeveloperInfo.vue"
import Data from '@/mock/read.json'

type Region = {
  name: string
  slug: string
}

type Hot = {
  title: string
  rid: number
}

type Read = {
  id: number
  publishAt: number
  uid: number
  nickname: string
  title: string
  content: string // 最多返回前100个字符再加上...
  cover?: string
  tags: string[]
  readNum: number
  likeNum: number
}

const route = useRoute()
const store = useStore()

let loading = ref(false)
let region = ref(route.params.region)
store.setReadSlug(`/read/${region.value}`)
let sort = ref("recommended")

let regions = ref<Region[]>([{ name: "综合", slug: "recommended" }])
let hots = ref<Hot[]>([])
let data = ref<Read[]>([])

onMounted(async () => {
  await setRegions()
  setHots()

  const l = document.querySelector(".left") as HTMLElement
  const nav = document.querySelector(".left .el-card__body") as HTMLElement
  const navhl = document.querySelector(".left .el-card__body .regionItemHighlight") as HTMLDivElement
  const mh = window.innerHeight - 97

  if (nav.clientHeight <= mh) {
    l.style.height = `${nav.clientHeight}px`
    l.style.overflow = 'hidden'
  } else {
    l.style.height = `${mh}px`
  }

  if (!cmjs.util.isVisible(navhl)) {
    cmjs.util.scrollIntoViewInContainer(navhl, l)
  }

  setData()
})

async function setRegions() {
  await ReadAPI.getRegions()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
      }

      regions.value.push(...res.data)
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })

  let find = false
  regions.value.forEach(r => {
    if (region.value === r.slug) {
      find = true
      return
    }
  })

  if (!find) {
    cmjs.jump.readList('recommended')
    region.value = 'recommended'
  }
}

function selectRegion(slug: string) {
  if (slug === region.value) {
    return
  }

  cmjs.jump.push(`/read/${slug}`)
  region.value = slug
  store.setReadSlug(`/read/${region.value}`)
  selectSort('recommended', true)
  setData()
}

function selectSort(sr: string, nsd?: boolean) {
  if (sr === sort.value) {
    return
  }

  sort.value = sr

  if (!nsd) {
    setData()
  }
}

function setHots() {
  hots.value = [
    { title: "用 toFixed() 四舍五入失效了？", rid: 1 },
    { title: "今天来研究一下m3u8视频", rid: 2 },
    { title: "什么是闭包？", rid: 3 },
    { title: "Vue 网页全屏", rid: 4 },
    { title: "N 个值得一看的超好用前端代码片段", rid: 5 },
  ]
}

function getCurTimePeriod(): string {
  let curHour = new Date().getHours()
  if (curHour >= 6 && curHour < 12) {
    return "早上"
  } else if (curHour >= 12 && curHour < 14) {
    return "中午"
  } else if (curHour >= 14 && curHour < 18) {
    return "下午"
  } else if (curHour >= 18 && curHour < 24) {
    return "晚上"
  } else {
    return "凌晨"
  }
}

function getCurTimeSentence(): string {
  let curHour = new Date().getHours()
  if (curHour >= 6 && curHour < 12) {
    return "一日之计在于晨。"
  } else if (curHour >= 12 && curHour < 14) {
    return "别忘了午休，保持精力充沛。"
  } else if (curHour >= 14 && curHour < 18) {
    return "记得偶尔站起来活动一下哦。"
  } else if (curHour >= 18 && curHour < 24) {
    return "无论今天过得如何，一定要开开心心的哦。"
  } else {
    return "记得好好休息哦。"
  }
}

function getHotItemIdxColor(idx: number): string {
  if (idx == 0 || idx == 1) {
    return "#F56C6C"
  }
  if (idx == 2) {
    return "#E6A23C"
  }
  return "#909399"
}

function setData() {
  // TODO api
  console.log(`请求'${region.value}'分区按'${sort.value}'排序的数据`)

  loading.value = true
  setTimeout(() => {
    data.value = Data
    loading.value = false
  }, 1000)
}
</script>

<style lang="less" scoped>
.read-container {
  display: flex;
  gap: 20px;
  margin-top: 77px;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;

  .left {
    width: auto;
    overflow: scroll;
    overflow-x: hidden;

    :deep(.el-card__body) {
      padding: 10px;
    }

    .region-item {
      cursor: pointer;
      padding: 10px;
    }

    .region-item:not(:last-child) {
      margin-bottom: 5px;
    }

    .regionItemHighlight {
      font-weight: bold;
      background-color: #ecf5ff;
      color: #409EFF;
      cursor: not-allowed;
    }

    .region-item:hover {
      background-color: #ecf5ff;
      color: #409EFF;
    }
  }

  .left::-webkit-scrollbar {
    width: 3px;
  }

  .left::-webkit-scrollbar-thumb {
    background-color: #CDD0D6;
  }

  .left::-webkit-scrollbar-track {
    background-color: #EBEEF5;
  }

  .middle {
    flex-grow: 1;
    width: 0; // 解决占据左侧分区栏以及下滑错位的问题
    height: 100%;

    :deep(.el-card__header) {
      padding-bottom: 0;
    }

    :deep(.el-card__body) {
      padding: 0;
    }

    .sort {
      display: flex;
      gap: 40px;

      .sort-item {
        color: #909399;
        cursor: pointer;
      }

      .sort-item:hover {
        color: #409EFF;
      }

      .sortHighlight {
        color: #303133;
        border-bottom: 2px solid #409EFF;
        padding-bottom: 18px;
        font-weight: bold;
      }
    }

    .record {
      display: flex;
      gap: 20px;
      cursor: pointer;
      padding: 20px;

      .text {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .title {
          font-weight: bold;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .content {
          font-size: 13px;
          color: #909399;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #909399;

          .info {
            display: flex;
            align-items: center;
            gap: 5px;

            .nickname {
              max-width: 125px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .nickname:hover {
              color: #409EFF;
            }

            .bar {
              color: #dedfe0;
            }

            .interaction {
              display: flex;
              align-items: center;
              gap: 20px;

              .icon {
                font-size: 14px;
              }
            }
          }
        }

        .tags {
          display: flex;
          gap: 5px;

          :deep(.el-tag__content) {
            max-width: 75px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .record:hover {
      background-color: #F5F7FA;
    }

    .divider {
      margin: 0 20px;
      width: calc(100% - 40px);
      border-color: #EBEDF0;
    }

    .loading {
      height: 207.68px;
      display: flex;
      align-items: center;
    }
  }

  .right {
    width: 260px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .notice {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      .tip-box {
        display: flex;
        flex-direction: column;
        gap: 10px;
        cursor: default;

        .tip {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .hots-container {
      :deep(.el-card__body) {
        padding: 15px;
      }

      .hots {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .hot-item {
          cursor: pointer;
          display: flex;
          gap: 15px;
          font-size: 14px;
          padding: 5px;

          .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .hot-item:hover {
          background-color: #F5F7FA;
        }
      }
    }
  }
}

hr {
  margin-bottom: 20px;
  background-color: #dedfe0;
  height: 1px;
  border: none;
  margin-left: 40px;
  margin-right: 40px;
}
</style>