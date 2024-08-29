<template>
  <div class="container" v-loading.fullscreen.lock="pageLoading" element-loading-text="加载中"
    element-loading-background="rgba(0, 0, 0, 0.7)">
    <div id="left-column" class="left">
      <div class="title"><span :title="video.title">{{ video.title }}</span></div>

      <div style="position: relative;">
        <div class="interaction-bar">
          <span :title="video.likeNum.toString()" @click="likeVideo" :class="{ highLight: video.isLike && isLogin }"
            class="iconfont el-icon-good icon"><span class="num">{{
    cmjs.fmt.numWE(video.likeNum)
  }}</span></span>

          <span :title="video.coinNum.toString()" @click="coinVideo" :class="{ highLight: video.isCoin && isLogin }"
            class="iconfont el-icon-Bbi icon"><span class="num">{{
    cmjs.fmt.numWE(video.coinNum) }}</span></span>

          <span :title="video.starNum.toString()" @click="starVideo" :class="{ highLight: video.isStar && isLogin }"
            class="iconfont el-icon-collection icon"><span class="num">{{
    cmjs.fmt.numWE(video.starNum)
  }}</span></span>

          <el-popover ref="extraPop" placement="bottom-end" @before-enter="beforeEnterExtraPop">
            <template #reference>
              <span style="font-size: 20px;" class="iconfont el-icon-diandiandianshu icon"></span>
            </template>
            <div class="extra-menu">
              <ul>
                <li @click="reportVideo"><span class="iconfont el-icon-jubao em-icon"></span>举报</li>
                <li @click="cmjs.biz.watchLater(video.vid)"><span
                    class="iconfont el-icon-shaohouzaikan em-icon"></span>稍后再看</li>
                <li v-if="store.power >= 4 && !video.vip" @click="setVipPri(video.vid, !video.vip)"><span
                    class="iconfont el-icon-vip-pri em-icon"></span>{{ video.vip ? '取消' : '设置' }}会员专享
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>

      <div class="info">
        <VipPriIco v-if="video.vip" :fs="14"></VipPriIco>

        <span class="item">
          <span class="iconfont el-icon-region icon"></span>
          <span class="region" @click="cmjs.jump.region(video.regionSlug)">{{ video.regionName }}</span>
        </span>

        <span class="item">
          <span class="iconfont el-icon-bofangshu icon"></span>
          <span :title="video.playNum.toString()">{{ cmjs.fmt.numWE(video.playNum) }}</span>
        </span>

        <span class="item">
          <span class="iconfont el-icon-danmushu icon"></span>
          <span :title="video.danmu.length.toString()">{{ cmjs.fmt.numWE(video.danmu.length) }}</span>
        </span>

        <span v-if="video.date && video.firstPublishAt" class="item">
          <span class="iconfont el-icon-lishijilu icon"></span>
          <span
            :title="video.date === video.firstPublishAt ? '' : `首次发布时间：${cmjs.fmt.tsStandard(video.firstPublishAt)}`"
            :style="{ cursor: video.date === video.firstPublishAt ? 'default' : 'alias' }">{{
    cmjs.fmt.tsStandard(video.date)
  }}</span>
        </span>

        <span v-if="video.empower" class="item">
          <svg class="icon-symbol" aria-hidden="true">
            <use xlink:href="#el-icon-jinzhi"></use>
          </svg>
          <span>未经作者授权，禁止转载</span>
        </span>

        <span v-if="video.ipLocation" class="item">
          <span class="iconfont el-icon-ip icon"></span>
          <span>{{ video.ipLocation }}</span>
        </span>
      </div>

      <Video :vid="video.vid" :video="video.video" :collection="video.collection ? video.collection.videos : undefined"
        :danmus="video.danmu" :isUp="isUp" :nextVid="nextVid" :vip="video.vip"
        @delete-danmu="(f: Function) => { delDm = f }" @recall-danmu="(f: Function) => { recDm = f }"></Video>

      <el-card v-show="video.intro || video.tags" class="intro-tag-container">
        <textarea id="intro-textarea" class="introduction" rows="1" readonly>{{ video.intro || "-" }}</textarea>
        <div v-show="!moreStatus && isMore" class="more-container"><span @click="setIntroFull" class="more">展开更多</span>
        </div>
        <div v-show="moreStatus" class="more-container"><span @click="setIntroUnFull" class="more">收起</span></div>
        <VideoTag :tags="video.tags" style="margin-top: 20px;"></VideoTag>
      </el-card>

      <CommentArea :total="video.comments.total" :totalTop="video.comments.totalTop" :data="video.comments.data"
        :vid="video.vid" :authorUid="video.author.uid" :incrTotal="(incr: number) => { video.comments.total += incr }"
        :incrTotalTop="(incr: number) => { video.comments.totalTop += incr }" style="margin-top: 20px;"></CommentArea>
    </div>


    <div id="right-column" class="right">
      <div class="avatar-container">
        <Avatar v-model="video.author.avatarUrl" size="medium" :home="{ uid: video.author.uid }"></Avatar>

        <div class="info">
          <div class="nickname-row">
            <div :title="video.author.nickname" @click="cmjs.jump.user(video.author.uid)" class="nickname">{{
    video.author.nickname }}</div>
            <span class="iconfont el-icon-sixin send-msg">发消息</span>
          </div>

          <div class="signature"><span :title="video.author.signature">{{ video.author.signature || "-" }}</span></div>

          <el-button v-loading="focuing" :disabled="focuing" v-blur @click="focuAuthor" class="focus"
            :type="video.author.isFocu && isLogin ? 'info' : 'primary'">{{
    video.author.isFocu && isLogin ? '已关注 ' : '+ 关注 ' +
      cmjs.fmt.numWE(video.author.fanNum) }}</el-button>
        </div>
      </div>

      <div @click="showDanmuList = !showDanmuList; dmCtl.show = false" class="danmu-list-span">
        <span>弹幕列表</span>

        <el-icon v-show="!showDanmuList">
          <ArrowDown />
        </el-icon>
        <el-icon v-show="showDanmuList">
          <ArrowUp />
        </el-icon>
      </div>

      <div id="dm-ctl" v-show="dmCtl.show" @mouseenter="dmCtlHoverStatus = true" @mouseleave="dmCtlHoverStatus = false">
        <el-button v-blur @click="reportDanmu(dmCtl.d.id)" v-show="!isLogin || !dmCtl.d.isMe" type="warning"
          size="small">举报</el-button>
        <el-button v-blur @click="deleteDanmu(dmCtl.d)" v-show="dmCtl.delete && isLogin" type="danger"
          size="small">删除</el-button>
        <el-button v-blur @click="recallDanmu(dmCtl.d)" v-show="dmCtl.recall && isLogin" type="danger"
          size="small">撤回</el-button>
      </div>

      <transition name="danmu-list">
        <el-table v-if="showDanmuList" id="danmu-list" class="danmu-list" :data="video.danmu" size="small"
          empty-text="暂无弹幕" @cell-mouse-enter="danmuItemHoverEnter" @cell-mouse-leave="danmuItemHoverLeave">
          <el-table-column prop="time" label="时间" show-overflow-tooltip width="65" sortable
            :formatter="danmuTimeFormatter" />
          <el-table-column prop="content" label="弹幕内容" show-overflow-tooltip width="108" />
          <el-table-column prop="date" label="发送时间" show-overflow-tooltip width="97" sortable
            :formatter="danmuDateFormatter" />
        </el-table>
      </transition>

      <div class="gap"></div>

      <el-card v-if="video.collection" class="collection-container" shadow="never">
        <template #header>
          <div class="header">
            <span @click="cmjs.jump.collection(video.author.uid, video.collection.id)" class="name"
              :title="video.collection.name">{{
    video.collection.name }}</span>
            <div style="font-size: 13px;" class="autoStreaming">自动连播<el-switch @click="setAutoStreaming"
                v-model="autoStreaming" /></div>
          </div>
          <div class="info-row">
            <span class="collection-video-num">共{{ video.collection.videos.length }}个视频</span>
            <el-tooltip effect="light" :content="video.collection.introduction || '-'" placement="bottom">
              <span style="font-size: 13px;" class="iconfont el-icon-browse">简介</span>
            </el-tooltip>
          </div>
          <div></div>
        </template>
        <div class="collection-list">
          <ul id="collection-item-container">
            <li :id="item.vid === video.vid ? 'collectionActiveItem' : ''" v-for="item in video.collection.videos"
              @click="selectEpisode(item.vid)">
              <VipPriIco v-if="item.vip" :fs="13" style="margin-right: 10px;"></VipPriIco>
              <span :title="item.title" class="title">{{ item.title }}</span>
              <span class="duration">{{ cmjs.fmt.videoDuration(item.duration!) }}</span>
            </li>
          </ul>
        </div>
      </el-card>

      <div v-if="!video.collection && video.recommend" class="autoStreaming-row">
        <div>接下来播放</div>
        <div class="autoStreaming">自动连播<el-switch @click="setAutoStreaming" v-model="autoStreaming" /></div>
      </div>

      <div v-if="video.recommend" class="recommend">
        <VideoCard v-for="(item) in video.recommend" :data="item" type="big" class="card"
          :class="{ cardFCA: !video.collection && video.recommend.length > 1 }"></VideoCard>
      </div>
      <el-divider v-else><span style="color: #909399;">无推荐视频</span></el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoCard from '@/components/common/VideoCard.vue'
