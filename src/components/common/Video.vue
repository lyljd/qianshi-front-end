<template>
  <div style="display: flex; flex-direction: column;">
    <div class="v-container">

      <div class="screen">
        <video @mouseenter="cancelHoverDanmu" id="video" class="video" @error="handleVideoError"></video>

        <div @mouseenter="cancelHoverDanmu" v-if="trackShow" class="track-container">
          <div v-for="idx in trackNum" :style="{ height: `${trackHeight * thProportion}px` }" class="track"><span
              style="margin-left: 15px;">{{ idx }}</span></div>
        </div>

        <div v-for="d in runningDanmus" :key="d.id" class="danmu"
          :class="{ danmuModalUp: d.isUp, danmuBorderNew: d.isNew && !d.isUp }" @animationend="doneDanmu(d)"
          :style="{ animationPlayState: d.id === dmHover.dm.id || !playStatus ? 'paused' : '', color: d.color, top: `${d.track! * trackHeight * thProportion + (trackHeight * thProportion - 20 * dmSize * dsProportion / 100) / 2 - (d.isUp ? 5 : 0)}px`, zIndex: dmShow ? 'auto' : '-1', opacity: dmOpacity / 100, fontSize: `${20 * dmSize * dsProportion / 100}px`, lineHeight: `${20 * dmSize * dsProportion / 100}px`, animationDuration: `${10 - dmSpeed + (d.aniDiff as number)}s` }"
          @mouseenter="(event: MouseEvent) => { hoverDanmu(d, event) }" :id="`dm-${d.id}`">
          <span v-show="!d.isUp && d.isLike && isLogin" @click="d.isLike ? cancelLikeDanmu(d) : likeDanmu(d)"
            :style="{ fontSize: `${20 * dmSize * dsProportion / 100}px` }" class="iconfont el-icon-good-fill icon"></span>
          <div v-if="d.isUp"
            :style="{ fontSize: `${12 * dmSize * dsProportion / 100}px`, lineHeight: `${12 * dmSize * dsProportion / 100}px`, padding: `${4 * dmSize * dsProportion / 100}px` }"
            class="upzhu">UP主</div>
          <span>{{ d.content }}</span>
        </div>

        <transition enterActiveClass="animate__zoomIn" leaveActiveClass="animate__zoomOut">
          <div v-show="dmHover.status" :style="{ left: `${dmHover.x}px`, top: `${dmHover.y}px` }"
            class="hover-menu animate__animated animate__faster">
            <span v-show="!dmHover.dm.isLike || !isLogin" @click="likeDanmu(dmHover.dm)"
              class="iconfont el-icon-good icon dh-ico"></span>
            <span v-show="dmHover.dm.isLike && isLogin" @click="cancelLikeDanmu(dmHover.dm)"
              class="iconfont el-icon-good-fill icon dh-ico"></span>

            <span class="dm-like-num">{{ cmjs.fmt.numWE(dmHover.dm.likeNum) }}</span>
            <span @click="copyDanmuContent(dmHover.dm)" class="iconfont el-icon-copy icon dh-ico"></span>

            <span v-show="!isLogin || !dmHover.dm.isMe" @click="reportDanmu(dmHover.dm.id)"
              class="iconfont el-icon-report icon dh-ico"></span>
            <span v-show="dmHover.dm.isMe && isLogin" @click="recallDanmu(dmHover.dm)"
              class="iconfont el-icon-recall icon dh-ico"></span>
            <span v-show="props.isUp && !dmHover.dm.isMe && isLogin" @click="deleteDanmu(dmHover.dm)"
              class="iconfont el-icon-ashbin icon dh-ico"></span>

            <div class="hmbr" :style="`${hmbIsTop ? 'top' : 'bottom'}: -7.5px`">&nbsp</div>
          </div>
        </transition>

        <transition leaveActiveClass="animate__animated animate__fadeOut"
          enterActiveClass="animate__animated animate__fadeIn">
          <div v-show="tipShow" id="tip" class="tip">{{ tipContent }}</div>
        </transition>

        <div id="ps" v-show="previewShow" :style="{ left: psLeft + 'px' }">
          <video id="psv" @contextmenu="(event: any) => { event.preventDefault() }"></video>
          <div class="ps-time">{{ psTime }}</div>
        </div>

        <transition :leaveActiveClass="!btProgerssShow ? 'animate__animated animate__fadeOut' : ''"
          enterActiveClass="animate__animated animate__fadeIn">
          <div class="ctl-bar-container" v-show="ctlBarShow">
            <el-progress @click="handleProgressClick" @mousemove="handleProgressMove" @mouseleave="hidePreview"
              class="progress" :percentage="videoTimePercentage" :show-text="false" />

            <div id="ctl-bar" class="ctl-bar">
              <div class="left-bar">
                <span v-show="props.collection && activeItemPos > 0"
                  @click="selectEpisode(props.collection![activeItemPos - 1].vid)"
                  class="iconfont el-icon-shangyiji pre"></span>

                <span v-show="!playStatus" @click="errorStatus ? undefined : videoEle.play()"
                  class="iconfont el-icon-bofang play" :style="{ cursor: errorStatus ? 'not-allowed' : '' }"></span>

                <span v-show="playStatus" @click="videoEle.pause()" class="iconfont el-icon-zanting pause"></span>

                <span v-show="props.collection && activeItemPos < props.collection.length - 1"
                  @click="selectEpisode(props.collection![activeItemPos + 1].vid)"
                  class="iconfont el-icon-xiayiji next"></span>

                <span style="cursor: default;">{{ videoCurrent }} / {{ videoDuration }}</span>
              </div>

              <div v-show="fullScreenStatus" class="flex-center" style="gap: 15px;">
                <el-tooltip :append-to="vContainerEle" :content="dmShow ? '关闭弹幕(d)' : '开启弹幕(d)'" placement="top"
                  effect="light" :enterable="false">
                  <span @click="setDanmuShow" class="iconfont icon dm-ico"
                    :class="`el-icon-dm-${dmShow ? 'open' : 'close'}`"></span>
                </el-tooltip>

                <el-popover :append-to="vContainerEle" placement="top" :show-arrow="false"
                  popper-style="min-width:unset; width: auto;">
                  <template #reference>
                    <span class="iconfont el-icon-dm-set icon dm-ico"></span>
                  </template>

                  <div class="dmsz-container">
                    <div class="option">
                      <span>不透明度</span><el-slider v-model="dmOpacity" @change="cmjs.cache.setLS('dmOpacity', dmOpacity)"
                        :show-tooltip="false" class="slider"></el-slider>{{ dmOpacity
                        }}%
                    </div>
                    <div class="option">
                      <span>显示区域</span><el-slider v-model="dmRegion" @change="cmjs.cache.setLS('dmRegion', dmRegion)"
                        :min="25" :step="25" show-stops :show-tooltip="false" class="slider"></el-slider>{{ dmRegionMark()
                        }}
                    </div>
                    <div class="option">
                      <span>弹幕字号</span><el-slider v-model="dmSize" @change="cmjs.cache.setLS('dmSize', dmSize)" :min="75"
                        :max="150" :show-tooltip="false" class="slider"></el-slider>{{
                          dmSize }}%
                    </div>
                    <div class="option">
                      <span>弹幕放大率<el-tooltip :append-to="vContainerEle" content="弹幕在全屏时根据屏幕等比放大比例的占比" placement="top">
                          <span class="iconfont el-icon-info"></span>
                        </el-tooltip></span><el-slider v-model="dmEnlargeRate"
                        @change="cmjs.cache.setLS('dmEnlargeRate', dmEnlargeRate)" :show-tooltip="false"
                        class="slider"></el-slider>{{
                          dmEnlargeRate }}%
                    </div>
                    <div class="option">
                      <span>弹幕速度</span><el-slider v-model="dmSpeed" @change="cmjs.cache.setLS('dmSpeed', dmSpeed)"
                        :min="3" :max="7" show-stops :show-tooltip="false" class="slider"></el-slider>{{ dmSpeedMark() }}
                    </div>
                  </div>
                </el-popover>

                <div style="display: flex;">
                  <div class="danmu-input-container">
                    <el-popover :append-to="vContainerEle" placement="top" :show-arrow="false"
                      popper-style="min-width:unset; width: auto;">
                      <template #reference>
                        <span class="iconfont el-icon-font-set icon font-set-ico"></span>
                      </template>

                      <div class="ftsz-container">
                        <div class="option">
                          颜色：<ColorPicker v-model="ftColor" :append-to="vContainerEle"></ColorPicker>
                        </div>
                      </div>
                    </el-popover>

                    <el-input ref="dmInput2Ref" @keyup.enter.native="sendDanmu" class="danmu-input" v-model="dmInput"
                      maxlength="50" placeholder="发个友善的弹幕见证当下" />
                  </div>

                  <el-button v-blur v-login @click="sendDanmu" class="danmu-send-btn" type="primary">发送</el-button>
                </div>
              </div>

              <div class="right-bar">
                <el-popover :teleported="false" trigger="hover" placement="top"
                  popper-style="min-width: unset; width: auto;" ref="videoQualityPop">
                  <template #reference>
                    <span class="quality">{{ videoQuality }}</span>
                  </template>
                  <el-radio-group @change="changeVideoQuality" v-model="videoQuality">
                    <div class="row">
                      <el-radio-button v-for="q in props.video" style="margin: 0;" :label="q.label" />
                    </div>
                  </el-radio-group>
                </el-popover>

                <el-popover ref="collectionPop" :teleported="false" trigger="hover" placement="top"
                  popper-style="min-width: unset; width: auto; padding: 0;" @show="locateTo">
                  <template #reference>
                    <span v-if="props.collection" v-show="fullScreenStatus" class="collection">选集</span>
                  </template>
                  <div class="collection-container">
                    <ul class="collection-item-container">
                      <li v-for="c in props.collection" :class="{ activeItem: c.vid === props.vid }"
                        @click="selectEpisode(c.vid)">{{ c.title }}</li>
                    </ul>
                  </div>
                </el-popover>

                <el-popover :teleported="false" :trigger="playSpeed === 3 ? 'never' : 'hover'" placement="top"
                  popper-style="min-width:unset; width: auto;" ref="playSpeedPop">
                  <template #reference>
                    <span :style="{ cursor: playSpeed === 3 ? 'not-allowed' : 'pointer' }" class="speed">{{ playSpeed ===
                      1
                      ? '倍速' :
                      `${playSpeed}x` }}</span>
                  </template>
                  <el-radio-group class="speed-radio-group" @change="setPlaySpeed" v-model="playSpeed"
                    :disabled="errorStatus">
                    <el-radio :label="2">2x</el-radio>
                    <el-radio :label="1.5">1.5x</el-radio>
                    <el-radio :label="1.25">1.25x</el-radio>
                    <el-radio :label="1">1x</el-radio>
                    <el-radio :label="0.75">0.75x</el-radio>
                    <el-radio :label="0.5">0.5x</el-radio>
                  </el-radio-group>
                </el-popover>

                <el-popover :teleported="false" trigger="hover" placement="top"
                  popper-style="min-width:unset; width: 245px;">
                  <template #reference>
                    <span v-show="!mutedStatus" @click="setMutedStatus" class="iconfont el-icon-yinliang icon"></span>
                  </template>
                  <div class="row" style="gap: 10px;">
                    <span style="margin: 0;">{{ volume }}</span>
                    <div><el-slider @input="changeVolume" style="width: 185px; margin: 0;" v-model="volume"
                        :show-tooltip="false" /></div>
                  </div>
                </el-popover>

                <el-tooltip content="关闭静音(m)" placement="top" effect="light" :enterable="false">
                  <span v-show="mutedStatus" @click="setMutedStatus" class="iconfont el-icon-jingyin icon"></span>
                </el-tooltip>

                <el-popover :teleported="false" trigger="hover" placement="top"
                  popper-style="min-width:unset; width: 160px;">
                  <template #reference>
                    <span class="iconfont el-icon-shezhi icon"></span>
                  </template>
                  <div @click="setAutoplay" class="row">静音自动开播<el-switch style="margin-left: 5px;" v-model="autoplay" />
                  </div>
                  <div @click="setBtProgressShow" class="row">底部进度条<el-switch style="margin-left: 5px;"
                      v-model="btProgerssShow" />
                  </div>
                </el-popover>

                <el-tooltip :content="!pipStatus ? '开启画中画' : '退出画中画'" placement="top" effect="light" :enterable="false"
                  :append-to="vContainerEle">
                  <span @click="!pipStatus ? pip() : cancelPip()" class="iconfont el-icon-huazhonghua icon"
                    :style="{ cursor: errorStatus ? 'not-allowed' : '' }"></span>
                </el-tooltip>

                <el-tooltip content="进入全屏(f)" placement="top-end" effect="light" :enterable="false">
                  <span @click="fullScreen" v-show="!fullScreenStatus" class="iconfont el-icon-quanping icon"
                    :style="{ cursor: errorStatus ? 'not-allowed' : '' }"></span>
                </el-tooltip>

                <el-tooltip content="退出全屏(f)" placement="top-end" effect="light" :enterable="false"
                  :append-to="vContainerEle">
                  <span @click="cancelFullScreen" v-show="fullScreenStatus"
                    class="iconfont el-icon-quxiaoquanping icon"></span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </transition>

        <transition enterActiveClass="animate__animated animate__fadeIn">
          <el-progress class="bt-progress" v-show="!ctlBarShow && btProgerssShow" :percentage="videoTimePercentage"
            :show-text="false" :stroke-width="fullScreenStatus ? 1 : 3"
            :style="{ marginTop: fullScreenStatus ? -1 : -3 + 'px' }" />
        </transition>
      </div>

      <div class="context-menu">
        <ul>
          <li>弹幕视频播放器 v021724</li>
          <li @click="copyVideoUrl">复制视频地址（精准空降）</li>
          <li @click="shortcutKeyDescriptionWindowVisible = true">快捷键说明</li>
          <li @click="cmjs.jump.developer()">关于作者</li>
        </ul>
      </div>

      <el-dialog v-model="shortcutKeyDescriptionWindowVisible" title="快捷键说明" :center="true" :align-center="true"
        :width="300">
        <el-table :data="shortcutKeyDesc" :show-header="false">
          <el-table-column prop="key" label="快捷键" :align="'center'" />
          <el-table-column prop="desc" label="说明" :align="'center'" />
        </el-table>
      </el-dialog>
    </div>

    <div class="danmu-bar">
      <span class="statistic">{{ cmjs.fmt.numWE(0) }} 人正在看，已装填 {{ cmjs.fmt.numWE(props.danmus.length) }} 条弹幕</span>

      <el-tooltip :content="dmShow ? '关闭弹幕(d)' : '开启弹幕(d)'" placement="top" effect="light" :enterable="false">
        <span @click="setDanmuShow" class="iconfont icon dm-ico"
          :class="`el-icon-dm-${dmShow ? 'open' : 'close'}`"></span>
      </el-tooltip>

      <el-popover placement="top" :show-arrow="false" popper-style="min-width:unset; width: auto;">
        <template #reference>
          <span class="iconfont el-icon-dm-set icon dm-ico"></span>
        </template>

        <div class="dmsz-container">
          <div class="option">
            <span>不透明度</span><el-slider v-model="dmOpacity" @change="cmjs.cache.setLS('dmOpacity', dmOpacity)"
              :show-tooltip="false" class="slider"></el-slider>{{ dmOpacity
              }}%
          </div>
          <div class="option">
            <span>显示区域</span><el-slider v-model="dmRegion" @change="cmjs.cache.setLS('dmRegion', dmRegion)" :min="25"
              :step="25" show-stops :show-tooltip="false" class="slider"></el-slider>{{ dmRegionMark() }}
          </div>
          <div class="option">
            <span>弹幕字号</span><el-slider v-model="dmSize" @change="cmjs.cache.setLS('dmSize', dmSize)" :min="75" :max="150"
              :show-tooltip="false" class="slider"></el-slider>{{
                dmSize }}%
          </div>
          <div class="option">
            <span>弹幕放大率<el-tooltip content="弹幕在全屏时根据屏幕等比放大比例的占比" placement="top">
                <span class="iconfont el-icon-info"></span>
              </el-tooltip></span><el-slider v-model="dmEnlargeRate"
              @change="cmjs.cache.setLS('dmEnlargeRate', dmEnlargeRate)" :show-tooltip="false"
              class="slider"></el-slider>{{
                dmEnlargeRate }}%
          </div>
          <div class="option">
            <span>弹幕速度</span><el-slider v-model="dmSpeed" @change="cmjs.cache.setLS('dmSpeed', dmSpeed)" :min="3" :max="7"
              show-stops :show-tooltip="false" class="slider"></el-slider>{{ dmSpeedMark() }}
          </div>
        </div>
      </el-popover>

      <div class="flex-grow" />

      <div class="danmu-input-container">
        <el-popover :append-to="vContainerEle" placement="top" :show-arrow="false"
          popper-style="min-width:unset; width: auto;">
          <template #reference>
            <span class="iconfont el-icon-font-set icon font-set-ico"></span>
          </template>

          <div class="ftsz-container">
            <div class="option">
              颜色：<ColorPicker v-model="ftColor" :append-to="vContainerEle"></ColorPicker>
            </div>
          </div>
        </el-popover>

        <el-input ref="dmInputRef" @keyup.enter.native="sendDanmu" class="danmu-input" v-model="dmInput" maxlength="50"
          placeholder="发个友善的弹幕见证当下" />
      </div>

      <el-button v-blur v-login @click="sendDanmu" class="danmu-send-btn" type="primary"
        :disabled="errorStatus">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ColorPicker from '@/components/common/ColorPicker.vue'
