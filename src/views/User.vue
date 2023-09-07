<template>
  <div class="container">
    <img style="width: 1140px; height: 180px;" :src="`/userhome-top-img/${user.topImgNo}.png`">

    <div v-if="isMe" @click="replaceTopImg" class="replace-top-img">更换头图</div>

    <el-drawer v-model="replaceTopImgDrawerShow" title="头图" :direction="'btt'" :modal="false" :show-close="false"
      :size="'338px'">
      <template #default>
        <div class="top-img-container">
          <div style="text-align: center;">
            <img :style="{ cursor: user.topImgNo === 1 ? 'not-allowed' : 'pointer' }" @click="user.topImgNo = 1"
              class="top-img mr10 mb10" src="/userhome-top-img/1.png">
            <img :style="{ cursor: user.topImgNo === 2 ? 'not-allowed' : 'pointer' }" @click="user.topImgNo = 2"
              class="top-img ml10 mb10" src="/userhome-top-img/2.png">
          </div>
          <div style="text-align: center;">
            <img :style="{ cursor: user.topImgNo === 3 ? 'not-allowed' : 'pointer' }" @click="user.topImgNo = 3"
              class="top-img mr10 mt10" src="/userhome-top-img/3.png">
            <img :style="{ cursor: user.topImgNo === 4 ? 'not-allowed' : 'pointer' }" @click="user.topImgNo = 4"
              class="top-img ml10 mt10" src="/userhome-top-img/4.png">
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="cancelTopImg">取消</el-button>
        <el-button @click="saveTopImg">保存</el-button>
      </template>
    </el-drawer>

    <div class="info">
      <Image @recImgUrl="recImgUrl" uploadUrl="/api/resource/avatar" :url="user.avatarUrl" w="60" h="60" avatar></Image>

      <div class="right">
        <div class="head-row">
          <span class="nickname">{{ user.nickname }}</span>
          <span v-show="user.gender === '男'" style="color: #a0cfff;" class="iconfont el-icon-male gender"></span>
          <span v-show="user.gender === '女'" style="color: #ff6699;" class="iconfont el-icon-female gender"></span>
          <svg @click="common.ToNewPage('/me')" class="icon-symbol level" aria-hidden="true">
            <use :xlink:href="'#el-icon-level_' + user.level"></use>
          </svg>
          <span v-if="user.isVip" class="vip">会员</span>
          <span class="ip-container">
            <span class="iconfont el-icon-ip ip"></span>
            <span>IP属地：{{ user.ipLocation }}</span>
          </span>
        </div>
        <input ref="signatureInput" @blur="saveSignature" :readonly="isMe ? false : true"
          :class="{ 'signature-row-me': isMe, 'signature-row': !isMe }" :placeholder="isMe ? '编辑个性签名' : ''"
          v-model="user.signature" />
      </div>
    </div>

    <div v-if="!isMe" class="btns">
      <el-button @click="focu">{{ focuBtnInnerText }}</el-button>
      <el-button @click="sendMessage">发消息</el-button>
    </div>

    <el-card class="menu-container">
      <el-menu class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
        <el-menu-item :index="`/u/${$route.params.uid}`">主页</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/dynamic`">动态</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/post`">投稿<span class="n">{{ user.postNum }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/collection`">合集<span class="n">{{ user.collectionNum }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/favlist`">收藏<span class="n">{{ user.favlistNum }}</span></el-menu-item>
        <el-menu-item v-if="isMe" :index="`/u/${$route.params.uid}/setting`">设置</el-menu-item>

        <div class="search-container">
          <el-input v-model="searchKey" class="search" placeholder="搜索视频、动态" clearable>
            <template #prefix><el-icon style="cursor: pointer;">
                <search />
              </el-icon></template>
          </el-input>
        </div>

        <div class="flex-grow" />

        <div class="num-container">
          <div class="num-box">
            <div class="num-span">关注数</div>
            <div :title="(user.focuNum).toString()" class="num focu-num">{{
              common.numFormatterW(user.focuNum) }}</div>
          </div>
          <div class="num-box">
            <div class="num-span">粉丝数</div>
            <div :title="(user.fanNum).toString()" class="num fan-num">{{
              common.numFormatterW(user.fanNum) }}</div>
          </div>
          <div class="num-box">
            <div class="num-span">获赞数</div>
            <div :title="(user.likeNum).toString()" class="num">{{ common.numFormatterW(user.likeNum) }}
            </div>
          </div>
          <div class="num-box">
            <div class="num-span">播放数</div>
            <div :title="(user.playNum).toString()" class="num">{{ common.numFormatterW(user.playNum) }}
            </div>
          </div>
          <div class="num-box">
            <div class="num-span">阅读数</div>
            <div :title="(user.readNum).toString()" class="num">{{ common.numFormatterW(user.readNum) }}
            </div>
          </div>
        </div>
      </el-menu>
    </el-card>

    <router-view style="margin-bottom: 20px; margin-left: -1px; margin-right: -1px;"></router-view>
  </div>
</template>

<script setup lang="ts">
import * as common from "../common"
import { ElMessage } from 'element-plus'
import mockUser from "../mock/user.json"
import { useStore } from "../store"
import { storeToRefs } from "pinia"

type User = {
  uid: number
  nickname: string
  signature: string
  avatarUrl: string
  gender: string
  level: number
  isVip: boolean
  ipLocation: string
  topImgNo: number
  isFocu: boolean
  postNum: number
  collectionNum: number
  favlistNum: number
  focuNum: number
  fanNum: number
  likeNum: number
  playNum: number
  readNum: number
}

let user = ref<User>(getUser())
document.title = user.value.nickname + "的个人空间 - 浅时"

const store = useStore()
let { isLogin } = storeToRefs(store)
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = common.isMe(user.value.uid)
    user.value = getUser()
  } else {
    isMe.value = false
    user.value = getUser()
  }
})

store.addUserMenuCollectionNum = addMenuCollectionNum
store.addUserMenuFavlistNum = addMenuFavlistNum

const signatureInput = ref<HTMLInputElement>()

let isMe = ref(common.isMe(user.value.uid))
let searchKey = ref("")
let oldTopImgNo = ref(1)
let replaceTopImgDrawerShow = ref(false)
let focuBtnInnerText = ref(!user.value.isFocu ? "关注" : "已关注")

function getUser() {
  return mockUser //TODO
}

function recImgUrl(imgUrl: string) {
  user.value.avatarUrl = imgUrl
}

function saveSignature() {
  user.value.signature = user.value.signature.trim()
  if (user.value.signature.length > 50) {
    common.showInfo("签名的长度最大为50，超出部分已自动选中")
    signatureInput.value!.focus()
    signatureInput.value!.setSelectionRange(50, user.value.signature.length)
  }
}

function replaceTopImg() {
  replaceTopImgDrawerShow.value = true;
  oldTopImgNo.value = user.value.topImgNo
}

function cancelTopImg() {
  replaceTopImgDrawerShow.value = false
  user.value.topImgNo = oldTopImgNo.value
}

function saveTopImg() {
  //TODO api
  replaceTopImgDrawerShow.value = false
}

function focu() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (isMe) {
    common.showInfo("不能关注自己")
    return
  }
  if (!user.value.isFocu) {
    user.value.isFocu = true
    focuBtnInnerText.value = "已关注"
  } else {
    user.value.isFocu = false
    focuBtnInnerText.value = "关注"
  }
}

function sendMessage() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  alert("敬请期待")
}

function openLoginWindow() {
  ElMessage({
    "message": "请登录后再操作",
    "offset": 77,
    "customClass": "zIndex999",
  })
  store.openLoginWindow()
}

function addMenuCollectionNum(incr: number) {
  user.value.collectionNum += incr
}

function addMenuFavlistNum(incr: number) {
  user.value.favlistNum += incr
}
</script>

<style scoped>
.container {
  width: 1140px;
  margin-inline: auto;
  display: flex;
  margin-top: 57px;
  flex-direction: column;
}

.replace-top-img {
  position: absolute;
  margin-top: 10px;
  margin-left: 1082px;
  width: 49px;
  cursor: pointer;
  color: white;
  font-size: 12px;
}

.top-img-container {
  display: flex;
  flex-direction: column;
  width: 1140px;
  margin-inline: auto;
  margin-top: -20px;
  margin-bottom: -20px;
}

.top-img {
  width: calc(50% - 16px);
  border: 3px solid #909399;
  border-radius: 10px;
}

.info {
  position: absolute;
  top: 155px;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.btns {
  position: absolute;
  margin-top: 128px;
  margin-left: 960px;
  width: 160px;
}

.btns .el-button {
  background: rgba(0, 0, 0, 0.25);
  color: white;
  border: 1px solid #c8c9cc;
  width: 74px;
}

.btns .el-button:hover {
  background: rgba(0, 0, 0, 0.5);
}

.info .right {
  margin-left: 10px;
}

.info .right .head-row {
  display: flex;
  align-items: center;
}

.info .right .nickname {
  color: #f4f4f5;
  font-size: 20px;
}

.info .right .gender {
  margin-left: 5px;
}

.info .right .level {
  font-size: 27.5px;
  margin-left: 5px;
  cursor: pointer;
}

.info .right .vip {
  background-color: #FF6699;
  color: white;
  padding: 1px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 12px;
  margin-left: 5px;
  cursor: pointer;
}

.info .right .ip-container {
  color: #dedfe0;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: default;
}

.info .right .ip {
  color: #dedfe0;
  margin-left: 5px;
}

.info .right .signature-row,
.signature-row-me {
  color: #dedfe0;
  font-size: 12px;
  background: none;
  border: none;
  padding: 5px;
  outline: none;
  width: 630px;
  margin-left: -5px;
  border-radius: 5px;
}

.info .right .signature-row::placeholder,
.signature-row-me::placeholder {
  color: #dedfe0;
}

.signature-row-me:hover {
  background: rgba(255, 255, 255, 0.25);
}

.signature-row-me:focus {
  background-color: white;
  color: #303133;
}

.menu-container {
  margin-left: -1px;
  margin-right: -1px;
  margin-bottom: 10px;
}

.menu {
  border-bottom: none;
  margin: -20px;
}

.menu .n {
  color: #909399;
  font-size: 12px;
  margin-left: 3px;
}

.el-menu-item:focus {
  background-color: transparent !important;
  color: inherit !important;
}

.search-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.search {
  height: 30px;
  width: 225px;
}

.num-container {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-right: 10px;
}

.num-box {
  margin-right: 10px;
  text-align: center;
  cursor: default;
}

.num-box .num-span {
  color: #909399;
}

.num-box .num {
  text-align: center;
  margin-top: 5px;
}

.num-box .focu-num:hover,
.num-box .fan-num:hover {
  color: #409EFF;
  cursor: pointer;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dedfe0 inset !important;
  border-radius: 10px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c8c9cc inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF inset !important
}
</style>