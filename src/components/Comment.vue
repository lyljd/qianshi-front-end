<template>
  <div :id="'container-' + data.cid" class="container">
    <el-avatar @click="common.ToUser(data.uid)" class="avatar" size="40" :src="data.avatarUrl" @error="true">
      <img src="../../public/default-avatar.png" />
    </el-avatar>
    <div class="right">
      <div class="user-info">
        <span :class="{ nicknameVip: data.isVip }" @click="common.ToUser(data.uid)" class="nickname">{{ data.nickname
        }}</span>

        <svg class="icon-symbol level" aria-hidden="true">
          <use :xlink:href="'#el-icon-level_' + data.level"></use>
        </svg>

        <svg v-if="data.isUp" style="font-size: 30px;" class="icon-symbol" aria-hidden="true">
          <use xlink:href="#el-icon-UPzhu-copy"></use>
        </svg>
      </div>

      <div class="to" v-if="data.to !== undefined">回复 @<span @click="common.ToUser(data.to.uid)" class="nickname">{{
        data.to?.nickname }}</span>：</div>

      <textarea :id="'comment-' + data.cid" class="comment" rows="1" readonly>{{ data.content }}</textarea>

      <div class="comment-info">
        <span>
          <span class="date">{{ common.timestampFormatterRich(data.date) }}</span>

          <span class="ip-location">IP属地：{{ data.ipLocation }}</span>

          <span @click="like" :class="{ blue: data.isLike }" :title="data.likeNum.toString()"
            class="iconfont el-icon-zan like-btn">{{ common.numFormatterW(data.likeNum)
            }}</span>

          <span @click="dislike" :class="{ blue: data.isDislike }" class="iconfont el-icon-cai dislike-btn"></span>

          <span @click="openChildSendArea(data.parentCid, data.cid, data.nickname, data.isChild)"
            class="reply-btn">回复</span>
        </span>

        <el-popover ref="extraPop" trigger="click" placement="bottom-end">
          <template #reference>
            <span class="iconfont el-icon-diandiandianshu extra"></span>
          </template>
          <div class="extra-container">
            <el-popconfirm @confirm="deleteComment(data.cid)" hide-icon title="删除评论后，评论下所有回复都会被删除，是否继续?"
              confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <div v-if="isMe || isUp" class="comment-detele"><span class="iconfont el-icon-ashbin em-icon"></span>删除</div>
              </template>
            </el-popconfirm>
            <div @click="report" class="comment-report"><span class="iconfont el-icon-jubao em-icon"></span>举报</div>
          </div>
        </el-popover>
      </div>

      <div v-if="data.isTop || data.isUpLike" class="status">
        <span v-if="data.isTop" class="top">置顶</span>
        <span v-if="data.isUpLike" class="up-like">UP主觉得很赞</span>
      </div>

      <div v-for="(  item  ) in   data.reply?.value  ">
        <ChildComment :vAuthorUid="vAuthorUid" :openChildSendArea="openChildSendArea" :deleteComment="deleteChildComment"
          :scrollId="scrollId" :data="item"></ChildComment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import * as common from "../common"
import { useStore } from "../store"
import { storeToRefs } from "pinia"

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
  ipLocation: string
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

let props = defineProps<{
  data: Comment
  scrollId: number
  deleteComment: Function
  openChildSendArea: Function
  vAuthorUid: number
}>()

const store = useStore()
let { isLogin } = storeToRefs(store)
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = common.isMe(props.data.uid)
    isUp.value = common.isMe(props.vAuthorUid)
    init()
  } else {
    isMe.value = false
    isUp.value = false
    reset()
  }
})

const extraPop = ref()
let commentEle: HTMLTextAreaElement

let isMe = ref(common.isMe(props.data.uid))
let isUp = ref(common.isMe(props.vAuthorUid))

onMounted(() => {
  commentEle = document.getElementById("comment-" + props.data.cid) as HTMLTextAreaElement
  props.data.height = commentEle.scrollHeight.toString() + "px"
  commentEle.style.height = props.data.height

  if (props.scrollId > -2) {
    if (props.scrollId === -1) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } else {
      let ele: HTMLDivElement = document.getElementById("container-" + props.scrollId) as HTMLDivElement
      ele.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }
  }

  //<!--解决在视频的父级评论区新发一条评论后，最后一个按钮没有被禁止的bug
  let sendBtns = document.querySelectorAll(".comment-send") as NodeListOf<HTMLButtonElement>
  let lastSendBtn = sendBtns[sendBtns.length - 1]
  if (!lastSendBtn.disabled) {
    common.btnCD(lastSendBtn, 10000)
  }
  //-->
})