import cmjs from '@/cmjs'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'
import { InputInstance, ElMessageBox } from 'element-plus'

type VideoQuality = {
  label: string,
  url: string,
}

type Collection = {
  vid: number
  title: string
  duration: number
}

type Danmu = {
  id: number,
  content: string,
  time: number, // 发送在视频的哪一秒
  date: number, // 发送的日期时间
  color: string,
  running?: boolean, // 弹幕是否在显示中
  likeNum: number,
  isLike: boolean, // 点赞后 特殊显示
  isMe: boolean, // 该条弹幕是不是当前登录用户发的，是则会将【举报】按钮替换成【撤回】按钮
  isUp: boolean, // up主评论 特殊显示（若弹幕有up主评论特殊显示，则其他特殊显示均不会再显示）
  isNew?: boolean, // 新发弹幕 特殊显示
  track?: number, // 弹幕属于哪条轨道
  aniDiff?: number, // 弹幕的动画时间随机差值（用于解决弹幕重复问题）
}

type DanmuHover = {
  status: boolean,
  x: number,
  y: number,
  dm: Danmu,
}

const stf = defineEmits<{
  (cen: "delete-danmu", f: Function): void
  (cen: "recall-danmu", f: Function): void
}>()

const props = defineProps<{
  vid: number
  video: VideoQuality[]
  collection?: Collection[]
  danmus: Danmu[]
  isUp: boolean
  nextVid: number
}>()

