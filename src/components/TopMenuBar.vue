<template>
  <TopMenuImg id="top-menu-img"></TopMenuImg>

  <el-menu id="menu" class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
    <div class="logo">
      <img class="icon" src="../../public/favicon.png">
      <span class="notice">浅时</span>
    </div>

    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/hot">热门</el-menu-item>
    <el-sub-menu>
      <template #title>分区</template>
      <el-menu-item index="/region/anime">番剧</el-menu-item>
      <el-menu-item index="/region/game">游戏</el-menu-item>
      <el-menu-item index="/region/music">音乐</el-menu-item>
      <el-menu-item index="/region/tech">科技</el-menu-item>
      <el-menu-item index="/region/other">其它</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/read">专栏</el-menu-item>
    <el-menu-item index="/live">直播</el-menu-item>

    <div class="flex-grow" />

    <div class="search-bar">
      <el-input @keyup.enter.native="toSearch" id="search" v-model="searchKey" class="search" placeholder="搜索" clearable>
        <template #prefix><el-icon style="cursor: pointer;">
            <search />
          </el-icon></template>
      </el-input>
    </div>

    <div class="flex-grow" />

    <el-popover ref="loginPop" :width="400">
      <template #reference>
        <div @click="openLoginWindow()" v-if="!isLogin" class="login-btn">登录</div>
      </template>
      <div class="before-login-pop">
        <div class="info1">登录后你可以：</div>
        <div class="good">免费看高清视频</div>
        <div class="good">同步播放记录</div>
        <div class="good">发表弹幕/评论</div>
        <el-button @click="openLoginWindow()" class="pop-login-btn" type="primary">立即登录</el-button>
        <div class="info2">首次使用？<span @click="openLoginWindow()" class="register-span">点我注册</span></div>
      </div>
    </el-popover>

    <LoginWindow ref="loginWindow"></LoginWindow>

    <div v-if="isLogin" class="after-login-menu">
      <el-popover :width="250" @show="onAvatarPopShow" ref="avatarPop" :show-arrow=false>
        <template #reference>
          <el-avatar @click="toHome" class="avatar" :src="avatarUrl" @error="true">
            <img @click="toHome" src="../../public/default-avatar.png" />
          </el-avatar>
        </template>
        <el-button @click="signin" :type="!signinStatus ? 'success' : 'info'"
          :style="{ cursor: !signinStatus ? 'pointer' : 'not-allowed' }" class="signin" size="small">签到</el-button>
        <ul class="almul">
          <div class="nickname">
            <span @click="toHome" class="nickname-span">{{ ahi.nickname }}</span>
          </div>
          <div class="tags">
            <span v-show="ahi.isVip" class="vip">会员</span>
            <svg @click="common.ToNewPage('/me')" class="icon-symbol level" aria-hidden="true">
              <use :xlink:href="'#el-icon-level_' + ahi.level"></use>
            </svg>
          </div>
          <div class="currency">
            <span>硬币:<span style="color: black;">{{ ahi.coin }}</span></span>
          </div>
          <div class="num-container">
            <div class="num">
              <div class="number">{{ common.numFormatterW(ahi.focuNum) }}</div>
              <div class="text">关注</div>
            </div>
            <div class="num">
              <div class="number">{{ common.numFormatterW(ahi.fanNum) }}</div>
              <div class="text">粉丝</div>
            </div>
            <div class="num">
              <div class="number">{{ common.numFormatterW(ahi.trendNum) }}</div>
              <div class="text">动态</div>
            </div>
          </div>
          <li v-if="ahi.power > 0">后台管理</li>
          <li @click="common.ToNewPage('/me')">个人中心</li>
          <li @click="logout">退出登录</li>
        </ul>
      </el-popover>

      <div class="ico-btn">
        <el-button class="iconfont el-icon-vip ico" circle></el-button>
        <div class="notice">会员</div>
      </div>

      <el-popover :show-arrow=false>
        <template #reference>
          <div class="ico-btn">
            <el-button circle><el-icon class="ico">
                <Message />
              </el-icon></el-button>
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

      <div class="ico-btn">
        <el-button class="iconfont el-icon-fengche ico" circle></el-button>
        <div class="notice">动态</div>
      </div>

      <div class="ico-btn">
        <el-button circle><el-icon class="ico">
            <Star />
          </el-icon></el-button>
        <div class="notice">收藏</div>
      </div>

      <div class="ico-btn">
        <el-button circle><el-icon class="ico">
            <Clock />
          </el-icon></el-button>
        <div class="notice">历史</div>
      </div>

      <div @click="common.ToNewPage('/platform')" style="text-align: center;" class="ico-btn">
        <el-button style="font-weight: bold;" class="iconfont el-icon-idea ico" circle></el-button>
        <div class="notice">创作中心</div>
      </div>

      <el-button @click="common.ToNewPage('/platform/upload/video')" type="primary" class="upload-btn">
        <el-icon>
          <Upload />
        </el-icon>
        <span class="notice">投稿</span>
      </el-button>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import TopMenuImg from "./TopMenuImg.vue"
