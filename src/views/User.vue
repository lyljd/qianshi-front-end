<template>
  <div class="container">
    <img style="width: 1140px; height: 180px;" :src="user.topImg">

    <div v-if="isMe" @click="replaceTopImg" class="replace-top-img">更换头图</div>

    <el-drawer v-model="replaceTopImgDrawerShow" title="头图" :direction="'btt'" :modal="false" :show-close="false"
      size="auto">
      <template #default>
        <div class="top-img-container">
          <img v-for="ti in topImgs" :src="ti" @click="user.topImg = ti"
            :style="{ cursor: user.topImg === ti ? 'not-allowed' : 'pointer' }" class="top-img">
        </div>
      </template>
      <template #footer>
        <el-button v-blur @click="cancelTopImg">取消</el-button>
        <el-button v-blur @click="saveTopImg">保存</el-button>
      </template>
    </el-drawer>

    <div class="info">
      <Image @recImgUrl="recImgUrl" :uploadUrl="isMe ? '/api/resource/avatar' : ''" :url="user.avatarUrl" w="60" h="60"
        avatar></Image>

      <div class="right">
        <div class="head-row">
          <span class="nickname">{{ user.nickname }}</span>
          <span v-show="user.gender === '男'" style="color: #a0cfff;" class="iconfont el-icon-male gender"></span>
          <span v-show="user.gender === '女'" style="color: #ff6699;" class="iconfont el-icon-female gender"></span>
          <svg @click="cmjs.jump.new('/me')" class="icon-symbol level" aria-hidden="true">
            <use :xlink:href="'#el-icon-level_' + user.level"></use>
          </svg>
          <VipIco v-if="user.isVip" style="margin-left: 5px;"></VipIco>
          <span class="ip-container">
            <span class="iconfont el-icon-ip ip"></span>
            <span>IP属地：{{ user.ipLocation }}</span>
          </span>
        </div>
        <input ref="signatureInput" @blur="saveSignature" :readonly="isMe ? false : true"
          :class="{ 'signature-row-me': isMe, 'signature-row': !isMe }" :placeholder="isMe ? '编辑个性签名' : ''"
          v-model="signature" />
      </div>
    </div>

    <div v-if="!isMe" class="btns">
      <el-button v-blur @click="focu">{{ !user.isFocu ? "关注" : "已关注" }}</el-button>
      <el-button v-blur @click="sendMessage">发消息</el-button>
    </div>

    <el-card class="menu-container">
      <el-menu class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
        <el-menu-item :index="`/u/${$route.params.uid}`">主页</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/dynamic`">动态</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/post`">投稿<span class="n">{{ user.postNum }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/collection`">合集<span class="n">{{ user.collectionNum
        }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/favlist`">收藏<span class="n">{{ user.favlistNum
        }}</span></el-menu-item>
        <el-menu-item v-if="isMe" :index="`/u/${$route.params.uid}/setting`">设置</el-menu-item>

        <div class="search-container">
          <el-input v-model="searchKey" @keyup.enter.native="toSearch" class="search" placeholder="搜索视频、动态" clearable>
            <template #prefix><el-icon style="cursor: pointer;">
                <search />
              </el-icon></template>
          </el-input>
        </div>

        <div class="flex-grow" />

        <div class="num-container">
          <div class="num-box">
            <div class="num-span">关注数</div>
            <div :title="(user.focuNum).toString()" @click="cmjs.jump.follow(uid)" class="num focu-num">{{
              cmjs.fmt.numWE(user.focuNum) }}</div>
          </div>
          <div class="num-box">
            <div class="num-span">粉丝数</div>
            <div :title="(user.fanNum).toString()" @click="cmjs.jump.fan(uid)" class="num fan-num">{{
              cmjs.fmt.numWE(user.fanNum) }}</div>
          </div>
          <div class="num-box">
            <div class="num-span">获赞数</div>
            <div :title="(user.likeNum).toString()" class="num">{{ cmjs.fmt.numWE(user.likeNum) }}
            </div>
          </div>
          <div class="num-box">
            <div class="num-span">播放数</div>
            <div :title="(user.playNum).toString()" class="num">{{ cmjs.fmt.numWE(user.playNum) }}
            </div>
          </div>
          <div class="num-box">
            <div class="num-span">阅读数</div>
            <div :title="(user.readNum).toString()" class="num">{{ cmjs.fmt.numWE(user.readNum) }}
            </div>
          </div>
        </div>
      </el-menu>
    </el-card>

    <router-view style="margin-bottom: 20px; margin-left: -1px; margin-right: -1px;"></router-view>
  </div>
</template>

<script setup lang="ts">
import VipIco from '@/components/common/VipIco.vue'
import cmjs from '@/cmjs'
import mockUser from "@/mock/user.json"
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import { onBeforeRouteUpdate, useRoute } from "vue-router"

type User = {
  uid: number
  nickname: string
  signature: string
  avatarUrl: string
  gender: string
  level: number
  isVip: boolean
  ipLocation: string
  topImg: string
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

const route = useRoute()

const uid = parseInt(route.params.uid as string)
let user = ref<User>(getUser())
document.title = user.value.nickname + "的个人空间 - 浅时"

onBeforeRouteUpdate((to, from, next) => {
  document.title = user.value.nickname + "的个人空间 - 浅时"
  next()
})

const store = useStore()
let { isLogin } = storeToRefs(store)
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = cmjs.biz.verifyLoginUid(uid)
    user.value = getUser()
  } else {
    isMe.value = false
    user.value = getUser()
  }
})

store.setUserMenuPostNum = setMenuPostNum
store.setUserMenuCollectionNum = setMenuCollectionNum
store.setUserMenuFavlistNum = setMenuFavlistNum

const signatureInput = ref<HTMLInputElement>()
const topImgs: string[] = [
  "/userhome-top-img/1.png",
  "/userhome-top-img/2.png",
  "/userhome-top-img/3.png",
  "/userhome-top-img/4.png",
]

let isMe = ref(cmjs.biz.verifyLoginUid(uid))
let signature = ref(user.value.signature)
let searchKey = ref("")
let oldTopImg = ref("")
let replaceTopImgDrawerShow = ref(false)

function getUser() {
  return mockUser //TODO
}

function recImgUrl(imgUrl: string) {
  user.value.avatarUrl = imgUrl
}

function saveSignature() {
  signature.value = signature.value.trim()
  if (signature.value.length > 50) {
    cmjs.prompt.info("签名的长度最大为50，超出部分已自动选中")
    signatureInput.value!.focus()
    signatureInput.value!.setSelectionRange(50, signature.value.length)
  } else if (signature.value !== user.value.signature) {
    // TODO api
    user.value.signature = signature.value
    cmjs.prompt.success('保存成功')
  }
}

function replaceTopImg() {
  replaceTopImgDrawerShow.value = true;
  oldTopImg.value = user.value.topImg
}

function cancelTopImg() {
  replaceTopImgDrawerShow.value = false
  user.value.topImg = oldTopImg.value
}

function saveTopImg() {
  //TODO api
  replaceTopImgDrawerShow.value = false
}

function focu() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }
  if (isMe) {
    cmjs.prompt.info("不能关注自己")
    return
  }

  // TODO api
  user.value.isFocu = !user.value.isFocu
  cmjs.prompt.success(`${user.value.isFocu ? '关注' : '取关'}成功`)
}

function sendMessage() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }
  cmjs.prompt.info("敬请期待")
}

function setMenuPostNum(newNum: number) {
  user.value.postNum = newNum
}

function setMenuCollectionNum(newNum: number) {
  user.value.collectionNum = newNum
}

function setMenuFavlistNum(newNum: number) {
  user.value.favlistNum = newNum
}

function toSearch() {
  cmjs.prompt.info(`searchKey: ${searchKey.value}`)
}
</script>

<style lang="less" scoped>
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
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px;
}

:deep(.el-drawer__body) {
  padding: 0;
}

:deep(.el-drawer__footer) {
  padding: 20px;
}
</style>