const vidRef = toRef(props, 'vid')
watch(vidRef, () => {
  playSpeed.value = 1
  calcVideoUrlAndQuality()
  runningDanmus.value.forEach(d => {
    d.running = false
  })
  runningDanmus.value = []

  nextTick(() => {
    videoEle.play()
  })
  initDanmuMap()
  calcActiveItemPos()
})

const store = useStore()

const shortcutKeyDesc = [
  {
    key: "Space",
    desc: '播放/暂停',
  },
  {
    key: "→短按",
    desc: '快进5秒',
  },
  {
    key: "→长按",
    desc: '3倍速播放',
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

const trackNum = 12 // track：弹幕的轨道，每条弹幕归属于某一个轨道
let trackHeight = ref(0)
const trackShow = false // 测试使用
let trackReduce = ref(0) // 用作在控制栏显示时减少轨道随机上限（不然会出现弹幕和控制栏重叠的情况）（在比例系数变化时动态计算）

const collectionPop = ref()
const videoQualityPop = ref()
const playSpeedPop = ref()
const dmInputRef = ref<InputInstance>()
const dmInput2Ref = ref<InputInstance>()

let vContainerEle: HTMLDivElement
let screenEle: HTMLDivElement
let videoEle: HTMLVideoElement
let ctlBarContainerEle: HTMLDivElement
let hoverMenuEle: HTMLDivElement
let contextMenuEle: HTMLDivElement
let danmuSendBtns: NodeListOf<HTMLButtonElement>
let collectionItemContainerEle: HTMLUListElement
let collectionActiveItemEle: HTMLLIElement
let psEle: HTMLDivElement // preview screen
let psvEle: HTMLVideoElement // preview screen video

// hmb：hover-menu::before(菜单上下方的小三角)；css绑定变量
let hmbTop = ref("")
let hmbLeft = ref("")
let hmbTF = ref("") // transform
let hmbBC = ref("") // border-color
let hmbIsTop = ref(true) // 小三角是否位于菜单的上方；hmbr(小三角区域矩形)的top和bottom依赖该属性

let { isLogin } = storeToRefs(store)
let dmHover = reactive<DanmuHover>({
  status: false,
  x: 0,
  y: 0,
  dm: { id: -1, content: "", time: -1, date: -1, color: "#FFFFFF", likeNum: 0, isLike: false, isMe: false, isUp: false, },
})

// 播放器相关
const danmuMap: Map<number, Danmu[]> = new Map() // 将props.danmus按d.time分类存储，优化性能
let runningDanmus = ref<Danmu[]>([])
let playStatus = ref(false)
let contextStatus = ref(false) // 菜单是否显示
let errorStatus = ref(false) // 视频是否加载失败
let shortcutKeyDescriptionWindowVisible = ref(false)
let videoTimePercentage = ref(0)
let videoCurrent = ref("00:00")
let videoDurationNumber = ref(0) // 该视频有多少秒
let videoDuration = ref("00:00")
let videoQuality = ref("")
let playSpeed = ref(1)
let mutedStatus = ref(ref(cmjs.cache.getLS("mutedStatus") !== "true" ? false : true))
let volume = ref(cmjs.cache.getLS("volume") === null ? 50 : parseInt(cmjs.cache.getLS("volume") as string))
let autoplay = ref(cmjs.cache.getLS("autoplay") === "true" ? true : false)
let pipStatus = ref(false)
let fullScreenStatus = ref(false)
let tipContent = ref("")
let tipShow = ref(false)
let psTime = ref("")
let previewShow = ref(false)
let psLeft = ref(0)
let tipShowTimer: number
let ctlBarShow = ref(true)
let ctlBarShowTimer: number
let btProgerssShow = ref(cmjs.cache.getLS("btProgress") !== "false" ? true : false)
let vContainerOriginWidth = ref(0)
let vContainerWidth = ref(0)
let vContainerOriginHeight = ref(0)
let proportion = ref(1) // 全屏放大的基准比例（在进入全屏后会动态计算）
let thProportion = ref(1) // 全屏后“轨道高度”会等比放大于全屏放大的比例；所有使用到trackHeight的地方都需要乘上该比例系数
let dsProportion = ref(1) // 全屏后“弹幕字号”会等比放大于全屏放大的比例；所有使用到dmSize的地方都需要乘上该比例系数
let videoClickTimer: number | null
let activeItemPos = ref(-1)
let isRightArrowKeyPressed = ref(false) // 右方向键是否按下；为了实现长按时3倍速播放
let rightArrowKeyPressedTimer: number
let prePlaySpeed = ref(1)

// 弹幕栏相关
let dmShow = ref(cmjs.cache.getLS("dmShow") !== "false" ? true : false)
let dmOpacity = ref(cmjs.cache.getLS("dmOpacity") ? Number(cmjs.cache.getLS("dmOpacity")) : 100)
let dmRegion = ref(cmjs.cache.getLS("dmRegion") ? Number(cmjs.cache.getLS("dmRegion")) : 100)
let dmSize = ref(cmjs.cache.getLS("dmSize") ? Number(cmjs.cache.getLS("dmSize")) : 100)
let dmEnlargeRate = ref(cmjs.cache.getLS("dmEnlargeRate") ? Number(cmjs.cache.getLS("dmEnlargeRate")) : 50)
watch(dmEnlargeRate, (newVal: number) => {
  dsProportion.value = (proportion.value - 1) * newVal / 100 + 1
})
let dmSpeed = ref(cmjs.cache.getLS("dmSpeed") ? Number(cmjs.cache.getLS("dmSpeed")) : 5)
let ftColor = ref(!trackShow ? '#FFFFFF' : '#000000')
let dmInput = ref("")

onMounted(() => {
  vContainerEle = document.querySelector(".v-container") as HTMLDivElement
  vContainerOriginWidth.value = vContainerEle.clientWidth
  vContainerWidth.value = vContainerOriginWidth.value
  vContainerOriginHeight.value = vContainerEle.clientHeight
  screenEle = document.querySelector(".screen") as HTMLDivElement
  videoEle = document.getElementById("video") as HTMLVideoElement
  ctlBarContainerEle = document.querySelector(".ctl-bar-container") as HTMLDivElement
  hoverMenuEle = document.querySelector(".hover-menu") as HTMLDivElement
  contextMenuEle = document.querySelector('.context-menu') as HTMLDivElement
  danmuSendBtns = document.querySelectorAll(".danmu-send-btn") as NodeListOf<HTMLButtonElement>
  collectionItemContainerEle = document.querySelector(".v-container .collection-item-container") as HTMLUListElement
  psEle = document.getElementById('ps') as HTMLDivElement
  psvEle = document.getElementById('psv') as HTMLVideoElement

  psEle.style.width = vContainerOriginWidth.value / 4 + 'px'
  psEle.style.height = vContainerOriginHeight.value / 4 + 'px'

  trackHeight.value = vContainerEle.clientHeight / trackNum
  trackReduce.value = calcTrackReduce()

  videoEle.muted = mutedStatus.value
  videoEle.volume = volume.value / 100

  videoEle.addEventListener('contextmenu', function (event: any) {
    event.preventDefault()
    showContext(event.pageX, event.pageY)
  })

  window.addEventListener('click', function () {
    hideContext()
  })

  videoEle.addEventListener('loadedmetadata', function () {
    errorStatus.value = false
    videoDurationNumber.value = Math.floor(videoEle.duration)
    videoDuration.value = cmjs.fmt.videoDuration(videoDurationNumber.value)
    vContainerEle.style.pointerEvents = "auto"

    const t = new URLSearchParams(location.search).get("t")
    if (t !== null) {
      videoEle.currentTime = parseInt(t)
    }

    if (autoplay.value) {
      videoEle.muted = true
      mutedStatus.value = true
      videoEle.click()
    }
  })

  videoEle.addEventListener('timeupdate', function () {
    videoTimePercentage.value = videoEle.currentTime / videoEle.duration * 100
    videoCurrent.value = cmjs.fmt.videoDuration(Math.floor(videoEle.currentTime))

    const ct = Math.floor(videoEle.currentTime)
    if (danmuMap.has(ct) && !errorStatus.value) {
      danmuMap.get(ct)!.forEach(d => {
        if (!d.running) {
          runDanmu(d)
        }
      })
    }

    if (ct === videoDurationNumber.value - 5 && props.nextVid !== -1) {
      showTip("5秒后将自动播放下一个视频")
    }
  })

  videoEle.addEventListener('play', function () {
    playStatus.value = true
    showCtlBar()
  })

  videoEle.addEventListener('pause', function () {
    showCtlBar(-1)
    playStatus.value = false
  })

  videoEle.addEventListener('ended', function () {
    if (props.nextVid !== -1) {
      selectEpisode(props.nextVid) // 自动连播
    }
  })

  videoEle.addEventListener('mousemove', function () {
    showCtlBar()
  })

  ctlBarContainerEle.addEventListener('mouseenter', function () {
    showCtlBar(-1)
  })

  ctlBarContainerEle.addEventListener('mouseleave', function () {
    showCtlBar()
  })

  document.addEventListener('keydown', function (event) {
    const ettn = (event.target as any).tagName
    if (ettn === "INPUT" || ettn === "TEXTAREA") {
      return
    }

    switch (event.code) {
      case "ArrowLeft": {
        event.preventDefault()
        showTip("快退5秒")
        if (!btProgerssShow.value) {
          showCtlBar()
        }
        videoEle.currentTime -= 5
        break
      }
      case "ArrowRight": {
        event.preventDefault()
        if (!isRightArrowKeyPressed.value) {
          isRightArrowKeyPressed.value = true
          rightArrowKeyPressedTimer = setTimeout(() => {
            playSpeedPop.value.hide()
            showTip("3倍速播放中", -1)
            prePlaySpeed.value = playSpeed.value
            playSpeed.value = 3
            videoEle.playbackRate = 3
          }, 500);
        }
        break
      }
      case "ArrowUp": {
        event.preventDefault()
        if (mutedStatus.value) {
          setMutedStatus()
        }
        if (volume.value > 90) {
          volume.value = 100
        } else {
          volume.value += 10
        }
        changeVolume(volume.value)
        showTip(`音量：${volume.value}%`)
        break
      }
      case "ArrowDown": {
        event.preventDefault()
        if (mutedStatus.value) {
          setMutedStatus()
        }
        if (volume.value < 10) {
          volume.value = 0
        } else {
          volume.value -= 10
        }
        changeVolume(volume.value)
        showTip(`音量：${volume.value}%`)
        break
      }
      case "Space": {
        event.preventDefault()
        showTip(playStatus.value ? '暂停' : '播放')
        videoEle.click()
        break
      }
      default: {
        switch (event.key) {
          case "d": {
            showTip(dmShow.value ? '关闭弹幕' : '开启弹幕')
            setDanmuShow()
            break
          }
          case "f": {
            if (fullScreenStatus.value) {
              cancelFullScreen()
              showTip("退出全屏")
            } else {
              fullScreen()
              showTip("全屏")
            }
            break
          }
          case "m": {
            showTip(mutedStatus.value ? '关闭静音' : '静音')
            setMutedStatus()
            break
          }
        }
      }
    }
  })

  document.addEventListener('keyup', function (event) {
    switch (event.code) {
      case "ArrowRight": {
        event.preventDefault()
        isRightArrowKeyPressed.value = false
        if (playSpeed.value !== 3) {
          clearTimeout(rightArrowKeyPressedTimer)
          showTip("快进5秒")
          if (!btProgerssShow.value) {
            showCtlBar()
          }
          videoEle.currentTime += 5
        } else {
          hideTip()
          playSpeed.value = prePlaySpeed.value
          videoEle.playbackRate = prePlaySpeed.value
        }
        break
      }
    }
  })

  videoEle.addEventListener('click', function () {
    if (errorStatus.value) {
      return
    }

    if (!videoClickTimer) {
      videoClickTimer = setTimeout(() => {
        clearTimeout(videoClickTimer as number)
        videoClickTimer = null

        if (contextStatus.value) {
          hideContext()
          return
        }
        playStatus.value ? videoEle.pause() : videoEle.play()
      }, 200) // 解决双击全屏时视频播放状态会短暂改变的问题
    } else {
      clearTimeout(videoClickTimer)
      videoClickTimer = null
    }
  })

  videoEle.addEventListener('dblclick', function () {
    if (fullScreenStatus.value) {
      cancelFullScreen()
    } else {
      fullScreen()
    }
  })

  document.addEventListener('fullscreenchange', handleFullscreenChange)

  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

  document.addEventListener('enterpictureinpicture', () => {
    pipStatus.value = true
  })

  document.addEventListener('leavepictureinpicture', () => {
    pipStatus.value = false
  })

  calcVideoUrlAndQuality()
  initDanmuMap()
  calcActiveItemPos()
})

function dmRegionMark(): string {
  switch (dmRegion.value) {
    case 25: return "1/4"
    case 50: return "半屏"
    case 75: return "3/4"
    case 100: return "全屏"
  }
  return `${dmRegion.value}%`
}

function dmSpeedMark(): string {
  switch (dmSpeed.value) {
    case 3: return "极慢"
    case 4: return "较慢"
    case 5: return "适中"
    case 6: return "较快"
    case 7: return "极快"
  }
  return "未知"
}

function initDanmuMap() {
  danmuMap.clear()
  props.danmus.forEach(d => {
    addToDanmuMap(d)
  })
}

function addToDanmuMap(d: Danmu) {
  if (!danmuMap.has(d.time)) {
    danmuMap.set(d.time, [d])
  } else {
    danmuMap.get(d.time)!.push(d)
  }
}

function deleteFromDanmuMap(d: Danmu) {
  let mi = danmuMap.get(d.time)
  if (mi) {
    if (mi.length === 1) {
      danmuMap.delete(d.time)
    } else {
      mi.splice(mi.indexOf(d), 1)
    }
  }
}

function randTrack(): number {
  return Math.floor(Math.random() * (trackNum - trackReduce.value) * dmRegion.value / 100)
}

// randDiff 生成(-1,1)范围内的小数，用于暂时缓解弹幕重复问题（给弹幕的动画时间和出现时间加上diff）
function randDiff(): number {
  let rdn = Math.random()
  // [0,1)

  while (rdn === 0) {
    rdn = Math.random()
  }
  // (0,1)

  rdn = rdn * 2 - 1
  // (-1,1)

  return rdn
}

function calcTrackReduce(): number {
  return 1 + Math.floor(ctlBarContainerEle.clientHeight / (trackHeight.value * thProportion.value))
}

function runDanmu(d: Danmu) {
  d.track = randTrack()
  d.aniDiff = randDiff()
  d.running = true
  runningDanmus.value.push(d)
}

function doneDanmu(d: Danmu) {
  d.running = false
  const idx = runningDanmus.value.indexOf(d)
  if (idx !== -1) {
    runningDanmus.value.splice(idx, 1)
  }
}

function hoverDanmu(d: Danmu, event: MouseEvent) {
  if (!dmHover.status) {
    // TODO 如果弹幕对象的isLike为false，则api请求：获取该弹幕是否被当前用户点赞过，并赋给弹幕对象的isLike
    // d.isLike = true

    // dmHover.status控制菜单的显示；只有菜单显示出来了之后，hoverMenuEle.clientWidth(菜单的宽度)才取得出来
    dmHover.status = true

    nextTick(() => {
      dmHover.dm = d
      const dmEle = document.getElementById(`dm-${d.id}`) as HTMLElement

      dmHover.x = event.clientX - screenEle.offsetLeft - hoverMenuEle.clientWidth / 2 + window.scrollX + (dmHover.dm.isUp ? 15 : 0)
      hmbLeft.value = "50%"
      hmbTF.value = "translateX(-50%)"
      if (dmHover.x < 0) {
        // 菜单显示位置超出左边界
        dmHover.x = 0
        hmbLeft.value = ""
        hmbTF.value = ""
      } else if (dmHover.x > screenEle.clientWidth - hoverMenuEle.clientWidth) {
        // 菜单显示位置超出右边界
        dmHover.x = screenEle.clientWidth - hoverMenuEle.clientWidth
        hmbLeft.value = "calc(100% - 7.5px)"
        hmbTF.value = "translateX(-100%)"
      }

      //hover的弹幕在屏幕的上半部分则菜单显示在弹幕的下方，反之在上方
      if (d.track! < trackNum / 2) {
        dmHover.y = dmEle.offsetTop + dmEle.clientHeight + 7.5 // 7.5：hmbr的height
        hmbTop.value = "-15px"
        hmbBC.value = "transparent transparent rgba(0, 0, 0, 0.5) transparent"
        hmbIsTop.value = true
      } else {
        dmHover.y = dmEle.offsetTop - hoverMenuEle.clientHeight - 7.5 // 7.5：同上
        hmbTop.value = "100%"
        hmbBC.value = "rgba(0, 0, 0, 0.5) transparent transparent transparent"
        hmbIsTop.value = false
      }
    })
  }
}

function cancelHoverDanmu() {
  if (dmHover.status) {
    dmHover.status = false
    setTimeout(() => {
      dmHover.dm = { id: -1, content: "", time: -1, date: -1, color: "#FFFFFF", likeNum: 0, isLike: false, isMe: false, isUp: false, }
    }, 100) // 菜单消失时有个0.1秒的动画，如果直接初始化dm则会造成菜单内显示有些奇怪
  }
}

function destroyDanmu(d: Danmu) {
  // TODO api，成功则进行下述流程：
  doneDanmu(d)
  props.danmus.splice(props.danmus.indexOf(d), 1)
  deleteFromDanmuMap(d)
}

function setDanmuShow() {
  dmShow.value = !dmShow.value
  cmjs.cache.setLS("dmShow", dmShow.value)
}

function sendDanmu() {
  if (errorStatus.value) {
    return
  }

  if (!isLogin.value) {
    if (fullScreenStatus.value) {
      cancelFullScreen()
    }
    store.openLoginWindow()
    return
  }

  if (danmuSendBtns[0].disabled) {
    return
  }

  dmInput.value = dmInput.value.trim()
  if (dmInput.value.trim().length === 0) {
    cmjs.prompt.error("请输入弹幕")
    return
  }

  danmuSendBtns.forEach((ele) => {
    cmjs.util.btnCD(ele, 5)
  })
  // 因为timeupdate事件每秒触发4次，所以在每半秒后发的弹幕需要在下一秒才显示（不这样的话，恰巧在第4次的时候发出去的弹幕将不会显示出来）
  // TODO api：请求发送弹幕api，获取响应值中的id、date，然后赋给弹幕对象
  const d: Danmu = { id: Date.now(), content: dmInput.value, time: Math.round(videoEle.currentTime), date: Date.now(), color: ftColor.value, likeNum: 0, isLike: false, isMe: true, isUp: props.isUp, isNew: true, }
  props.danmus.push(d)
  addToDanmuMap(d)
  dmInputRef.value?.blur()
  dmInput2Ref.value?.blur()
  dmInput.value = ""
}

function likeDanmu(d: Danmu) {
  if (!isLogin.value) {
    if (fullScreenStatus.value) {
      cancelFullScreen()
    }
    store.openLoginWindow()
    return
  }

  if (d.isMe) {
    cmjs.prompt.info("不能给自己的弹幕点赞", vContainerEle)
    return
  }

  // TODO api
  d.isLike = true
  d.likeNum++
  cmjs.prompt.success("点赞成功", vContainerEle)
}

function cancelLikeDanmu(d: Danmu) {
  if (!isLogin.value) {
    if (fullScreenStatus.value) {
      cancelFullScreen()
    }
    store.openLoginWindow()
    return
  }
  // TODO api
  d.isLike = false
  d.likeNum--
  cmjs.prompt.success("取消点赞成功", vContainerEle)
}

function reportDanmu(did: number) {
  const fs = fullScreenStatus
  if (fullScreenStatus.value) {
    cancelFullScreen()
  }

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  const ps = playStatus.value
  videoEle.pause()

  store.openFSWindow({
    title: "弹幕举报",
    placeholder: "请输入举报理由",
    submitHandler: (msg: string, fileList: File[], closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          did: did,
        },
      })
      cmjs.prompt.success("提交成功", vContainerEle)
      closeWindow()
    },
    cancelHandler: () => {
      ps ? videoEle.play() : undefined
      fs ? fullScreen() : undefined
    },
  })
}

