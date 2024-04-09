<template>
  <TopMenuImg id="top-menu-img" v-if="tpp === ''"></TopMenuImg>

  <el-menu id="menu" class="menu" @open="menuUnfold" mode="horizontal" :default-active=$route.path :ellipsis="false"
    router="true">
    <div class="logo">
      <Image url="https://cdn.qianshi.fun/favicon.png?auth_key=1741881534-0-0-b53b6ef7f0d3c2756aa3f777d5ed8a8e" :w="40"
        :h="40"></Image>
    </div>

    <el-menu-item v-blur index="/">首页</el-menu-item>
    <el-menu-item v-blur index="/hot">热门</el-menu-item>
    <el-sub-menu index="/region" :popper-offset="-10">
      <template #title>分区</template>
      <span v-loading="regionLoading" v-show="store.regions.length === 0" class="no-region">暂无分区</span>
      <el-menu-item v-show="store.regions.length !== 0" v-for="r in store.regions" :index="`/region/${r.slug}`">{{
    r.name
  }}</el-menu-item>
    </el-sub-menu>
    <el-menu-item v-blur index="/read">专栏</el-menu-item>
    <el-menu-item v-blur index="/live">直播</el-menu-item>

    <div class="flex-grow" />

    <div class="search-bar">
      <el-input @keyup.enter.native="toSearch" id="search" v-model="searchKey" class="search" placeholder="搜索"
        clearable>

        <template #prefix><el-icon @click="toSearch" style="cursor: pointer;">
            <search />
          </el-icon></template>
      </el-input>
    </div>

    <div class="flex-grow" />

    <el-popover ref="loginPop" :width="400">

      <template #reference>
        <div @click="openLoginWindow('')" v-if="!isLogin" class="login-btn">登录</div>
      </template>
      <div class="before-login-pop">
        <div class="info1">登录后你可以：</div>
        <div class="good">免费看高清视频</div>
        <div class="good">同步播放记录</div>
        <div class="good">发表弹幕/评论</div>
        <el-button v-blur @click="openLoginWindow('')" class="pop-login-btn" type="primary">立即登录</el-button>
        <div class="info2">首次使用？<span @click="openLoginWindow('')" class="register-span">点我注册</span></div>
      </div>
    </el-popover>

    <LoginWindow ref="loginWindow"></LoginWindow>

    <div v-if="isLogin" class="after-login-menu">
      <el-popover @show="getMeAvatarHover" :width="250" ref="avatarPop" :show-arrow=false>

        <template #reference>
          <Avatar v-model="avatar" size="medium" :home="{ uid: ahi.id }">
          </Avatar>
        </template>
        <div v-loading="ahiLoading" style="position: relative;">
          <el-button v-blur @click="signin" :type="!ahi.signinStatus ? 'success' : 'info'"
            :style="{ cursor: !ahi.signinStatus ? 'pointer' : 'not-allowed' }" class="signin"
            size="small">签到</el-button>
          <ul class="almul">
            <div class="nickname">
              <span @click="cmjs.jump.user(ahi.id)" class="nickname-span">{{ ahi.nickname }}</span>
            </div>
            <div class="tags">
              <VipIco v-if="ahi.isVip" style="margin-right: 5px;"></VipIco>
              <LevelIco :level="ahi.level"></LevelIco>
            </div>
            <div class="coin-row">
              <span @click="cmjs.jump.new('/me/coin')">硬币:<span class="coin">{{ ahi.coin }}</span></span>
            </div>
            <div class="num-container">
              <div class="num">
                <div class="number" @click="cmjs.jump.follow(ahi.id)">{{ cmjs.fmt.numWE(ahi.followNum) }}</div>
                <div class="text">关注</div>
              </div>
              <div class="num">
                <div class="number" @click="cmjs.jump.fan(ahi.id)">{{ cmjs.fmt.numWE(ahi.fanNum) }}</div>
                <div class="text">粉丝</div>
              </div>
              <div class="num">
                <div class="number" @click="cmjs.jump.dynamic(ahi.id)">{{ cmjs.fmt.numWE(ahi.dynamicNum) }}</div>
                <div class="text">动态</div>
              </div>
            </div>
            <li @click="cmjs.jump.new('/manage')" v-if="ahi.power > 0">后台管理</li>
            <li @click="cmjs.jump.new('/me')">个人中心</li>
            <li @click="logout">退出登录</li>
          </ul>
        </div>
      </el-popover>

      <div @click="cmjs.jump.new('/vip')" class="ico-btn">
        <el-button v-blur class="iconfont el-icon-vip ico" circle></el-button>
        <div class="notice">会员</div>
      </div>

      <el-popover :show-arrow=false>
        <template #reference>
          <div class="ico-btn" style="margin-top: 1px;">
            <el-button v-blur circle><el-badge :value="newMessageNum" :max="99" :show-zero="false"><el-icon class="ico">
                  <Message />
                </el-icon></el-badge></el-button>
            <div class="notice">消息</div>
          </div>
        </template>
        <ul class="almul"> <!--after login menu ul-->
          <li>回复我的</li>
          <li>@我的</li>
          <li>收到的赞</li>
          <li>系统消息</li>
          <li>我的消息</li>
        </ul>
      </el-popover>

      <div @click="cmjs.jump.new('/dynamic')" class="ico-btn" style="margin-top: 1px;">
        <el-button v-blur circle><el-badge :value="newDynamicNum" :max="99" :show-zero="false"><el-icon
              class="iconfont el-icon-fengche ico"></el-icon></el-badge></el-button>
        <div class="notice">动态</div>
      </div>

      <div @click="cmjs.jump.favlist(cmjs.biz.getUid())" class="ico-btn">
        <el-button v-blur circle><el-icon class="ico">
            <Star />
          </el-icon></el-button>
        <div class="notice">收藏</div>
      </div>

      <div @click="cmjs.jump.new('/history')" class="ico-btn">
        <el-button v-blur circle><el-icon class="ico">
            <Clock />
          </el-icon></el-button>
        <div class="notice">历史</div>
      </div>

      <div @click="cmjs.jump.new('/platform')" style="text-align: center;" class="ico-btn">
        <el-button v-blur style="font-weight: bold;" class="iconfont el-icon-idea ico" circle></el-button>
        <div class="notice">创作中心</div>
      </div>

      <el-button v-blur @click="cmjs.jump.new('/platform/upload/video')" type="primary" class="upload-btn">
        <el-icon>
          <Upload />
        </el-icon>
        <span class="notice">投稿</span>
      </el-button>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import TopMenuImg from "@/components/once/TopMenuImg.vue"