import CommentArea from "@/components/common/CommentArea.vue"
import VideoTag from "@/components/common/VideoTag.vue"
import Video from '@/components/common/Video.vue'
import Avatar from '@/components/common/Avatar.vue'
import VipPriIco from '@/components/common/VipPriIco.vue'
import cmjs from '@/cmjs'
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import { onBeforeRouteUpdate, onBeforeRouteLeave, useRoute } from "vue-router"
import { ElMessageBox, UploadUserFile } from "element-plus"
import * as UserAPI from '@/api/user'
import * as VideoAPI from '@/api/video'

type Video = {
  vid: number
  title: string
  regionName: string
  regionSlug: string
  playNum: number
  date?: number
  firstPublishAt?: number
  empower: boolean
  ipLocation: string
  likeNum: number
  coinNum: number
  starNum: number
  isLike: boolean
  isCoin: boolean
  isStar: boolean
  video: VideoQuality[]
  intro: string
  tags: string[]
  comments: {
    total: number
    totalTop: number
    data: Comment[]
  }
  author: AuthorInfo
  danmu: Danmu[]
  collection?: Collection
  recommend?: Recommend[]
  vip: boolean
}

type VideoQuality = {
  label: string,
  url: string,
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

type AuthorInfo = {
  uid: number
  avatarUrl: string
  nickname: string
  signature: string
  fanNum: number
  isFocu: boolean
}

type Danmu = {
  id: number,
  content: string,
  time: number,
  date: number,
  color: string,
  likeNum: number,
  isLike: boolean,
  isMe: boolean,
  isUp: boolean,
}

type Collection = {
  id: number
  name: string
  introduction: string
  videos: {
    vid: number
    url: string
    duration?: number
    title: string
    vip: boolean
  }[]
}

type Recommend = {
  vid: number
  videoUrl: string
  coverUrl: string
  playNum: number
  danmuNum: number
  title: string
  uid: number
  nickname: string
  date: number
  vip: boolean
}

type DanmuCtl = {
  show: boolean
  delete: boolean
  recall: boolean
  d: Danmu
}

const route = useRoute()
const store = useStore()
let { isLogin } = storeToRefs(store)
watch(() => store.isLogin, (newVal: boolean) => {
  if (newVal) {
    isUp.value = cmjs.biz.verifyLoginUid(video.value.author.uid)
  } else {
    isUp.value = false
  }
  setVideo()
})

let pageLoading = ref(false)
let focuing = ref(false)

const extraPop = ref()
let introTextarea: HTMLTextAreaElement
let collectionItemContainerEle: HTMLUListElement
let collectionActiveItemEle: HTMLLIElement
let danmuListEle: HTMLElement
let dmCtlEle: HTMLDivElement
let leftColumn: HTMLDivElement
let rightColumn: HTMLDivElement

let video = ref<Video>({ vid: 0, title: "-", regionSlug: "", regionName: "-", playNum: 0, date: 0, firstPublishAt: 0, empower: false, ipLocation: "", likeNum: 0, coinNum: 0, starNum: 0, isLike: false, isCoin: false, isStar: false, video: [], intro: "", tags: [], comments: { total: 0, totalTop: 0, data: [] }, author: { uid: 0, avatarUrl: "", nickname: "-", signature: "", fanNum: 0, isFocu: false }, danmu: [], vip: false })
let init = ref(false) // 页面是否初始化完成；在onMounted执行完毕后则初始化完成
let autoStreaming = ref(cmjs.cache.getLS("autoStreaming") !== "false" ? true : false) // 自动连播
let nextVid = ref(-1)
setVideo()
let isUp = ref(false)
let introFullHeight: string // 视频简介容器的高度
let moreStatus = ref(false) // 视频简介是否展开
let isMore = ref(false) // 视频简介是否超过设定的需展开的高度（若超过则会显示【展开更多】按钮）
let showDanmuList = ref(false) // 弹幕列表是否展开
let dmCtl = ref<DanmuCtl>({
  show: false,
  delete: false,
  recall: false,
  d: { id: -1, content: "", time: -1, date: -1, likeNum: 0, color: "", isLike: false, isMe: false, isUp: false },
})
let dmCtlHoverStatus = ref(false)
let dmItemHoverTimer: number
let delDm: Function // 从Video组件接收得来
let recDm: Function // 从Video组件接收得来

onMounted(() => {
  introTextarea = document.getElementById("intro-textarea") as HTMLTextAreaElement
  collectionItemContainerEle = document.getElementById("collection-item-container") as HTMLUListElement
  collectionActiveItemEle = document.getElementById("collectionActiveItem") as HTMLLIElement
  dmCtlEle = document.getElementById('dm-ctl') as HTMLDivElement
  leftColumn = document.getElementById('left-column') as HTMLDivElement
  rightColumn = document.getElementById('right-column') as HTMLDivElement

  window.addEventListener('scroll', () => {
    // 因为窗口的高度以及左右栏的高度随时可能发生变化，所以必须实时取值
    const viewHeight = window.innerHeight
    const leftColumnHeight = leftColumn.clientHeight
    const rightColumnHeight = rightColumn.clientHeight

    // 让左右栏某一栏滑到底时保持不动，直到另一栏也滑到底后才可继续滑动（20是离窗口底部的距离）
    if (leftColumnHeight > rightColumnHeight) {
      if (rightColumnHeight > viewHeight - 20) {
        rightColumn.style.top = `${-rightColumnHeight + viewHeight - 20}px`
      } else {
        rightColumn.style.top = '77px'
      }
    } else {
      leftColumn.style.top = `${-leftColumnHeight + viewHeight - 20}px`
    }
  })

  calcNextVid()
  setIntroArea()

  if (video.value.collection) {
    cmjs.util.scrollIntoViewInContainer(collectionActiveItemEle, collectionItemContainerEle, -5)
  }

  const cards = document.querySelectorAll('.right .card:nth-child(2)') as NodeListOf<HTMLElement>
  if (cards.length > 0) {
    if (video.value.collection) {
      cards[0].style.marginTop = '20px'
    } else {
      cards[0].style.marginTop = '40px'
    }
  }

  init.value = true
})

onBeforeRouteUpdate((to, from, next) => {
  setVideo(parseInt(to.params.vid as string))
  next()
})

onBeforeRouteLeave((to, from, next) => {
  document.title = '浅时'
  next()
})

async function setVideo(vid?: number) {
  if (!vid) {
    const v = parseInt(route.params.vid as string)
    if (isNaN(v)) {
      cmjs.jump.error(400)
      return
    }
    vid = v
  }

  pageLoading.value = true
  await VideoAPI.getVideo(vid)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.jump.error(res.code, res.msg)
        return
      }

      video.value = res.data

      if (video.value.collection) {
        video.value.collection.videos.forEach(v => {
          cmjs.util.getVideoDurationPromise(v.url)
            .then((d) => {
              v.duration = d
            })
            .catch(() => {
              v.duration = 0
            })
        })
      }

      isUp.value = cmjs.biz.verifyLoginUid(video.value.author.uid)
      calcNextVid()
      document.title = video.value.title + " - 浅时"
    })
    .catch((err) => {
      cmjs.jump.error(err.response.status, err.response.statusText)
    })
    .finally(() => {
      pageLoading.value = false
    })

  if (init.value) {
    setTimeout(() => {
      setIntroArea()
      collectionActiveItemEle = document.getElementById("collectionActiveItem") as HTMLLIElement
      if (collectionActiveItemEle) {
        cmjs.util.scrollIntoViewInContainer(collectionActiveItemEle, collectionItemContainerEle, -5)
      }
    }, 0)
  }
}