function recallDanmu(d: Danmu) {
  ElMessageBox.confirm('你确认要撤回该弹幕吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
    appendTo: vContainerEle,
  })
    .then(() => {
      destroyDanmu(d)
      cancelHoverDanmu()
      cmjs.prompt.success("撤回成功", vContainerEle)
    })
}
stf('recall-danmu', recallDanmu)

function deleteDanmu(d: Danmu) {
  ElMessageBox.confirm('你确认要删除该弹幕吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
    appendTo: vContainerEle,
  })
    .then(() => {
      destroyDanmu(d)
      cancelHoverDanmu()
      cmjs.prompt.success("删除成功", vContainerEle)
    })
}
stf('delete-danmu', deleteDanmu)

function copyDanmuContent(d: Danmu) {
  cmjs.util.copyToClip(d.content, vContainerEle)
}

function copyVideoUrl() {
  cmjs.util.copyToClip(location.origin + location.pathname + "?t=" + videoEle.currentTime.toString(), vContainerEle)
}

function handleProgressClick(event: any) {
  if (errorStatus.value) {
    return
  }

  const progressBar = event.target
  const progressBarRect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - progressBarRect.left
  const clickedPercentage = (clickX / vContainerEle.clientWidth) * 100
  const curSecond = Math.floor(clickedPercentage * (videoEle.duration / 100))
  videoEle.currentTime = curSecond
  videoTimePercentage.value = clickedPercentage
  hidePreview()
}

