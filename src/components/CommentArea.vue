<template>
  <el-card class="comment-container">
    <template #header>

      <div class="top">
        <div>
          <span class="comment-span">评论</span>
          <span class="comment-num">{{ common.numFormatterW(data.num) }}</span>
        </div>

        <div>
          <span @click="commentSwitchHot" id="hot-span" class="option-hot">最热</span>
          <span class="option-hr">｜</span>
          <span @click="commentSwitchNew" id="new-span" class="option-new">最新</span>
        </div>
      </div>

    </template>

    <div style="display: flex;">
      <textarea v-model="content" class="comment-input" placeholder="快来发表评论吧～"></textarea>
      <el-button @click="send(data.value)" class="comment-send" type="primary">发布</el-button>
    </div>

    <el-empty v-if="data.value.length === 0" description="暂无评论" />

    <div v-else>
      <div v-for="(item, index) in data.value">
        <Comment :vAuthorUid="vAuthorUid" :openChildSendArea="openChildSendArea" :deleteComment="deleteComment"
          :scrollId="scrollId" :data="item">
        </Comment>

        <div @click="viewMore(item)"
          v-if="item.reply !== undefined && item.reply.num > 2 && item.reply.isOpen === undefined" class="reply-num">共{{
            item.reply?.num }}条回复，<span class="view">点击查看</span></div>

        <el-pagination @click="getChildCommentByPage(item.cid)"
          @current-change="(page: number) => { curPage = page; isClickPage = true }"
          v-if="item.reply !== undefined && item.reply.isOpen !== undefined"
          style="margin-top: 20px;margin-left: 47.5px;" small background hide-on-single-page layout="prev, pager, next"
          :total="item.reply?.num" />

        <div v-show="item.cid === sendAreaId" style="display: flex; margin-left: 47.5px; margin-top: 20px;">
          <textarea v-model="childContent" class="comment-input" :placeholder="`回复 @${sendAreaNickname}：`"></textarea>
          <el-button @click="childSend" class="comment-send" type="primary">发布</el-button>
        </div>

        <hr class="comment-divide" v-if="index !== data.value.length - 1">
      </div>
    </div>

    <el-pagination @current-change="getCommentByPage" class="page" background hide-on-single-page
      layout="prev, pager, next" :total="data.num" />

  </el-card>
</template>

<script setup lang="ts">
import * as common from "../common"
import Comment from './Comment.vue'
import { useStore } from "../store"
import { storeToRefs } from "pinia"
import { ElMessage } from 'element-plus'

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

let props = defineProps<{
  data: {
    num: number
    value: Comment[]
  }
  vid: number
  vAuthorUid: number
}>()

const store = useStore()
let { isLogin } = storeToRefs(store)

let content = ref("")
let childContent = ref("")
let scrollId = ref(-2)
let sendAreaId = ref(-1) //控制打开哪个父评论的发布区
let sendAreaToId = ref(-1) //欲发布时若此条评论是子评论的评论则需要设置其to字段（其中有id和nickname两字段）
let sendAreaNickname = ref("nickname") //发布区中placeholder显示回复谁
let isDBChild = ref(false) //欲发布的此条评论是不是子评论的评论（不是的话则不会有to字段）
let isClickPage = false //判断是否刚点过子评论的页码（因为回调函数已固定，自己封装也不行，最终想了个click解决方法，但click有可能没有点击页码）
let curPage = 0 //在点过子评论的页码后会设置curPage

let hotSpan: HTMLSpanElement
let newSpan: HTMLSpanElement
let sendBtns: NodeListOf<HTMLButtonElement>

onMounted(() => {
  hotSpan = document.getElementById("hot-span") as HTMLSpanElement
  newSpan = document.getElementById("new-span") as HTMLSpanElement
  sendBtns = document.querySelectorAll(".comment-send") as NodeListOf<HTMLButtonElement>
})

function commentSwitchHot() {
  hotSpan.style.color = "#303133"
  newSpan.style.color = "#b1b3b8"
  hotSpan.style.cursor = "not-allowed"
  newSpan.style.cursor = "pointer"
}

function commentSwitchNew() {
  newSpan.style.color = "#303133"
  hotSpan.style.color = "#b1b3b8"
  newSpan.style.cursor = "not-allowed"
  hotSpan.style.cursor = "pointer"
}

function send(comment: Comment[]) {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (sendBtns[0].disabled || content.value.trim().length === 0) {
    return
  }
  sendBtns.forEach((ele) => {
    common.btnCD(ele, 10000)
  })
  props.data.num++
  //TODO cid应该从后端拿
  comment.push({
    "cid": props.data.num,
    "uid": 1,
    "avatarUrl": "../../public/avatar.jpeg",
    "nickname": "Bonnenult",
    "level": 6,
    "isVip": true,
    "isTop": false,
    "isUp": true,
    "isUpLike": false,
    "content": content.value.trim(),
    "date": Date.now(),
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": false,
    "parentCid": props.data.num
  })
  content.value = ""
  scrollId.value = -1
}