function setAutoStreaming() {
  cmjs.cache.setLS("autoStreaming", autoStreaming.value)
  if (autoStreaming.value) {
    calcNextVid()
  } else {
    nextVid.value = -1
  }
}

function danmuTimeFormatter(_: any, __: any, cellValue: number, ___: any) {
  return cmjs.fmt.videoDuration(cellValue)
}

function danmuDateFormatter(_: any, __: any, cellValue: number, ___: any) {
  return cmjs.fmt.tsYTmpl(cellValue, "MM-DD HH:mm")
}

function setIntroArea() {
  introTextarea.style.height = "unset"
  let introTextScrHeight = introTextarea.scrollHeight - 7
  introFullHeight = introTextScrHeight.toString() + "px"
  if (introTextScrHeight > 62.5) {
    isMore.value = true
    introTextarea.style.height = "62.5px"
  } else {
    isMore.value = false
    introTextarea.style.height = introFullHeight
  }
  moreStatus.value = false
}

function setIntroFull() {
  moreStatus.value = true
  introTextarea.style.height = introFullHeight
}

function setIntroUnFull() {
  moreStatus.value = false
  introTextarea.style.height = "62.5px"
}

function likeVideo() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  if (isUp.value) {
    cmjs.prompt.info("不能给自己的视频点赞")
    return
  }

  video.value.isLike = !video.value.isLike
  if (video.value.isLike) {
    video.value.likeNum++
  } else {
    video.value.likeNum--
  }
}