function handleProgressMove(event: any) {
  if (errorStatus.value) {
    return
  }

  const progressBar = event.target
  const progressBarRect = progressBar.getBoundingClientRect()
  const moveX = event.clientX - progressBarRect.left
  psLeft.value = Math.min(Math.max(moveX - vContainerOriginWidth.value / 4 / 2, 0), vContainerWidth.value - vContainerOriginWidth.value / 4)
  const movedPercentage = (moveX / vContainerEle.clientWidth) * 100
  const curSecond = Math.floor(movedPercentage * (videoEle.duration / 100))
  showPreview(curSecond)
}

function changeVideoQuality(value: string) {
  videoQualityPop.value.hide()
  cmjs.cache.setLS("videoQuality", value)
  const curTime = videoEle.currentTime

  for (let i = 0; i < props.video.length; i++) {
    if (props.video[i].label === value) {
      videoEle.src = props.video[i].url
      psvEle.src = props.video[i].url
      break
    }
  }

  if (playStatus.value) {
    videoEle.play()
  }

  videoEle.currentTime = curTime
}

function selectEpisode(vid: number) {
  collectionPop.value.hide()
  cmjs.jump.pushVideo(vid)
}

// locateTo 全屏状态下选集窗口弹出时自动定位到当前集的位置
function locateTo() {
  collectionActiveItemEle = document.querySelector(".v-container .activeItem") as HTMLLIElement
  collectionItemContainerEle.scrollTop = collectionActiveItemEle.offsetTop - collectionItemContainerEle.offsetTop
}

