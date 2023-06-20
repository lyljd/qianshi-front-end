<template>
  <el-backtop :right="50" :bottom="50" />

  <div class="container">
    <div class="left">
      <div :title="video.title" class="title">{{ video.title }}</div>

      <div class="interaction-bar">
        <span :title="video.likeNum.toString()" @click="likeVideo" :class="{ iconIsDo: video.isLike }"
          class="iconfont el-icon-good icon"><span class="num">{{
            common.numFormatterW(video.likeNum)
          }}</span></span>

        <span :title="video.coinNum.toString()" @click="coinVideo" :class="{ iconIsDo: video.isCoin }"
          class="iconfont el-icon-Bbi icon"><span class="num">{{
            common.numFormatterW(video.coinNum) }}</span></span>

        <span :title="video.starNum.toString()" @click="starVideo" :class="{ iconIsDo: video.isStar }"
          class="iconfont el-icon-collection icon"><span class="num">{{
            common.numFormatterW(video.starNum)
          }}</span></span>

        <span :title="video.shareNum.toString()" class="iconfont el-icon-fenxiang icon"><span class="num">{{
          common.numFormatterW(video.shareNum)
        }}</span></span>
      </div>

      <div class="info">
        <span class="item">
          <span class="iconfont el-icon-bofangshu icon"></span>
          <span>{{ common.numFormatterW(video.playNum) }}</span>
        </span>

        <span class="item">
          <span class="iconfont el-icon-danmushu icon"></span>
          <span>{{ common.numFormatterW(video.danmu.length) }}</span>
        </span>

        <span class="item">
          <span class="iconfont el-icon-lishijilu icon"></span>
          <span>{{ videoDateFormatter(video.date) }}</span>
        </span>

        <span v-if="video.empower">
          <svg class="icon-symbol" aria-hidden="true">
            <use xlink:href="#el-icon-jinzhi"></use>
          </svg>
          <span>未经作者授权，禁止转载</span>
        </span>
      </div>

      <div id="video-container" class="video-container">
        <div style="display: flex; width: 100%; height: 100%;">
          <video @click="playStatus ? videoEle.pause() : videoEle.play(); playStatus = !playStatus" id="video"
            :src="video.videoUrl"></video>

          <canvas @click=" playStatus ? videoEle.pause() : videoEle.play(); playStatus = !playStatus " width="1700"
            height="838" id="canvas"></canvas>
        </div>

        <div id="contextMenu" class="context-menu">
          <ul>
            <li>弹幕视频播放器 v1.0.0</li>
            <li @click=" copyVideoUrl ">复制视频地址（精准空降）</li>
            <li @click=" shortcutKeyDescriptionWindowVisible = true ">快捷键说明</li>
            <li @click=" common.ToDeveloper ">关于作者</li>
          </ul>
        </div>

        <el-dialog v-model=" shortcutKeyDescriptionWindowVisible " title="快捷键说明" :center=" true " :align-center=" true "
          :width=" 300 ">
          <el-table :data=" shortcutKeyDesc " :show-header=" false ">
            <el-table-column prop="key" label="快捷键" :align=" 'center' " />
            <el-table-column prop="desc" label="说明" :align=" 'center' " />
          </el-table>
        </el-dialog>

        <transition leaveActiveClass="animate__animated animate__fadeOut"
          enterActiveClass="animate__animated animate__fadeIn">
          <div id="vfcbar-container" v-show=" videoFuncBarShow ">
            <el-progress @click=" handleProgressClick " class="progress" :percentage=" videoHasPercentage "
              :show-text=" false " />

            <div id="function-bar" class="function-bar">
              <div class="left-bar">
                <span v-show=" !playStatus " @click=" videoEle.play(); playStatus = true "
                  class="iconfont el-icon-bofang play"></span>

                <span v-show=" playStatus " @click=" videoEle.pause(); playStatus = false "
                  class="iconfont el-icon-zanting pause"></span>

                <span style="cursor: default;">{{ videoCurrent }} / {{ videoDuration }}</span>
              </div>

              <div v-show=" fullScreenStatus " style="width: 450px; background: none;" class="danmu-bar">
                <div class="danmu-input-container">
                  <el-popover :teleported=" false " :width=" 260 " trigger="hover" placement="top">
                    <template #reference>
                      <span style="color: black; font-size: 25px;" class="iconfont el-icon-shezhi icon dmsz"></span>
                    </template>

                    <div class="dmsz-container">
                      <div class="option">
                        <div>字号</div>
                        <div>
                          <el-slider :min=" 20 " :max=" 25 " v-model=" dmSize " />
                        </div>
                      </div>

                      <div class="option">
                        <div style="margin-bottom: 5px;">颜色</div>
                        <div>
                          <el-color-picker :append-to=" videoContainer " v-model=" dmColor "
                            :predefine=" predefinedmColors " />
                        </div>
                      </div>

                      <div class="option">
                        <div style="margin-bottom: 5px; margin-top: 10px;">速度</div>
                        <div>
                          <el-radio-group v-model=" dmSpeed ">
                            <el-radio label="3" border>较慢</el-radio>
                            <el-radio label="4" border>适中</el-radio>
                            <el-radio label="5" border>较快</el-radio>
                          </el-radio-group>
                        </div>
                      </div>
                    </div>
                  </el-popover>

                  <el-input @keyup.enter.native=" sendDanmu " class="danmu-input" v-model=" danmuInput "
                    placeholder="发个友善的弹幕见证当下" />
                </div>

                <el-button @click=" sendDanmu " class="danmu-send-btn" type="primary">发送</el-button>
              </div>


              <div class="right-bar">
                <el-popover :teleported=" false " trigger="hover" placement="top">
                  <template #reference>
                    <span class="quality">{{ videoQuality }}</span>
                  </template>
                  <el-radio-group @change=" setVideoQuality " v-model=" videoQuality "
                    style="display: flex;justify-content: center; margin: 0;">
                    <el-radio-button style="margin: 0;" label="原画" />
                    <el-radio-button style="margin: 0;" label="普清" />
                  </el-radio-group>
                </el-popover>

                <el-popover :teleported=" false " trigger="hover" placement="top">
                  <template #reference>
                    <span class="speed">倍速</span>
                  </template>
                  <el-radio-group @change=" setPlaySpeed " v-model=" playSpeed ">
                    <el-radio :label=" 2 ">2.0x</el-radio>
                    <el-radio :label=" 1.5 ">1.5x</el-radio>
                    <el-radio :label=" 1.25 ">1.25x</el-radio>
                    <el-radio :label=" 1 ">1.0x</el-radio>
                    <el-radio :label=" 0.75 ">0.75x</el-radio>
                    <el-radio :label=" 0.5 ">0.5x</el-radio>
                  </el-radio-group>
                </el-popover>

                <el-popover :teleported=" false " :width=" 250 " trigger="hover" placement="top">
                  <template #reference>
                    <span v-show=" !mutedStatus " @click=" setMutedStatus " class="iconfont el-icon-yinliang icon"></span>
                  </template>
                  <div style="display:flex; justify-content:center; align-items: center; margin: 0;">
                    <span style="margin: 0;">{{ volume }}</span>
                    <div><el-slider @input=" volumeChange " style="width: 185px; margin: 0;" v-model=" volume "
                        :show-tooltip=" false " /></div>
                  </div>
                </el-popover>

                <el-tooltip content="关闭静音(m)" placement="top" effect="light" :enterable=" false ">
                  <span v-show=" mutedStatus " @click=" setMutedStatus " class="iconfont el-icon-jingyin icon"></span>
                </el-tooltip>

                <el-popover :teleported=" false " :width=" 175 " trigger="hover" placement="top">
                  <template #reference>
                    <span class="iconfont el-icon-shezhi icon"></span>
                  </template>
                  <div @click=" setAutoplay "
                    style="display:flex; justify-content:center; align-items: center; margin: 0;">
                    静音自动开播<el-switch style="margin-left: 5px;" v-model=" autoplay " /></div>
                </el-popover>

                <el-tooltip :content=" pipTip " placement="top" effect="light" :enterable=" false "
                  :append-to=" videoContainer ">
                  <span @click=" pip " class="iconfont el-icon-huazhonghua icon"></span>
                </el-tooltip>

                <el-tooltip content="进入全屏(f)" placement="top-end" effect="light" :enterable=" false ">
                  <span @click=" fullScreen " v-show=" !fullScreenStatus " class="iconfont el-icon-quanping icon"></span>
                </el-tooltip>

                <el-tooltip content="退出全屏(f)" placement="top-end" effect="light" :enterable=" false "
                  :append-to=" videoContainer ">
                  <span @click=" cancelFullScreen " v-show=" fullScreenStatus "
                    class="iconfont el-icon-quxiaoquanping icon"></span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="danmu-bar">
        <span class="watch-danmu-num">1人正在看，已装填{{ common.numFormatterW(video.danmu.length) }}条弹幕</span>
        <el-tooltip content="关闭弹幕(d)" placement="top" effect="light" :enterable=" false ">
          <span @click=" setDanmuStatus " v-show=" danmuStatus "
            class="iconfont el-icon-bofangqi-danmukai icon dmkg"></span>
        </el-tooltip>
        <el-tooltip content="开启弹幕(d)" placement="top" effect="light" :enterable=" false ">
          <span @click=" setDanmuStatus " v-show=" !danmuStatus "
            class="iconfont el-icon-bofangqi-danmuguan icon dmkg"></span>
        </el-tooltip>

        <div class="flex-grow" />

        <div class="danmu-input-container">
          <el-popover :width=" 260 " trigger="hover" placement="top">
            <template #reference>
              <span class="iconfont el-icon-shezhi icon dmsz"></span>
            </template>

            <div class="dmsz-container">
              <div class="option">
                <div>字号</div>
                <div>
                  <el-slider :min=" 20 " :max=" 25 " v-model=" dmSize " />
                </div>
              </div>

              <div class="option">
                <div style="margin-bottom: 5px;">颜色</div>
                <div>
                  <el-color-picker v-model=" dmColor " :predefine=" predefinedmColors " />
                </div>
              </div>

              <div class="option">
                <div style="margin-bottom: 5px; margin-top: 10px;">速度</div>
                <div>
                  <el-radio-group v-model=" dmSpeed ">
                    <el-radio label="3" border>较慢</el-radio>
                    <el-radio label="4" border>适中</el-radio>
                    <el-radio label="5" border>较快</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </el-popover>

          <el-input @keyup.enter.native=" sendDanmu " class="danmu-input" v-model=" danmuInput "
            placeholder="发个友善的弹幕见证当下" />
        </div>

        <el-button @click=" sendDanmu " class="danmu-send-btn" type="primary">发送</el-button>
      </div>

      <el-card class="intro-tag-container">
        <textarea id="intro-textarea" class="introduction" rows="1" readonly>{{ video.intro || "-" }}</textarea>
        <div v-show=" !moreStatus && isMore " @click=" setIntroFull " class="more">展开更多</div>
        <div v-show=" moreStatus " @click=" setIntroUnFull " class="more">收起</div>
        <div id="tag-row" class="tag-row">
          <el-tag class="tag" v-for="(tag) in video.tags" type="info" round>{{ tag }}</el-tag>
        </div>
      </el-card>

      <CommentArea :vAuthorUid=" video.author.uid " :vid=" video.vid " :data=" video.comment "></CommentArea>
    </div>



    <div class="right">
      <div class="avatar-container">
        <el-avatar @click=" common.ToUser(video.author.uid) " class="avatar" :src=" video.author.avatarUrl "
          @error=" true ">
          <img @click=" common.ToUser(video.author.uid) " src="../../public/default-avatar.png" />
        </el-avatar>

        <div class="info">
          <div class="nickname-row">
            <div :title=" video.author.nickname " @click=" common.ToUser(video.author.uid) " class="nickname">{{
              video.author.nickname }}</div>
            <span class="iconfont el-icon-sixin send-msg">发消息</span>
          </div>

          <div :title=" video.author.signature " class="signature">{{ video.author.signature || "-" }}</div>

          <el-button id="focu-btn" @click=" focuAuthor " class="focus"
            :type=" !video.author.isFocu ? 'primary' : 'info' ">{{
            focuBtnInnerText }}</el-button>
        </div>
      </div>

      <div @click=" showDanmuList = !showDanmuList " class="danmu-list-span">
        <span>弹幕列表</span>

        <el-icon v-show=" !showDanmuList ">
          <ArrowDown />
        </el-icon>
        <el-icon v-show=" showDanmuList ">
          <ArrowUp />
        </el-icon>
      </div>

      <transition name="danmu-list">
        <el-table v-show=" showDanmuList " class="danmu-list" :data=" video.danmu " max-height="483" size="small"
          empty-text="暂无弹幕">
          <el-table-column prop="time" label="时间" width="65" sortable :formatter=" danmuTimeFormatter " />
          <el-table-column prop="value" label="弹幕内容" show-overflow-tooltip width="83" />
          <el-table-column prop="date" label="发送时间" width="90" sortable :formatter=" danmuDateFormatter " />
          <el-table-column width="32" :align=" 'center' ">
            <template #default=" scope ">
              <el-popconfirm @confirm="delDanmu(scope.row.did)" hide-icon title="你确认要删除该弹幕吗?"
              confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <span v-show="isLogin" class="iconfont el-icon-ashbin danmu-del"></span>
              </template>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </transition>

      <el-card v-if=" video.collection " class="collection-container" shadow="never">
        <template #header>
          <div class="header">
            <span class="name" :title=" video.collection.name ">{{ video.collection.name }}</span>
            <div style="font-size: 13px;" class="autoStreaming">自动连播<el-switch @click=" setAutoStreaming "
                v-model=" autoStreaming " /></div>
          </div>
          <div class="info-row">
            <span class="collection-video-num">共{{ video.collection.videos.length }}个视频</span>
            <span class="collection-play-num">{{ common.numFormatterW(video.collection.playNum) }}播放</span>
            <el-tooltip effect="light" :content=" video.collection.introduction || '-' " placement="bottom">
              <span style="font-size: 13px;" class="iconfont el-icon-browse">简介</span>
            </el-tooltip>
          </div>
          <div></div>
        </template>
        <div class="collection-list">
          <ul>
            <li :class=" { collectionItemHighlight: item.vid === video.vid } "
              v-for="(item) in video.collection.videos">
              <span @click=" video.vid = item.vid " class="title">{{ item.title }}</span>
              <span class="duration">{{ common.videoTimeFormatterHMS(item.duration) }}</span>
            </li>
          </ul>
        </div>
      </el-card>

      <div class="advertisement">
        <Advertisement></Advertisement>
      </div>

      <div v-if=" !video.collection && video.recommend.length > 0 " class="autoStreaming-row">
        <div>接下来播放</div>
        <div class="autoStreaming">自动连播<el-switch @click=" setAutoStreaming " v-model=" autoStreaming " /></div>
      </div>

      <div>
        <VideoCard :class=" { cardFCA: !video.collection && video.recommend.length > 1 } " :data=" item " class="card"
          v-for="(item) in video.recommend"></VideoCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoCard from '../components/VideoCard.vue'