import LoginWindow from "@/components/window/LoginWindow.vue"
import Avatar from '@/components/common/Avatar.vue'
import VipIco from '@/components/common/VipIco.vue'
import LevelIco from '@/components/common/LevelIco.vue'
import cmjs from '@/cmjs'
import { useRoute } from 'vue-router'
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import * as UserAPI from '@/api/user'
import * as VideoAPI from '@/api/video'

type AvatarHoverInfo = {
  id: number,
  nickname: string,
  isVip: boolean,
  power: number,
  level: number,
  coin: number,
  followNum: number,
  fanNum: number,
  dynamicNum: number,
  signinStatus: boolean,
}

const route = useRoute()
const store = useStore()
const { isLogin } = storeToRefs(store)
store.openLoginWindow = openLoginWindow
watch(() => store.isLogin, (newVal: boolean) => {
  if (newVal) {
    ahi.value = {
      "id": -1,
      "nickname": "",
      "isVip": false,
      "power": 0,
      "level": 1,
      "coin": 0,
      "followNum": 0,
      "fanNum": 0,
      "dynamicNum": 0,
      "signinStatus": true,
    }
  }
})

const loginWindow = ref<InstanceType<typeof LoginWindow>>()
const loginPop = ref()
const avatarPop = ref()
let topMenuImg: HTMLElement
let menu: HTMLElement
let searchInput: HTMLElement