function coinVideo() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  if (isUp.value) {
    cmjs.prompt.info("不能给自己的视频投币")
    return
  }

  video.value.isCoin = !video.value.isCoin
  if (video.value.isCoin) {
    video.value.coinNum++
  } else {
    video.value.coinNum--
  }
}

function starVideo() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  video.value.isStar = !video.value.isStar
  if (video.value.isStar) {
    video.value.starNum++
    cmjs.prompt.success('已收藏')
  } else {
    video.value.starNum--
    cmjs.prompt.success('已取消收藏')
  }
}

function reportVideo() {
  extraPop.value.hide()

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  store.openFSWindow({
    title: "视频举报",
    placeholder: "请输入举报理由",
    submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          vid: video.value.vid,
        },
      })
      cmjs.prompt.success("提交成功")
      closeWindow()
    },
  })
}

function setVipPri(vid: number, set: boolean) {
  ElMessageBox.confirm(`你确认要${set ? '设置' : '取消'}该视频为会员专享视频吗？`, '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      VideoAPI.setVipVideo(vid, set)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          video.value.vip = true
          const vc = video.value.collection
          if (vc) {
            for (let i = 0; i < vc.videos.length; i++) {
              if (vc.videos[i].vid === video.value.vid) {
                vc.videos[i].vip = true
                break
              }
            }
          }
          cmjs.prompt.success('操作成功')
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
    })
}