function deleteComment(cid: number) {
  let deleteIndex = -1
  for (let i = 0; i < props.data.value.length; i++) {
    if (deleteIndex == -1) {
      if (props.data.value[i].cid === cid) {
        deleteIndex = i
      }
    } else {
      let ele: HTMLTextAreaElement = document.getElementById("comment-" + props.data.value[i - 1].cid) as HTMLTextAreaElement
      ele.style.height = props.data.value[i].height as string
    }
  }
  props.data.value.splice(deleteIndex, 1)
}

function openChildSendArea(cid: number, toId: number, nickname: string, isDBC: boolean) {
  sendAreaId.value = cid
  sendAreaToId.value = toId
  sendAreaNickname.value = nickname
  isDBChild.value = isDBC
}

function childSend() {
  if (!isLogin.value) {
    openLoginWindow()
    return
  }
  if (sendBtns[0].disabled || childContent.value.trim().length === 0) {
    return
  }

  sendBtns.forEach((ele) => {
    common.btnCD(ele, 10000)
  })
  props.data.num++
  //TODO cid应该从后端拿
  let newComment: Comment = {
    "cid": props.data.num,
    "uid": 1,
    "avatarUrl": "../../public/avatar.jpeg",
    "nickname": "Bonnenult",
    "level": 6,
    "isVip": true,
    "isTop": false,
    "isUp": true,
    "isUpLike": false,
    "content": childContent.value.trim(),
    "date": Date.now(),
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": true,
    "parentCid": sendAreaId.value
  }
  if (isDBChild.value) {
    newComment.to = {
      "uid": sendAreaToId.value,
      "nickname": sendAreaNickname.value
    }
  }

  props.data.value.forEach((ele) => {
    if (ele.cid === sendAreaId.value) {
      if (ele.reply === undefined) {
        ele.reply = {
          num: 1,
          value: []
        }
      }
      ele.reply!.value.push(newComment)
    }
  })

  childContent.value = ""
  scrollId.value = props.data.num
  sendAreaId.value = -1
}

function getCommentByPage(page: number) {
  console.log(location.host + `/api/v/${props.vid}/comment?page=${page}`)
}

function getChildCommentByPage(cid: number) {
  if (!isClickPage) {
    return
  }
  console.log(location.host + `/api/v/${props.vid}/comment/${cid}?page=${curPage}`)
  isClickPage = false
}

function viewMore(comment: Comment) {
  comment.reply!.isOpen = true
  comment.reply?.value.push({
    "cid": props.data.num,
    "uid": 3,
    "avatarUrl": "../../public/avatar2.jpg",
    "nickname": "惜缘灬冷颜",
    "level": 3,
    "isVip": false,
    "isTop": false,
    "isUp": false,
    "isUpLike": false,
    "content": "嘻嘻😁",
    "date": 1686358790156,
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": true,
    "parentCid": 1,
    "to": {
      "uid": 1,
      "nickname": "Bonnenult"
    }
  })
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
.comment-container .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-container .top .option-hot,
.comment-container .top .option-new {
  font-size: 14px;
  cursor: pointer;
}

.comment-container .top .option-hr {
  font-size: 14px;
  color: #c8c9cc;
  margin-left: 5px;
  margin-right: 5px;
}

.comment-container .top .option-hot {
  cursor: not-allowed;
}

.comment-container .top .option-new {
  color: #b1b3b8;
}

.comment-container .top .comment-span {
  font-size: 18px;
}

.comment-container .top .comment-num {
  font-size: 14px;
  margin-left: 5px;
  color: #b1b3b8;
}

.comment-input {
  width: calc(100% - 120px);
  height: 67px;
  border: none;
  resize: none;
  background-color: #f4f4f5;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  font-size: 14px;
}

.comment-input:focus {
  outline: none;
}

.comment-send {
  width: 100px;
  height: 67px;
  margin-left: 20px;
  font-size: 18px;
}

.comment-container .reply-num {
  margin-left: 47.5px;
  margin-top: 20px;
  font-size: 13px;
  color: #909399;
}

.comment-container .reply-num .view:hover {
  color: #409EFF;
  cursor: pointer;
}

.comment-divide {
  border: none;
  height: 1px;
  background-color: #dedfe0;
  margin-left: 47.5px;
  margin-bottom: 0;
  margin-top: 20px;
}

.comment-container .page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>