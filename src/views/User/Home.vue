<template>
  <div class="home-container">
    <div class="left">
      <el-card>
        <template #header>
          <div class="header">
            <span>投币的视频 {{ coinVideoTotalNum }}</span>
            <el-button v-blur v-if="coinVideoTotalNum > 6">更多</el-button>
          </div>
        </template>
        <div v-if="coinVideoNum > 0" class="video-card-container">
          <VideoCard v-for=" in coinVideoNum" :data="mockVideo" type="small" class="video-card"></VideoCard>
        </div>
        <el-empty v-else description="暂无视频" />
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>点赞的视频 {{ likeVideoTotalNum }}</span>
            <el-button v-blur v-if="likeVideoTotalNum > 6">更多</el-button>
          </div>
        </template>
        <div v-if="likeVideoNum > 0" class="video-card-container">
          <VideoCard v-for=" in likeVideoNum" :data="mockVideo" type="small" class="video-card"></VideoCard>
        </div>
        <el-empty v-else description="暂无视频" />
      </el-card>
    </div>

    <div class="right">
      <el-card v-if="userHome.title != '' || isMe">
        <template #header>
          <div class="header">
            <span>个人认证</span>
            <div v-if="isMe">
              <el-button v-blur @click="apply" v-if="userHome.applyTitle === ''">{{ userHome.title === "" ? "申请" : "重新申请"
              }}</el-button>
              <div v-else>
                <el-tooltip :content="userHome.applyTitle" placement="top">
                  <span class="iconfont el-icon-info"
                    style="font-size: 14px; margin-right: 10px; cursor: default;">申请中</span>
                </el-tooltip>
                <el-button v-blur @click="cancelApply">取消申请</el-button>
              </div>
            </div>
          </div>
        </template>
        <span v-if="userHome.title !== ''" class="iconfont el-icon-renzheng title">{{ userHome.title }}</span>
        <el-empty v-else style="padding: 0;" description="暂无称号" :image-size="100" />
      </el-card>

      <el-card v-if="userHome.notice != '' || isMe" header="公告">
        <div :class="{ 'space-notice-gap': isMe }">
          <textarea :class="{ 'space-notice-me': isMe, 'space-notice': !isMe }" v-model="userHome.notice"
            :readonly="isMe ? false : true" ref="noticeTextarea" @blur="saveSpaceNotice"
            placeholder="编辑我的空间公告"></textarea>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>个人资料</span>
            <el-button v-blur @click="toMeSetting" v-if="isMe">修改资料</el-button>
          </div>
        </template>
        <div class="info-row">
          <div class="item">
            <span class="span">UID</span>
            <span class="value">{{ userHome.uid }}</span>
          </div>
          <div class="item">
            <span class="span">生日</span>
            <span class="value">{{ userHome.birthday }}</span>
          </div>
        </div>
        <div class="tag-row">
          <div v-for="(item) in userHome.tag" class="tag">
            <span class="iconfont el-icon-tag"></span>{{ item }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import VideoCard from '@/components/common/VideoCard.vue'
import { ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { useStore } from "@/store"
import mockUserHome from "@/mock/user/home.json"

type UserHome = {
  title: string
  applyTitle: string
  notice: string
  uid: number
  birthday: string
  tag: string[]
}

let userHome: UserHome = reactive(getUserHome())

const mockVideo = {
  "vid": 1,
  "videoUrl": "",
  "coverUrl": "",
  "playNum": 0,
  "danmuNum": 0,
  "duration": 0,
  "title": "标题",
  "uid": 1,
  "nickname": "Bonnenult",
  "date": 1685599556000
}
const coinVideoNum = 2
const coinVideoTotalNum = 2
const likeVideoNum = 6
const likeVideoTotalNum = 13

const store = useStore()
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = cmjs.biz.isMe(parseInt(route.params.uid as string))
  } else {
    isMe.value = false
  }
})

const noticeTextarea = ref<HTMLTextAreaElement>()

let route: any
let isMe = ref(false)
let newTitle = ref("")