import Advertisement from '../components/Advertisement.vue'
import CommentArea from '../components/CommentArea.vue'
import * as common from "../common"
import mockVideo from "../mock/video.json"
import { ElMessage } from 'element-plus'
import { useStore } from "../store"
import { storeToRefs } from "pinia"

type Video = {
  vid: number,
  title: string
  playNum: number
  date: number
  empower: boolean
  likeNum: number
  coinNum: number
  starNum: number
  shareNum: number
  isLike: boolean
  isCoin: boolean
  isStar: boolean
  videoUrl: string
  intro: string
  tags: string[]
  comment: {
    num: number
    value: Comment[]
  }
  author: AuthorInfo
  danmu: Danmu[]
  collection?: Collection
  recommend: Recommend[]
}

type Comment = {
  cid: number
  uid: number
  avatarUrl: string
  nickname: string
  level: number
  isVip: boolean
  isTop: boolean
  isUp: boolean
  isUpLike: boolean
  content: string
  date: number
  likeNum: number
  isLike: boolean
  isDislike: boolean
  to?: {
    uid: number
    nickname: string
  }
  reply?: {
    num: number
    isOpen?: boolean
    value: Comment[]
  }
  height?: string
  isChild: boolean
  parentCid: number
}

type AuthorInfo = {
  uid: number
  avatarUrl: string
  nickname: string
  signature: string
  focuNum: number
  isFocu: boolean
}