function setPlaySpeed(value: number) {
  videoEle.playbackRate = value
  playSpeedPop.value.hide()
}

function setMutedStatus() {
  mutedStatus.value = !mutedStatus.value
  videoEle.muted = !videoEle.muted
  cmjs.cache.setLS("mutedStatus", mutedStatus.value)
}

function changeVolume(val: number) {
  videoEle.volume = val / 100
  cmjs.cache.setLS("volume", val.toString())
}

function setAutoplay() {
  cmjs.cache.setLS("autoplay", autoplay.value)
}

function setBtProgressShow() {
  cmjs.cache.setLS("btProgress", btProgerssShow.value)
}

function pip() {
  if (errorStatus.value) {
    return
  }
  videoEle.requestPictureInPicture()
}

function cancelPip() {
  document.exitPictureInPicture()
}

// showTip duration表示显示几秒，-1代表一直显示；省略时默认显示1秒
function showTip(content: string, duration?: number) {
  clearTimeout(tipShowTimer)
  tipContent.value = content
  tipShow.value = true

  if (duration !== -1) {
    tipShowTimer = setTimeout(() => {
      hideTip()
    }, duration ? duration * 1000 : 1000)
  }
}

function hideTip() {
  clearTimeout(tipShowTimer)
  tipShow.value = false
}