function reportDanmu(did: number) {
  dmCtl.value.show = false

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  store.openFSWindow({
    title: "弹幕举报",
    placeholder: "请输入举报理由",
    submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          did: did,
        },
      })
      cmjs.prompt.success("提交成功")
      closeWindow()
    },
  })
}

function deleteDanmu(d: Danmu) {
  dmCtl.value.show = false

  delDm(d)
}

function recallDanmu(d: Danmu) {
  dmCtl.value.show = false

  recDm(d)
}

function focuAuthor() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  if (isUp.value) {
    cmjs.prompt.info("不能关注自己")
    return
  }

  const fl = video.value.author.isFocu ? UserAPI.CancelFollow : UserAPI.Follow
  focuing.value = true
  fl(video.value.author.uid)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      if (video.value.author.isFocu) {
        cmjs.prompt.success("已取关")
        video.value.author.fanNum--
        video.value.author.isFocu = false
      } else {
        cmjs.prompt.success("关注成功")
        video.value.author.fanNum++
        video.value.author.isFocu = true
      }
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      focuing.value = false
    })
}

function selectEpisode(vid: number) {
  cmjs.jump.pushVideo(vid)
}

function calcNextVid() {
  if (autoStreaming.value) {
    if (video.value.collection) {
      const vds = video.value.collection.videos
      if (vds[vds.length - 1].vid === video.value.vid) {
        nextVid.value = -1
        return
      }
      for (let i = 0; i < vds.length - 1; i++) {
        if (vds[i].vid == video.value.vid) {
          nextVid.value = vds[i + 1].vid
        }
      }
    } else if (video.value.recommend) {
      nextVid.value = video.value.recommend[0].vid
    }
  }
}