type Danmu = {
  did: number
  time: number
  value: string
  date: number
  size: number
  color: string
  speed: number
  isUp: boolean
  init?: boolean
  flag?: boolean
  x?: number
  y?: number
  width?: number
  new?: boolean
}

type Collection = {
  name: string
  playNum: number
  introduction: string
  videos: {
    vid: number
    title: string
    duration: number
  }[]
}

type Recommend = {
  vid: number
  coverUrl: string
  playNum: number
  danmuNum: number
  duration: number
  title: string
  uid: number
  nickname: string
  date: number
}

let video: Video = reactive(mockVideo) //TODO
document.title = video.title + " - 浅时" //TODO

const predefinedmColors = ref([
  '#FFFFFF',
  '#909399',
  '#000000',
  '#F56C6C',
  '#E6A23C',
  '#FFFF00',
  '#67C23A',
  '#409EFF',
  '#800080',
  '#FFC0CB',
])

const shortcutKeyDesc = [
  {
    key: "Space",
    desc: '播放/暂停',
  },
  {
    key: "→",
    desc: '快进5秒',
  },
  {
    key: "←",
    desc: '快退5秒',
  },
  {
    key: "↑",
    desc: '音量增加10%',
  },
  {
    key: "↓",
    desc: '音量降低10%',
  },
  {
    key: "F",
    desc: '全屏/退出全屏',
  },
  {
    key: "D",
    desc: '开启/关闭弹幕',
  },
  {
    key: "M",
    desc: '开启/关闭静音',
  },
]