import LoginWindow from "./LoginWindow.vue"
import * as common from "../common"
import { useRoute } from 'vue-router'
import { useStore } from "../store"
import { storeToRefs } from "pinia"

type AvatarHoverInfo = {
  nickname: string,
  isVip: boolean,
  level: number,
  coin: number,
  focuNum: number,
  fanNum: number,
  trendNum: number,
  power: number,
}

const route = useRoute()
const store = useStore()
const { isLogin } = storeToRefs(store)
store.openLoginWindow = openLoginWindow

const loginWindow = ref<InstanceType<typeof LoginWindow>>()
const loginPop = ref()
const avatarPop = ref()
let topMenuImg: HTMLElement
let menu: HTMLElement
let searchInput: HTMLElement

let searchKey = ref("")
let avatarUrl = ref(localStorage.getItem("avatarUrl"))
let ahi: AvatarHoverInfo = reactive({
  "nickname": "null",
  "isVip": false,
  "level": 1,
  "coin": 0,
  "focuNum": 0,
  "fanNum": 0,
  "trendNum": 0,
  "power": 5,
})
let signinStatus = ref(true)

watch(() => route.path, (newPath) => {
  if (newPath === "/") {
    topMenuImg.style.display = "block"
    menu.style.backgroundColor = "transparent"
    menu.style.border = "none"
    searchInput.style.background = "rgba(255, 255, 255, 0.75)"
  } else {
    topMenuImg.style.display = "none"
    menu.style.backgroundColor = "white"
    menu.style.borderBottom = "1px solid #dedfe0"
    searchInput.style.background = "#f4f4f5"
  }
})

onMounted(() => {
  topMenuImg = document.getElementById("top-menu-img") as HTMLElement
  if (location.pathname === "/") {
    topMenuImg.style.display = "block"
  }
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

function openLoginWindow() {
  loginPop.value.hide()
  loginWindow.value?.show((au: string) => {
    avatarUrl.value = au
  })
}

function clearLoginStorage() {
  localStorage.removeItem("uid")
  localStorage.removeItem("nickname")
  localStorage.removeItem("avatarUrl")
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
}

function logout() {
  avatarPop.value.hide()
  clearLoginStorage()
  store.isLogin = false
}

function onAvatarPopShow() {
  //<!--TODO
  signinStatus.value = false
  ahi.nickname = "Bonnenult"
  ahi.isVip = true
  ahi.level = 6
  ahi.coin = 233
  ahi.focuNum = 6
  ahi.fanNum = 2377801
  ahi.trendNum = 101
  //-->
}

function signin() {
  if (signinStatus.value) {
    common.showInfo("今日已签到，请明日再来")
    return
  }
  signinStatus.value = true
  ahi.coin += 5 //TODO
  common.showSuccess("签到成功")
}

function toHome() {
  let uid = localStorage.getItem("uid")
  if (uid) {
    common.ToUser(parseInt(uid))
  }
}

function toSearch() {
  alert(`searchKey: ${searchKey.value}`)
}
</script>

<style scoped>
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
  z-index: 2000; /* z-index不能大于2000，否则会造成遮罩层内出现顶部菜单栏 */
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

.el-menu-item:focus {
  background-color: transparent !important;
  color: inherit !important;
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

.logo .icon {
  width: 37.5px;
  vertical-align: top;
}

.logo .notice {
  font-size: 30px;
  cursor: default;
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
}

.signin {
  position: absolute;
  width: 30px;
  height: 20px;
  left: calc(100% - 40px);
}

.almul {
  list-style: none;
  margin: -7px;
  padding: 0;
}

.almul .level {
  font-size: 27.5px;
  cursor: pointer;
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

.almul .tags .vip {
  font-size: 12px;
  background-color: #FF6699;
  color: white;
  line-height: 12px;
  padding: 1px;
  margin-right: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.almul .nickname-span:hover {
  color: #409EFF;
  cursor: pointer;
}

.almul .currency {
  text-align: center;
  font-size: 12px;
  cursor: default;
  color: #909399;
  margin-top: -5px;
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
}

.almul .num-container .num .number:hover {
  cursor: pointer;
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

.avatar {
  margin-right: 10px;
  cursor: pointer;
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
  margin-left: 10px;
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
  margin-bottom: -1px !important;
}
</style>