let searchKey = ref("")
let ahi = ref<AvatarHoverInfo>({
  "id": -1,
  "nickname": "",
  "isVip": false,
  "power": 0,
  "level": 1,
  "coin": 0,
  "followNum": 0,
  "fanNum": 0,
  "dynamicNum": 0,
  "signinStatus": true,
})
let avatar = ref(cmjs.cache.getCookie('avatar'))
let tpp = ref("不能为空") // topPath
let newMessageNum = ref(0)
let newDynamicNum = ref(0)
let regionLoading = ref(false)
let ahiLoading = ref(false)

watch(() => route.path, (newPath) => {
  if (newPath === "/") {
    if (tpp.value === '') {
      topMenuImg = document.getElementById("top-menu-img") as HTMLElement
      topMenuImg.style.display = "block"
    }
    menu.style.backgroundColor = "transparent"
    menu.style.border = "none"
    searchInput.style.background = "rgba(255, 255, 255, 0.75)"
  } else {
    if (tpp.value === '') {
      topMenuImg = document.getElementById("top-menu-img") as HTMLElement
      topMenuImg.style.display = "none"
    }
    menu.style.backgroundColor = "white"
    menu.style.borderBottom = "1px solid #dedfe0"
    searchInput.style.background = "#f4f4f5"
  }
})

watch(() => store.topPath, (newPath) => {
  tpp.value = store.topPath
})

setTimeout(() => {
  tpp.value = store.topPath
}, 0)

onMounted(() => {
  menu = document.getElementById("menu") as HTMLElement
  searchInput = document.querySelector(".el-input__wrapper") as HTMLElement
  window.addEventListener('scroll', scrollListenerHandler)
})
onUnmounted(() => {
  window.removeEventListener("scroll", scrollListenerHandler)
})

function scrollListenerHandler() {
  if (route.path === "/") {
    if (document.documentElement.scrollTop > 104) {
      menu.style.backgroundColor = "white"
      menu.style.borderBottom = "1px solid #dedfe0"
      searchInput.style.background = "#f4f4f5"
    } else {
      menu.style.backgroundColor = "transparent"
      menu.style.border = "none"
      searchInput.style.background = "rgba(255, 255, 255, 0.75)"
    }
  }
  menu.style.marginLeft = -document.documentElement.scrollLeft.toString() + "px"
}

function openLoginWindow(tip?: string) {
  loginPop.value.hide()
  loginWindow.value?.show(tip)
}

function logout() {
  avatarPop.value.hide()
  cmjs.biz.clearLoginInfo()
  store.isLogin = false
  if (route.meta.needLogin) {
    cmjs.jump.error(401)
  }
}

function getMeAvatarHover() {
  if (ahi.value.id === -1) {
    ahiLoading.value = true
    UserAPI.MeAvatarHover()
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        ahi.value = res.data
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })
      .finally(() => {
        ahiLoading.value = false
      })
  }
}

function signin() {
  if (ahi.value.signinStatus) {
    cmjs.prompt.info("今日已签到，请明日再来")
    return
  }
  // TODO api
  // 后端会返回一个签到后的level，需赋值到原level中；如果新的level变大了，则提示用户已升级
  ahi.value.signinStatus = true
  ahi.value.coin += 5
  cmjs.prompt.success("签到成功")
}

function toSearch() {
  cmjs.prompt.info(`searchKey: ${searchKey.value}`)
}

store.setTopMenuBarAvatar = (avatarUrl: string) => {
  avatar.value = avatarUrl
}

store.setNewMessageNum = setNewMessageNum
function setNewMessageNum(num: number) {
  newMessageNum.value = num
}

store.setNewDynamicNum = setNewDynamicNum
function setNewDynamicNum(num: number) {
  newDynamicNum.value = num
}

store.getRegions = getRegions
async function getRegions() {
  await VideoAPI.getRegions()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      store.regions = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
}