const store = useStore()
let { isLogin } = storeToRefs(store)
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = common.isMe(video.author.uid)
    init()
  } else {
    isMe.value = false
    reset()
  }
})

let videoEle: HTMLVideoElement
let videoContainer: any
let danmuSendBtns: NodeListOf<HTMLButtonElement>
let tagRow: HTMLDivElement
let introTextarea: HTMLTextAreaElement
let vfcbarContainer: HTMLDivElement
let canvas: HTMLCanvasElement
let c2d: CanvasRenderingContext2D
let contextMenu: HTMLDivElement
let focuBtn: HTMLElement

let isMe = ref(common.isMe(video.author.uid))
let danmuStatus = ref(localStorage.getItem("danmuStatus") !== "false" ? true : false)
let danmuInput = ref("")
let dmSize = ref(25)
let dmColor = ref("rgb(255, 255, 255)")
let dmSpeed = ref("4")
let showDanmuList = ref(false)
let introFullHeight: string
let moreStatus = ref(false)
let isMore = ref(false)
let playStatus = ref(false)
let fullScreenStatus = ref(false)
let videoCurrent = ref("00:00")
let videoDuration = ref("00:00")
let videoHasPercentage = ref(0)
let videoFuncBarShow = ref(true)
let vFcBarTimer: number
let vFcBarEnterStatus = ref(false)
let autoplay = ref(localStorage.getItem("autoplay") === "true" ? true : false)
let autoStreaming = ref(localStorage.getItem("autoStreaming") !== "false" ? true : false)
let mutedStatus = ref(ref(localStorage.getItem("mutedStatus") !== "true" ? false : true))
let pipTip = ref("开启画中画")
let volume = ref(localStorage.getItem("volume") === null ? 50 : parseInt(localStorage.getItem("volume") as string))
let playSpeed = ref(1)
let videoQuality = ref("原画")
let proportion = ref(1)
let shortcutKeyDescriptionWindowVisible = ref(false)
let focuBtnInnerText = ref("")

watch(video, (newVal) => {
  if (!newVal.author.isFocu) {
    focuBtnInnerText.value = "+ 关注 " + common.numFormatterW(video.author.focuNum)
  } else {
    focuBtnInnerText.value = "已关注 " + common.numFormatterW(video.author.focuNum)
  }
})