function danmuItemHoverEnter(d: Danmu, _: any, e: HTMLElement, __: any) {
  clearTimeout(dmItemHoverTimer)
  danmuListEle = document.getElementById('danmu-list') as HTMLElement // 必须每次重新获取
  dmCtlEle.style.top = `${danmuListEle.offsetTop + 32 + e.offsetTop + 3}px`
  dmCtl.value.show = true
  dmCtl.value.delete = isUp && !d.isMe
  dmCtl.value.recall = d.isMe
  dmCtl.value.d = d
}

function danmuItemHoverLeave() {
  dmItemHoverTimer = setTimeout(() => {
    if (dmCtlHoverStatus.value) {
      dmCtlHoverStatus.value = false
      return
    }
    dmCtl.value.show = false
  }, 0)
}

async function beforeEnterExtraPop() {
  if (store.isLogin && store.power === -1) {
    await getPower() // 同步阻塞
  }
}

async function getPower() {
  await UserAPI.mePower()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取我的权限失败")
        store.power = 0
        return
      }

      store.power = res.data.power
    })
    .catch((err) => {
      cmjs.prompt.error(err)
      store.power = 0
    })
}
</script>

<style lang="less" scoped>
.container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 77px;
  margin-bottom: 20px;

  .left {
    width: 850px;
    height: 100%;
    position: sticky; // 滑到底时保持不动的关键

    .title {
      font-size: 25px;
      margin-bottom: 10px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .info {
      font-size: 14px;
      margin-bottom: 20px;

      .icon {
        font-size: 14px;
      }

      .item {
        cursor: default;

        .region:hover {
          cursor: pointer;
          color: #409EFF;
          text-decoration: underline;
        }
      }

      .item:not(:first-child) {
        margin-left: 10px;
      }
    }

    .interaction-bar {
      position: absolute;
      display: flex;
      justify-content: right;
      align-items: center;
      right: 0;

      .icon {
        font-size: 25px;
        cursor: pointer;
        margin-left: 10px;

        .num {
          font-size: 20px;
          margin-left: 5px;
        }
      }

      .icon:hover {
        color: #909399;
      }

      .highLight {
        color: #409EFF !important;
      }
    }

    .intro-tag-container {
      margin-top: 20px;

      .introduction {
        width: 100%;
        font-size: 16px;
        color: #303133;
        border: none;
        resize: none;
        overflow: hidden;
      }

      .more-container {
        margin-left: 3px;
        margin-top: 3px;

        .more {
          color: #909399;
          font-size: 14px;
          cursor: pointer;
        }

        .more:hover {
          color: #409EFF;
        }
      }

      .introduction:focus {
        outline: none;
      }
    }
  }

  .right {
    width: 270px;
    height: 100%;
    margin-left: 20px;
    position: sticky; // 滑到底时保持不动的关键

    .avatar-container {
      display: flex;
      align-items: center;

      .info {
        margin-left: 10px;
        width: 220px;

        .nickname-row {
          font-size: 16px;
          display: flex;
          align-items: center;

          .nickname {
            cursor: pointer;
            display: inline-block;
            max-width: 162px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .nickname:hover {
            color: #409EFF;
          }

          .send-msg {
            font-size: 12px;
            margin-left: 10px;
            cursor: pointer;
          }

          .send-msg:hover {
            color: #409EFF;
          }
        }

        .signature {
          font-size: 12px;
          color: #909399;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        .focus {
          width: 100%;
          height: 28.5px;
          font-size: 13.5px;
          margin-top: 3px;
        }
      }
    }

    .danmu-list-span {
      background-color: #f4f4f5;
      margin-top: 10px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 15px;
      padding-right: 15px;
      font-size: 16px;
      cursor: pointer;
    }

    #dm-ctl {
      position: absolute;
      z-index: 2;
      left: 50%;
      transform: translateX(-50%);
    }

    .danmu-list {
      height: 486px;
    }

    .danmu-list-enter-active,
    .danmu-list-leave-active {
      transition: all 0.5s ease;
    }

    .danmu-list-enter-from {
      height: 0;
    }

    .danmu-list-enter-to {
      height: 486px;
    }

    .danmu-list-leave-from {
      height: 486px;
    }

    .danmu-list-leave-to {
      height: 0;
    }

    .gap {
      margin-bottom: 20px;
    }

    .collection-container {
      background-color: #f4f4f5;
      margin-bottom: 20px;

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        margin-left: -5px;
        margin-right: -5px;
        margin-top: -15px;

        .name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 145px;
          cursor: pointer;
        }

        .name:hover {
          color: #409EFF;
        }
      }

      .info-row {
        font-size: 13px;
        color: #909399;
        margin-bottom: -10px;
        margin-left: -5px;
        margin-right: -5px;
        display: flex;
        justify-content: space-between;
        cursor: default;

        .collection-video-num {
          font-size: 13px;
        }
      }

      .collection-list {
        margin-top: -36px;
        margin-bottom: -36px;
        margin-left: -15px;
        margin-right: -15px;

        ul {
          list-style: none;
          padding: 0;
          max-height: 233.5px;
          overflow: auto;
          margin-right: -5px;

          li {
            width: 238px;
            padding: 5px 10px;
            font-size: 15px;
            margin-top: 5px;
            margin-bottom: 5px;
            display: flex;
            align-items: center;

            .title {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-right: 10px;
            }

            .duration {
              color: #909399;
              font-size: 13px;
              margin-left: auto;
            }
          }

          li:hover {
            cursor: pointer;
            background-color: white;
          }

          li:hover .title {
            color: #409EFF;
          }
        }

        ul::-webkit-scrollbar {
          width: 5px;
        }

        ul::-webkit-scrollbar-thumb {
          background-color: #666;
        }

        ul::-webkit-scrollbar-track {
          background-color: #ccc;
        }
      }
    }

    #collectionActiveItem {
      background-color: white;
      color: #409EFF;
      pointer-events: none;
    }

    .autoStreaming-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }

    .autoStreaming {
      display: flex;
      align-items: center;
      color: #909399;
      cursor: default;
      gap: 1px;
    }

    .recommend {
      .card {
        margin-bottom: 20px;
        position: relative;
      }

      .card:last-child {
        margin-bottom: 0;
      }

      .cardFCA:first-child::after {
        content: '';
        position: absolute;
        bottom: -20px;
        width: 100%;
        height: 1px;
        background-color: #dedfe0;
        cursor: default;
        pointer-events: none;
      }
    }
  }
}

.extra-menu ul {
  list-style-type: none;
  padding: 0;
  margin: -7.5px;

  li {
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:hover {
    background-color: #e9e9eb;
  }

  .em-icon {
    font-size: 25px;
    margin-right: 5px;
  }
}
</style>