function menuUnfold(index: string) {
  if (index === "/region") {
    if (store.regions.length === 0) {
      regionLoading.value = true
      getRegions()
    }
  }
}
</script>

<style scoped>
#top-menu-img {
  display: block;
}

.menu {
  width: 100%;
  min-width: 1280px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: none;
  background-color: transparent;
  position: fixed;
  top: 0px;
  z-index: 2000;
  /* z-index不能大于2000，否则会造成遮罩层内出现顶部菜单栏 */
}

.no-region {
  cursor: default;
  color: #909399;
}

.el-menu--horizontal>.el-menu-item.is-active,
.el-menu--horizontal>.el-menu-item,
.el-menu--horizontal>.el-sub-menu.is-active :deep(.el-sub-menu__title),
.el-menu--horizontal>.el-sub-menu :deep(.el-sub-menu__title) {
  border-bottom: none;
}

.el-sub-menu.is-active :deep(.el-sub-menu__title) {
  border-bottom-color: transparent;
}

.el-menu--horizontal>.el-menu-item,
.el-sub-menu :deep(.el-sub-menu__title) {
  margin-left: -12.5px;
  margin-right: -12.5px;
}

.el-menu-item:hover,
.el-sub-menu:hover,
.el-sub-menu :deep(.el-sub-menu__title:hover) {
  background-color: transparent !important;
}

.el-sub-menu {
  width: 55px;
}

.logo {
  margin-right: 10px;
}

.search {
  width: 300px;
}

:deep(.search-bar .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 10px;
}

.login-btn {
  width: 40px;
  height: 40px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}

.before-login-pop {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  cursor: default;
}

.before-login-pop .info1 {
  width: 100%;
  font-weight: bold;
}

.before-login-pop .good {
  font-size: 16px;
}

.before-login-pop .pop-login-btn {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.before-login-pop .register-span {
  color: #409EFF;
  cursor: pointer;
}

.before-login-pop .register-span:hover {
  color: #79bbff;
}

.after-login-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signin {
  position: absolute;
  width: 30px;
  height: 20px;
  right: 0;
  top: 7px;
}

.almul {
  list-style: none;
  margin: -7px;
  padding: 0;
}

.almul .nickname {
  text-align: center;
  font-size: 20px;
  line-height: 20px;
}

.almul .tags {
  text-align: center;
  margin-top: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.almul .nickname-span:hover {
  color: #409EFF;
  cursor: pointer;
}

.almul .coin-row {
  text-align: center;
  font-size: 12px;
  cursor: default;
  color: #909399;
  margin-top: -5px;

  .coin {
    color: black;
    cursor: pointer;
  }

  .coin:hover {
    color: #409EFF;
  }
}

.almul .num-container {
  width: 100%;
  height: 35px;
  display: flex;
  padding-top: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dedfe0;
}

.almul .num-container .num {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.almul .num-container .num .number {
  font-size: 16px;
  color: black;
  cursor: pointer;
}

.almul .num-container .num .number:hover {
  color: #409EFF;
}

.almul .num-container .num .text {
  font-size: 12px;
  color: #909399;
  cursor: default;
}

.almul li {
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.almul li:hover {
  background-color: #e9e9eb;
}

.ico-btn:hover {
  font-size: 30px;
  cursor: pointer;
  /*让功能按钮向下垂一点*/
}

.ico-btn .el-button {
  border: none;
  font-size: 25px;
  background-color: transparent;
}

.ico-btn .el-button:hover {
  background-color: transparent;
}

.ico-btn .notice {
  text-align: center;
  font-size: 13.5px;
}

.ico-btn .notice,
.ico-btn .ico {
  color: #303133;
}

.upload-btn {
  font-size: 17.5px;
  border-radius: 7.5px;
}

.upload-btn .notice {
  font-size: 13.5px;
}
</style>

<style>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 70px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-menu--popup {
  padding: 0;
}
</style>