onMounted(() => {
  videoEle = document.getElementById("video") as HTMLVideoElement
  videoContainer = document.getElementById("video-container") as HTMLDivElement
  danmuSendBtns = document.querySelectorAll(".danmu-send-btn") as NodeListOf<HTMLButtonElement>
  tagRow = document.getElementById("tag-row") as HTMLDivElement
  introTextarea = document.getElementById("intro-textarea") as HTMLTextAreaElement
  vfcbarContainer = document.getElementById("vfcbar-container") as HTMLDivElement
  canvas = document.getElementById("canvas") as HTMLCanvasElement
  c2d = canvas.getContext("2d") as CanvasRenderingContext2D
  contextMenu = document.getElementById('contextMenu') as HTMLDivElement
  focuBtn = document.getElementById('focu-btn') as HTMLElement

  c2d.scale(2, 2)
  requestAnimationFrame(animation)

  videoEle.volume = volume.value / 100

  if (video.tags.length === 0) {
    tagRow.style.marginTop = "0"
  }

  let introTextScrHeight = introTextarea.scrollHeight - 7
  introFullHeight = introTextScrHeight.toString() + "px"
  if (introTextScrHeight > 62.5) {
    isMore.value = true
    introTextarea.style.height = "62.5px"
  } else {
    introTextarea.style.height = introFullHeight
  }

  const cards = document.querySelectorAll('.right .card:nth-child(2)') as NodeListOf<HTMLElement>
  if (cards.length > 0) {
    if (video.collection) {
      cards[0].style.marginTop = '20px'
    } else {
      cards[0].style.marginTop = '40px'
    }
  }

  videoEle.addEventListener('loadedmetadata', function () {
    videoDuration.value = common.videoTimeFormatterHMS(Math.floor(videoEle.duration))
    videoContainer.style.pointerEvents = "auto"
    videoEle.muted = mutedStatus.value
    if (autoplay.value) {
      videoEle.muted = true
      mutedStatus.value = true
      videoEle.click()
    }

    let t = new URLSearchParams(location.search).get("t")
    if (t !== null) {
      videoEle.currentTime = parseInt(t)
    }

    if (!danmuStatus.value) {
      canvas.style.display = "none"
    }
  })

  videoEle.addEventListener('timeupdate', function () {
    videoHasPercentage.value = videoEle.currentTime / videoEle.duration * 100
    videoCurrent.value = common.videoTimeFormatterHMS(Math.floor(videoEle.currentTime))
    if (videoCurrent.value === videoDuration.value) {
      playStatus.value = false
    }

    video.danmu.forEach(d => {
      let ct = Math.floor(videoEle.currentTime)
      /*为什么会有ct-1 === d.time，即比如在4秒的时候去显示3秒的弹幕？
      按照常理来说3秒的弹幕在3秒时就应该显示了，但因为timeupdate事件每秒触发4次，
      如果在触发第4次时暂停发弹幕，下一次就会到下一秒，但弹幕的time还是前一秒*/
      if ((ct === d.time || ct - 1 === d.time) && (d.flag === false || d.flag === undefined)) {
        d.x = canvas.width / 2
        if (d.init === undefined) {
          d.init = true
          d.y = (Math.random() * (canvas.height / 2 - d.size * 2) + d.size)
        }
        d.flag = true
      }
    })
  })

  videoEle.addEventListener('play', function () {
    videoFuncBarShow.value = false
    videoEle.style.cursor = "none"
  })

  videoEle.addEventListener('pause', function () {
    videoFuncBarShow.value = true
    videoEle.style.cursor = "default"
  })

  canvas.addEventListener('mousemove', vFcBarShow1s)

  canvas.addEventListener('contextmenu', function (event: any) {
    event.preventDefault();

    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
  })

  canvas.addEventListener('dblclick', function () {
    if (fullScreenStatus.value) {
      cancelFullScreen()
    } else {
      fullScreen()
    }
  })

  vfcbarContainer.addEventListener('mouseenter', function () {
    vFcBarEnterStatus.value = true
  })

  vfcbarContainer.addEventListener('mouseleave', function () {
    vFcBarEnterStatus.value = false
  })

  document.addEventListener('keydown', function (event) {
    const ettn = (event.target as any).tagName
    if (ettn === "INPUT" || ettn === "TEXTAREA") {
      return
    }
    switch (event.code) {
      case "ArrowLeft": {
        event.preventDefault()
        videoEle.currentTime -= 5
        vFcBarShow1s()
        break
      }
      case "ArrowRight": {
        event.preventDefault()
        videoEle.currentTime += 5
        vFcBarShow1s()
        break
      }
      case "ArrowUp": {
        event.preventDefault()
        if (volume.value > 90) {
          volume.value = 100
        } else {
          volume.value += 10
        }
        volumeChange(volume.value)
        ElMessage({
          "message": `音量：${volume.value}%`,
          "offset": 77,
          "appendTo": videoContainer,
        })
        break
      }
      case "ArrowDown": {
        event.preventDefault()
        if (volume.value < 10) {
          volume.value = 0
        } else {
          volume.value -= 10
        }
        volumeChange(volume.value)
        ElMessage({
          "message": `音量：${volume.value}%`,
          "offset": 77,
          "appendTo": videoContainer,
        })
        break
      }
      case "Space": {
        event.preventDefault()
        videoEle.click()
        break
      }
      default: {
        switch (event.key) {
          case "d": {
            let msg = "开启弹幕"
            if (danmuStatus.value) {
              msg = "关闭弹幕"
            }
            ElMessage({
              "message": msg,
              "offset": 77,
              "appendTo": videoContainer,
            })
            setDanmuStatus()
            break
          }
          case "f": {
            if (fullScreenStatus.value) {
              cancelFullScreen()
            } else {
              fullScreen()
            }
            break
          }
          case "m": {
            let msg = "静音"
            if (mutedStatus.value) {
              msg = "关闭静音"
            }
            ElMessage({
              "message": msg,
              "offset": 77,
              "appendTo": videoContainer,
            })
            setMutedStatus()
            break
          }
        }
      }
    }
  })

  document.addEventListener('fullscreenchange', handleFullscreenChange)

  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

  window.addEventListener('click', function () {
    contextMenu.style.display = 'none'
  })
})

function init() {
  //TODO request API
  //mock
  video.author.isFocu = true
  video.isCoin = true
}

function reset() {
  //TODO Re request API
  //mock
  video.author.isFocu = false
  video.isLike = false
  video.isCoin = false
  video.isStar = false
}