onMounted(() => {
  route = useRoute()
  isMe.value = cmjs.biz.isMe(parseInt(route.params.uid as string))
})

function getUserHome() {
  return mockUserHome //TODO
}

function saveSpaceNotice() {
  userHome.notice = userHome.notice.trim()
  if (userHome.notice.length > 150) {
    cmjs.prompt.info("公告的字数最多为150，超出部分已自动选中")
    noticeTextarea.value!.focus()
    noticeTextarea.value!.setSelectionRange(150, userHome.notice.length)
  }
}

function apply() {
  ElMessageBox({
    title: '认证申请',
    message: h('div', { style: 'margin-right: 20px;' }, [
      h('div', null, [
        h('span', null, '请输入欲想认证的称号'),
      ]),
      h('div', null, [
        h('input', { id: 'new-title', onInput: onNewTitleChange }),
      ]),
      h('span', { id: 'notice' }, '称号的长度范围为1～50'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeNewTitleWindowClose,
  })
}

function onNewTitleChange() {
  newTitle.value = (document.getElementById("new-title") as HTMLInputElement).value;
  checkInput()
}

function checkInput() {
  if (newTitle.value.length >= 1 && newTitle.value.length <= 50) {
    (document.getElementById("notice") as HTMLSpanElement).style.display = "none"
    return true
  }
  (document.getElementById("notice") as HTMLSpanElement).style.display = "inline"
  return false
}

function beforeNewTitleWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newTitle.value = newTitle.value.trim();
    if (!checkInput()) {
      return
    }
    cmjs.prompt.success("已提交申请")
    userHome.applyTitle = newTitle.value
  }
  newTitle.value = ""
  done()
}

function cancelApply() {
  cmjs.prompt.success("已取消申请")
  userHome.applyTitle = ""
}

function toMeSetting() {
  window.open("/me/setting", "_blank")
}
</script>

<style scoped>
.home-container {
  display: flex;
}

.home-container .left {
  width: 703px;
}

.home-container .left>* {
  margin-bottom: 10px;
}

.home-container .left :last-child {
  margin-bottom: 0;
}

.home-container .right>* {
  margin-bottom: 10px;
}

.home-container .right :last-child {
  margin-bottom: 0;
}

.home-container .right {
  width: 428px;
  margin-left: 10px;
}

.home-container .right .title {
  color: #F56C6C;
}

.home-container .right .space-notice,
.home-container .right .space-notice-me {
  width: 100%;
  height: 169px;
  font-size: 14px;
  resize: none;
  border-radius: 5px;
  border: none;
  outline: none;
}

.home-container .right .space-notice-me:hover {
  border: 1px solid #dedfe0;
  padding: 5px;
  margin-left: -4px;
  margin-top: -4px;
  width: calc(100% - 3px);
  height: 165px;
}

.home-container .right .space-notice-me:focus {
  border: 1px solid #909399;
  padding: 5px;
  margin-left: -4px;
  margin-top: -4px;
  width: calc(100% - 3px);
  height: 165px;
}

.home-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-container .video-card-container {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-bottom: -15px;
}

.video-card-container .video-card {
  margin-right: 15px;
  margin-bottom: 15px;
}

.home-container .right .info-row {
  font-size: 14px;
  display: flex;
}

.home-container .right .info-row .item {
  flex: 1;
}

.home-container .right .info-row .item .span {
  color: #909399;
}

.home-container .right .info-row .item .value {
  color: #73767a;
  margin-left: 5px;
}

.home-container .right .tag-row {
  margin-top: 20px;
  margin-left: -2px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.home-container .right .tag-row .tag {
  font-size: 14px;
  line-height: 14px;
  color: #73767a;
}
</style>

<style>
#new-title {
  width: 100%;
  margin-top: 10px;
  border-radius: 5px;
  height: 25px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #dedfe0;
}

#new-title:hover {
  border-color: #c8c9cc;
}

#notice {
  color: red;
  font-size: 12px;
  display: none;
}
</style>