// showCtlBar duration表示显示几秒，-1代表一直显示；省略时默认显示1秒
function showCtlBar(duration?: number) {
  if (!playStatus.value) {
    return
  }

  clearTimeout(ctlBarShowTimer)
  ctlBarShow.value = true
  videoEle.style.cursor = "default"

  if (duration !== -1) {
    ctlBarShowTimer = setTimeout(() => {
      hideCtlBar()
    }, duration ? duration * 1000 : 1000)
  }
}

function hideCtlBar() {
  clearTimeout(ctlBarShowTimer)
  videoEle.style.cursor = "none"
  ctlBarShow.value = false
}

function fullScreen() {
  if (errorStatus.value) {
    return
  }

  if (pipStatus.value) {
    document.exitPictureInPicture()
  }

  vContainerEle.requestFullscreen()
}

function cancelFullScreen() {
  let doc: any = document
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
}

function handleFullscreenChange() {
  let doc: any = document
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    fullScreenStatus.value = true
    vContainerWidth.value = screen.width
    proportion.value = screen.height / vContainerOriginHeight.value
    thProportion.value = proportion.value
    dsProportion.value = (proportion.value - 1) * dmEnlargeRate.value / 100 + 1
  } else {
    fullScreenStatus.value = false
    vContainerWidth.value = vContainerOriginWidth.value
    proportion.value = 1
    thProportion.value = 1
    dsProportion.value = 1
  }
  trackReduce.value = calcTrackReduce()
  showCtlBar()
}

function calcActiveItemPos() {
  if (!props.collection) {
    return
  }

  for (let i = 0; i < props.collection.length; i++) {
    if (props.collection[i].vid === props.vid) {
      activeItemPos.value = i
      break
    }
  }
}

function calcVideoUrlAndQuality() {
  if (props.video.length === 0) {
    return
  }

  const vq = cmjs.cache.getLS('videoQuality')
  if (!vq) {
    videoEle.src = props.video[0].url
    psvEle.src = props.video[0].url
    videoQuality.value = props.video[0].label
    return
  }

  for (let i = 0; i < props.video.length; i++) {
    if (props.video[i].label === vq) {
      videoEle.src = props.video[i].url
      psvEle.src = props.video[i].url
      videoQuality.value = vq
      return
    }
  }

  videoEle.src = props.video[0].url
  psvEle.src = props.video[0].url
  videoQuality.value = props.video[0].label
}

function handleVideoError() {
  errorStatus.value = true
  if (fullScreenStatus.value) {
    cancelFullScreen()
  }
  if (pipStatus.value) {
    cancelPip()
  }
  cmjs.prompt.error("视频加载失败")
}

function showContext(left: number, top: number) {
  contextMenuEle.style.display = 'block'
  contextMenuEle.style.left = left + 'px'
  contextMenuEle.style.top = top + 'px'
  contextStatus.value = true
}