function animation() {
  if (playStatus.value) {
    c2d.clearRect(0, 0, canvas.width / 2, canvas.height / 2)
    draw()
  }
  requestAnimationFrame(animation)
}

function draw() {
  video.danmu.forEach(d => {
    if (d.flag) {
      c2d.font = d.size * proportion.value + "px system-ui"
      d.width = c2d.measureText(d.value).width
      c2d.fillStyle = d.color
      c2d.fillText(d.value, d.x as number, d.y as number)
      d.x = d.x as number - d.speed * proportion.value
      let newAndUpGap = 0
      if (d.new) {
        c2d.strokeStyle = d.color
        c2d.strokeRect(d.x as number, d.y as number - d.size, d.width + 8, d.size + 6.5)
        newAndUpGap = 5
      }

      if (d.isUp) {
        c2d.fillStyle = "#FF6699"
        c2d.fillText("up", d.x as number - 25 - newAndUpGap * 2, d.y as number)
        c2d.strokeStyle = "#FF6699"
        c2d.strokeRect(d.x as number - 27.5 - newAndUpGap * 2, d.y as number - d.size, 27.5 + newAndUpGap, d.size + 6.5)
      }
      if (d.x as number <= -d.width) {
        d.flag = false
      }
    }
  })
}

function handleProgressClick(event: any) {
  const progressBar = event.target;
  const progressBarRect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - progressBarRect.left;
  const clickedPercentage = (clickX / videoContainer.clientWidth) * 100;
  videoEle.currentTime = clickedPercentage * (videoEle.duration / 100)
  videoHasPercentage.value = clickedPercentage
}

function volumeChange(val: number) {
  videoEle.volume = val / 100
  localStorage.setItem("volume", val.toString())
}

function handleFullscreenChange() {
  let doc: any = document //解决document.webkitFullscreenElement报错
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    fullScreenStatus.value = true
    canvas.style.width = "100%"
    canvas.style.height = "calc(100% - 59px)"
    canvas.width = parseFloat(window.getComputedStyle(canvas).width) * 2
    canvas.height = parseFloat(window.getComputedStyle(canvas).height) * 2
    c2d.scale(2, 2)
    // proportion.value = 1.25
    video.danmu.forEach(d => {
      if (d.flag === true) {
        d.x = d.x as number * (canvas.width / 850) / 2
        d.y = d.y as number * (canvas.height / 419) / 2
      }
    })
  } else {
    fullScreenStatus.value = false
    video.danmu.forEach(d => {
      if (d.flag === true) {
        d.x = d.x as number / (canvas.width / 850) * 2
        d.y = d.y as number / (canvas.height / 419) * 2
      }
    })
    canvas.width = 1700
    canvas.height = 838
    canvas.style.width = "850px"
    canvas.style.height = "419px"
    c2d.scale(2, 2)
    // proportion.value = 1
  }
}

function vFcBarShow1s() {
  if (playStatus.value) {
    clearTimeout(vFcBarTimer)

    videoFuncBarShow.value = true

    videoEle.style.cursor = "default"

    vFcBarTimer = setTimeout(() => {
      if (playStatus.value && !vFcBarEnterStatus.value) {
        videoFuncBarShow.value = false;
        videoEle.style.cursor = "none"
      }
    }, 1000)
  }
}

function setAutoplay() {
  localStorage.setItem("autoplay", autoplay.value ? "true" : "false")
}

function setAutoStreaming() {
  localStorage.setItem("autoStreaming", autoStreaming.value ? "true" : "false")
}

function setDanmuStatus() {
  danmuStatus.value = !danmuStatus.value
  localStorage.setItem("danmuStatus", danmuStatus.value ? "true" : "false")
  if (danmuStatus.value) {
    canvas.style.display = "inline"
  } else {
    canvas.style.display = "none"
  }
}

function setMutedStatus() {
  mutedStatus.value = !mutedStatus.value
  videoEle.muted = !videoEle.muted
  localStorage.setItem("mutedStatus", mutedStatus.value ? "true" : "false")
}

function setPlaySpeed(value: number) {
  videoEle.playbackRate = value
}

function setVideoQuality(value: string) {
  if (value === "原画") {
    console.log("切换画质至：原画")
  } else {
    console.log("切换画质至：普清")
  }
}

function pip() {
  if (document.pictureInPictureElement === videoEle) {
    document.exitPictureInPicture()
    pipTip.value = "开启画中画"
  } else {
    videoEle.requestPictureInPicture()
    pipTip.value = "退出画中画"
  }
}

function fullScreen() {
  if (document.pictureInPictureElement === videoEle) {
    document.exitPictureInPicture()
    pipTip.value = "开启画中画"
  }
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen()
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen()
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen()
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen()
  } else if (videoContainer.webkitEnterFullscreen) {
    videoContainer.webkitEnterFullscreen()
  }
}

function cancelFullScreen() {
  let doc: any = document
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
}

function sendDanmu() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (danmuSendBtns[0].disabled || danmuInput.value.trim().length === 0) {
    return
  }
  danmuSendBtns.forEach((ele) => {
    common.btnCD(ele, 5000)
  })
  //TODO 这里did应该从后端返回的值取得
  video.danmu.push({
    did: video.danmu[video.danmu.length - 1].did + 1,
    time: Math.floor(videoEle.currentTime),
    value: danmuInput.value,
    date: Date.now(),
    size: dmSize.value,
    color: dmColor.value,
    speed: parseInt(dmSpeed.value),
    new: true,
    isUp: isMe.value
  })
  danmuInput.value = ""
}