function init() {
  //TODO request API
}

function reset() {
  //TODO Re request API
}

function deleteChildComment(cid: number) {
  let deleteIndex = -1
  for (let i = 0; i < props.data.reply!.value.length; i++) {
    if (deleteIndex == -1) {
      if (props.data.reply?.value[i].cid === cid) {
        deleteIndex = i
      }
    } else {
      let ele: HTMLTextAreaElement = document.getElementById("comment-" + props.data.reply?.value[i - 1].cid) as HTMLTextAreaElement
      ele.style.height = props.data.reply?.value[i].height as string
    }
  }
  props.data.reply?.value.splice(deleteIndex, 1)
}

function like() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (isMe.value) {
    common.showInfo("不能给自己的评论点赞")
    return
  }
  if (!props.data.isLike) {
    props.data.isLike = true
    props.data.likeNum++
  } else {
    props.data.isLike = false
    props.data.likeNum--
  }
  if (isUp) {
    props.data.isUpLike = props.data.isLike
  }
  props.data.isDislike = false
}

function dislike() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (isMe.value) {
    common.showInfo("不能给自己的评论点踩")
    return
  }
  if (props.data.isLike) {
    props.data.likeNum--
    props.data.isLike = false
    props.data.isUpLike = false

  }
  props.data.isDislike = !props.data.isDislike
}

function openLoginWindow() {
  ElMessage({
    "message": "请登录后再操作",
    "offset": 77,
    "customClass": "zIndex999",
  })
  store.openLoginWindow()
}

function report() {
  extraPop.value.hide()
  
  if (!isLogin.value) {
    openLoginWindow()
    return
  }

  store.openFSWindow('评论举报', '#', "请输入举报理由", "理由不能为空", "举报成功")
}
</script>

<script lang="ts">
export default {
  name: "ChildComment" //由于Comment和type名重复，所以重定义组件名
}
</script>

<style scoped>
.container {
  display: flex;
  margin-top: 20px;
  width: 100%;
}

.container .avatar {
  cursor: pointer;
  margin-right: 10px;
}

.container .right {
  width: 100%;
}

.container .user-info {
  display: flex;
  align-items: center;
}

.container .user-info .nickname {
  color: #606266;
  font-size: 14px;
}

.container .user-info .nickname:hover {
  color: #409EFF;
  cursor: pointer;
}

.container .user-info .nicknameVip {
  color: #FF6699;
}

.container .user-info .level {
  font-size: 25px;
  margin-left: 7.5px;
}

.container .to {
  margin-bottom: 7.5px;
  color: #b1b3b8;
  font-size: 14px;
}

.container .to .nickname {
  color: #73767a;
  cursor: pointer;
}

.container .to .nickname:hover {
  color: #409EFF;
}

.container .comment {
  resize: none;
  border: none;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.container .comment:focus {
  outline: none;
}

.container .comment-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #909399;
  margin-top: 3px;
}

.comment-info .date,
.comment-info .ip-location,
.comment-info .reply-btn {
  font-size: 13px;
  cursor: default;
}

.comment-info .extra:hover {
  color: #409EFF;
  cursor: pointer;
}

.extra-container {
  font-size: 14px;
  margin: -7.5px;
}

.extra-container .comment-detele,
.extra-container .comment-report {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.extra-container .comment-detele:hover,
.extra-container .comment-report:hover {
  cursor: pointer;
  color: #409EFF;
  background-color: #f4f4f5;
}

.extra-container .em-icon {
  font-size: 20px;
  margin-right: 5px;
}

.comment-info .date,
.comment-info .ip-location,
.comment-info .dislike-btn {
  margin-right: 15px;
}

.comment-info .like-btn {
  margin-right: 5px;
}

.comment-info .reply-btn:hover,
.comment-info .like-btn:hover,
.comment-info .dislike-btn:hover {
  color: #409EFF;
  cursor: pointer;
}

.container .status {
  font-size: 13px;
  margin-top: 12.5px;
}

.status .top {
  color: #F56C6C;
  background-color: #fde2e2;
  padding: 3px;
  margin-right: 10px;
  cursor: default;
}

.status .up-like {
  color: #909399;
  background-color: #e9e9eb;
  padding: 3px;
  cursor: default;
}
</style>