function hideContext() {
  /* 判断条件加上videoClickTimer主要是想实现在菜单显示时点击视频元素只关闭菜单，而不改变其播放状态；
  此处为分析：若在菜单显示时点击了视频元素，此时不应该触发video的click事件，而dbClick事件应该被正常触发，
  但触发dbClick必定会触发两次click，若直接在菜单显示时禁掉了video的click，那么在dbClick时，
  只有video的第一次click被禁止掉了，因为虽然在触发video的第一次click时被禁止了，但在同时，
  监听在window上的click会被触发（会关闭菜单），那么第二次click因为菜单已被关闭，所以会正常触发，
  那么播放状态就会被改变；若在click事件内直接判断contextStatus，因为在解决dbClick会短暂改变播放状态时，
  设置了200的延迟，那么此处就需要设置短暂大于200的延迟，才会被内部判断到，但这可能会有一些未知的影响，
  所以干脆此处就不触发了，那么在内部就能判断到了，但是需要在video的click内部来手动调用该事件。
  */
  if (contextStatus.value && !videoClickTimer) {
    contextMenuEle.style.display = 'none'
    contextStatus.value = false
  }
}

// showPreview 显示视频第x秒的预览画面
function showPreview(second: number) {
  psvEle.currentTime = second
  psTime.value = cmjs.fmt.videoDuration(psvEle.currentTime)
  previewShow.value = true
}

function hidePreview() {
  previewShow.value = false
}
</script>

<style lang="less" scoped>
.v-container {
  width: 850px;
  height: 480px;

  .screen {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .video {
      width: 100%;
      height: 100%;
      background-color: black;
    }

    .track-container {
      width: 100%;
      position: absolute;
      top: 0;

      .track {
        display: flex;
        align-items: center;
        cursor: default;
        color: #909399;
      }

      .track:nth-child(odd) {
        background-color: #E6E8EB;
      }

      .track:nth-child(even) {
        background-color: #FAFAFA;
      }
    }

    .danmu {
      position: absolute;
      white-space: nowrap;
      cursor: default;
      display: flex;
      align-items: center;
      gap: 3px;
      animation: running 5s linear;

      .upzhu {
        color: white;
        background-color: #409EFF;
        border-radius: 10px;
      }
    }

    .danmuModalUp {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 15px;
      padding: 5px;
    }

    .danmuBorderNew {
      border: 1px solid;
      padding: 3px;
    }

    @keyframes running {
      from {
        left: 100%;
      }

      to {
        left: 0;
        transform: translate3d(-100%, 0, 0);
      }
    }

    .hover-menu {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;

      .dh-ico {
        font-size: 20px;
        color: white;
      }

      .dh-ico:not(:first-child) {
        margin-left: 10px;
      }

      .dm-like-num {
        font-size: 12px;
        color: white;
        align-self: flex-end;
      }

      // 小三角区域矩形（没有的话会不好触发菜单）
      .hmbr {
        width: 100%;
        height: 7.5px;
        position: absolute;
        left: 0;
        cursor: default;
      }
    }

    // 菜单上下方的小三角
    .hover-menu::before {
      content: '';
      position: absolute;
      top: v-bind(hmbTop);
      left: v-bind(hmbLeft);
      transform: v-bind(hmbTF);
      border-width: 7.5px;
      border-style: solid;
      border-color: v-bind(hmbBC);
    }

    .tip {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
    }

    #ps {
      position: absolute;
      bottom: 65.5px;

      #psv {
        width: 100%;
        height: 100%;
      }

      .ps-time {
        position: absolute;
        bottom: 0.5px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        padding: 2px;
        border-radius: 1px;
        background-color: rgba(0, 0, 0, 0.66);
        color: white;
      }
    }

    .ctl-bar-container {
      .progress {
        cursor: pointer;
        margin-top: -56px;

        :deep(.el-progress-bar__outer),
        :deep(.el-progress-bar__inner) {
          border-radius: unset;
        }
      }

      .ctl-bar {
        width: calc(100% - 30px);
        height: 50px;
        color: white;
        background: rgba(0, 0, 0, 0.25);
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .left-bar,
        .right-bar {
          display: flex;
          align-items: center;

          .row {
            display: flex;
            justify-content: right;
            align-items: center;
            margin: 0;
          }

          .collection-container {
            ul {
              list-style: none;
              padding: 0;
              margin: 0;
              max-height: 340px; // 10项
              overflow: auto;

              li {
                padding: 0px 10px; // 左右间距10px
                line-height: 34px; // font-size默认10px；上下间距10px
                cursor: pointer;
                max-width: 150px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }

              li:hover {
                color: #409EFF;
              }

              .activeItem {
                background-color: #F0F2F5;
                color: #409EFF;
                pointer-events: none;
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

          .speed-radio-group {
            flex-wrap: unset;
            flex-direction: column;
            align-items: unset;
            padding: 0;
            gap: 10px;

            &>* {
              margin-right: 0;
              height: unset;
            }
          }
        }

        .left-bar>* {
          margin-right: 15px;
        }

        .right-bar>* {
          margin-left: 15px;
        }

        .icon {
          font-size: 20px;
        }

        .play,
        .pause {
          font-size: 20px;
        }

        .play:hover,
        .pre:hover,
        .next:hover,
        .pause:hover,
        .quality:hover,
        .collection:hover,
        .speed:hover {
          color: #409EFF;
          cursor: pointer;
        }
      }
    }

    .bt-progress {
      pointer-events: none;

      :deep(.el-progress-bar__outer),
      :deep(.el-progress-bar__inner) {
        border-radius: unset;
      }
    }
  }

  .context-menu {
    display: none;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 14px;
    z-index: 2;

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        padding: 10px;
        border-bottom: 1px solid #909399;
        cursor: pointer;
      }

      li:first-child {
        cursor: default;
      }

      li:last-child {
        border-bottom: none;
      }

      li:hover {
        background: rgba(0, 0, 0, 0.25);
      }
    }
  }
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

  .statistic {
    color: #909399;
  }

  .dm-ico {
    font-size: 19px;
    margin-left: 15px;
  }
}

.danmu-input-container {
  width: 450px;
  height: 30px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  align-items: center;

  .font-set-ico {
    font-size: 16px !important;
    position: absolute;
    z-index: 1;
    margin-left: 11px;
    color: black;
  }

  .danmu-input {
    padding-left: 27px;
    height: 30px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
}

.danmu-send-btn {
  width: 50px;
  height: 30px;
  border-top-left-radius: unset;
  border-bottom-left-radius: unset;
}

.dmsz-container,
.ftsz-container {
  .option {
    display: flex;
    align-items: center;
    cursor: default;

    span {
      width: 90px;
    }

    .slider {
      width: 100px;
      margin-left: 10px;
      margin-right: 20px;
    }
  }

  .option:not(:last-child) {
    margin-bottom: 10px;
  }
}

.icon {
  cursor: pointer;
}

.icon:hover {
  color: #409EFF !important;
}
</style>