function delDanmu(did: number) {
  //TODO did === 2应该换成请求api后失败；弹幕可以由发送人和up删除
  // 为了保护弹幕发送人的隐私，后端不会传发送人的信息过来，也就是说如果有删除弹幕的请求，就必须直达后端，前端不会做拦截
  if (did === 2) {
    ElMessage({
      "message": "删除失败，此弹幕不属于你！",
      "offset": 77,
      "type": "error",
    })
    return
  }
  video.danmu.forEach((danmu, index) => {
    if (danmu.did === did) {
      video.danmu.splice(index, 1)
    }
  })
  ElMessage({
    "message": "删除成功",
    "offset": 77,
    "type": "success",
  })
}

function videoDateFormatter(date: number) {
  let fd = common.timestampFormatter(date)

  let mons = fd.month < 10 ? "0" + fd.month.toString() : fd.month.toString()
  let ds = fd.day < 10 ? "0" + fd.day.toString() : fd.day.toString()
  let hs = fd.hour < 10 ? "0" + fd.hour.toString() : fd.hour.toString()
  let mins = fd.minute < 10 ? "0" + fd.minute.toString() : fd.minute.toString()
  let ss = fd.second < 10 ? "0" + fd.second.toString() : fd.second.toString()

  return fd.year + "-" + mons + "-" + ds + " " + hs + ":" + mins + ":" + ss
}

function danmuTimeFormatter(_: any, __: any, cellValue: number, ___: any) {
  return common.videoTimeFormatterHMS(cellValue)
}

function danmuDateFormatter(_: any, __: any, cellValue: number, ___: any) {
  let date = common.timestampFormatter(cellValue)

  let mons = date.month < 10 ? "0" + date.month.toString() : date.month.toString()
  let ds = date.day < 10 ? "0" + date.day.toString() : date.day.toString()
  let hs = date.hour < 10 ? "0" + date.hour.toString() : date.hour.toString()
  let mins = date.minute < 10 ? "0" + date.minute.toString() : date.minute.toString()

  return mons + "-" + ds + " " + hs + ":" + mins
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
    openLoginWindow()
    return
  }
  if (isMe.value) {
    ElMessage({
      "message": "不能给自己的视频点赞",
      "offset": 77,
    })
    return
  }
  video.isLike = !video.isLike
}

function coinVideo() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (isMe.value) {
    ElMessage({
      "message": "不能给自己的视频投币",
      "offset": 77,
    })
    return
  }
  video.isCoin = !video.isCoin
}

function starVideo() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  video.isStar = !video.isStar
}

function copyVideoUrl() {
  navigator.clipboard.writeText(location.href + "?t=" + videoEle.currentTime.toString())
  ElMessage({
    "message": "已复制到剪贴板",
    "offset": 77,
    "appendTo": videoContainer,
  })
}

function focuAuthor() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (isMe.value) {
    ElMessage({
      "message": "不能关注自己",
      "offset": 77,
    })
    return
  }
  video.author.isFocu = !video.author.isFocu
  focuBtn.blur()
}

function openLoginWindow() {
  ElMessage({
    "message": "请登录后再操作",
    "offset": 77,
    "customClass": "zIndex999",
  })
  store.openLoginWindow()
}
</script>

<style scoped>
.container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 77px;
  margin-bottom: 20px;
}

.left {
  width: 850px;
}

.right {
  width: 270px;
  margin-left: 20px;
}

.left .title {
  font-size: 25px;
  margin-bottom: 10px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.left .info,
.left .info .icon {
  font-size: 14px;
}

.left .info .item {
  margin-right: 10px;
}

.left .info {
  margin-bottom: 20px;
}

.interaction-bar {
  position: absolute;
  width: 850px;
  text-align: right;
}

.interaction-bar .icon {
  font-size: 25px;
  cursor: pointer;
  margin-left: 20px;
}

.interaction-bar .iconIsDo {
  color: #409EFF;
}

.interaction-bar .icon:hover {
  font-size: 25px;
  color: #409EFF;
}

.interaction-bar .icon .num {
  font-size: 20px;
  margin-left: 5px;
}

.video-container {
  width: 100%;
  height: 478.125px;
  pointer-events: none;
}

.video-container .progress {
  margin-top: 10px;
  cursor: pointer;
  margin-top: -59px;
  margin-left: 1px;
  margin-right: 1px;
}

.video-container #video {
  width: 100%;
  height: 100%;
  background-color: black;
}

.video-container #canvas {
  position: absolute;
  width: 850px;
  height: 419px;
  /* 478-50-6-3 */
}

.video-container .context-menu {
  display: none;
  position: absolute;
  background: rgba(0, 0, 0, 0.25);
  color: white;
  font-size: 14px;
  z-index: 99999;
}

.video-container .context-menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.video-container .context-menu ul li {
  padding: 10px;
  border-bottom: 1px solid #909399;
  cursor: pointer;
}

.video-container .context-menu ul li:first-child {
  cursor: default;
}

.video-container .context-menu ul li:last-child {
  border-bottom: none;
}

.video-container .context-menu ul li:hover {
  background: rgba(0, 0, 0, 0.33);
}

.video-container .function-bar {
  width: calc(100% - 32px);
  height: 50px;
  margin-left: 1px;
  color: white;
  background: rgba(0, 0, 0, 0.25);
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.video-container .function-bar .left-bar,
.video-container .function-bar .right-bar {
  display: flex;
  align-items: center;
}

.video-container .function-bar .left-bar * {
  margin-right: 15px;
}

.video-container .function-bar .right-bar * {
  margin-left: 15px;
}

.video-container .function-bar .icon {
  font-size: 20px;
}

.video-container .function-bar .icon:hover,
.video-container .function-bar .play:hover,
.video-container .function-bar .pause:hover,
.video-container .function-bar .quality:hover,
.video-container .function-bar .speed:hover {
  color: #409EFF;
  cursor: pointer;
}

.avatar-container {
  display: flex;
  align-items: center;
}

.avatar-container .avatar {
  cursor: pointer;
}

.avatar-container .info {
  margin-left: 10px;
  width: 220px;
}


.avatar-container .nickname-row {
  font-size: 16px;
  display: flex;
  align-items: center;
}

.avatar-container .send-msg {
  font-size: 12px;
  margin-left: 10px;
  cursor: pointer;
}

.avatar-container .send-msg:hover {
  color: #409EFF;
}

.avatar-container .nickname {
  cursor: pointer;
  display: inline-block;
  max-width: 162px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.avatar-container .nickname:hover {
  color: #409EFF;
}

.avatar-container .signature {
  font-size: 12px;
  color: #909399;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.avatar-container .focus {
  width: 100%;
  height: 28.5px;
  font-size: 13.5px;
  margin-top: 3px;
}

.right .danmu-list-span {
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

.danmu-list {
  height: 483px;
}

.danmu-del:hover {
  cursor: pointer;
  color: #409EFF;
}

.danmu-list-enter-active,
.danmu-list-leave-active {
  transition: all 0.5s ease;
}

.danmu-list-enter-from {
  height: 0;
}

.danmu-list-enter-to {
  height: 483px;
}

.danmu-list-leave-from {
  height: 483px;
}

.danmu-list-leave-to {
  height: 0;
}

.right .collection-container {
  margin-top: 20px;
  background-color: #f4f4f5;
}

.right .collection-container .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-left: -5px;
  margin-right: -5px;
  margin-top: -15px;
}

.right .collection-container .header .name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 145px;
}

.right .collection-container .info-row {
  font-size: 13px;
  color: #909399;
  margin-bottom: -10px;
  margin-left: -5px;
  margin-right: -5px;
  display: flex;
  justify-content: space-between;
}

.right .collection-container .info-row .collection-video-num,
.right .collection-container .info-row .collection-play-num {
  font-size: 13px;
}

.right .collection-container .collection-list {
  margin-top: -41px;
  margin-bottom: -41px;
  margin-left: -15px;
  margin-right: -15px;
}

.right .collection-container .collection-list li {
  width: 238px;
  padding: 10px;
}

.collectionItemHighlight {
  background-color: white;
  color: #409EFF;
  pointer-events: none;
}

.collection-list ul {
  list-style: none;
  padding: 0;
  max-height: 228px;
  overflow: scroll;
}

.collection-list li {
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 235px;
}

.collection-list li .title {
  cursor: pointer;
}

.collection-list li .title:hover {
  color: #409EFF;
}

.collection-list li .duration {
  color: #909399;
  font-size: 13px;
}

.right .advertisement {
  width: 270px;
  height: 151.875px;
  margin-top: 20px;
  margin-bottom: 20px;
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
}

.right .card {
  margin-bottom: 20px;
  position: relative;
}

.right .card:last-child {
  margin-bottom: 0;
}

.right .cardFCA:first-child::after {
  content: '';
  position: absolute;
  bottom: -20px;
  width: 100%;
  height: 1px;
  background-color: #dedfe0;
  cursor: default;
  pointer-events: none;
}

.danmu-bar {
  width: calc(100% - 30px);
  height: 45px;
  background-color: #f4f4f5;
  font-size: 15px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
}

.danmu-bar .watch-danmu-num {
  color: #909399;
}

.danmu-bar .icon {
  font-size: 30px;
  cursor: pointer;
}

.danmu-bar .icon:hover {
  color: #409EFF;
}

.danmu-bar .dmkg {
  margin-left: 15px;
}

.danmu-bar .danmu-input-container {
  width: 450px;
  height: 30px;
  border-radius: 5px;
  background-color: white;
}

.danmu-bar .dmsz {
  font-size: 25px;
  position: absolute;
  z-index: 1;
  margin-left: 5px;
}

.dmsz-container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.dmsz-container .option {
  width: 100%;
}

.dmsz-container .el-radio {
  margin-right: 0;
}

.danmu-bar .danmu-input {
  padding-left: 25px;
  height: 30px;
}

.danmu-bar .danmu-send-btn {
  width: 50px;
  height: 30px;
}

.intro-tag-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.introduction {
  width: 100%;
  font-size: 16px;
  color: #303133;
  border: none;
  resize: none;
  overflow: hidden;
}

.intro-tag-container .more {
  color: #909399;
  font-size: 14px;
  margin-left: 3px;
  margin-top: 3px;
  cursor: pointer;
}

.intro-tag-container .more:hover {
  color: #409EFF;
}

.introduction:focus {
  outline: none;
}

.tag-row {
  margin-top: 20px;
}

.tag {
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
}
</style>

<style>
.el-color-dropdown__link-btn {
  display: none;
}

.el-color-dropdown {
  background-color: rgb(240, 240, 240) !important;
}
</style>