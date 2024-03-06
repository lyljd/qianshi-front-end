<template>
  <el-card class="comment-area">
    <template #header>
      <div class="header">
        <div>
          <span class="comment-span">评论</span>
          <span class="comment-num">{{ cmjs.fmt.numWE(props.total) }}</span>
        </div>

        <div>
          <span class="sort-by" :class="sortBy === 'hot' ? 'active-sort-by' : ''" @click="sortBy = 'hot'">最热</span>
          <span class="sort-hr">｜</span>
          <span class="sort-by" :class="sortBy === 'new' ? 'active-sort-by' : ''" @click="sortBy = 'new'">最新</span>
        </div>
      </div>
    </template>

    <div class="body">
      <div class="video-send-area">
        <textarea class="comment-input" v-model="VSAInput" placeholder="快来发表评论吧～"></textarea>
        <el-button v-blur class="comment-send" @click="send()" type="primary">发布</el-button>
      </div>

      <el-empty v-if="props.total === 0" description="暂无评论" />

      <div class="comments" v-else>
        <div class="comment" v-for="(c, idx) in props.data">
          <Comment :key="c.cid" :data="c" :authorUid="props.authorUid" :openCommentSendArea="openCommentSendArea"
            :deleteComment="deleteComment" :incrTotal="props.incrTotal">
          </Comment>

          <div class="more-reply" v-if="c.reply && c.reply.total > 2 && !c.reply.isOpen">
            共{{ c.reply.total }}条回复，<span class="view" @click="viewMore(c, 1)">点击查看</span>
          </div>

          <el-pagination :key="c.cid" class="comment-page" v-if="c.reply && c.reply.isOpen" :total="c.reply.total"
            :default-page-size="5" small background hide-on-single-page layout="prev, pager, next"
            @current-change="(newPage: number) => { viewMore(c, newPage) }" />

          <div class="comment-send-area" v-show="c.cid === activeCSAId">
            <textarea v-model="CSAInput" class="comment-input" :placeholder="`回复 @${CSAReplyTo.nickname}：`"></textarea>
            <el-button v-blur @click="childSend" class="comment-send" type="primary">发布</el-button>
          </div>

          <hr class="divide" v-if="idx !== props.data.length - 1">
        </div>

        <el-pagination class="video-page" :total="props.totalTop" v-model:current-page="curPage" :default-page-size="10"
          background hide-on-single-page layout="prev, pager, next" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Comment from "@/components/common/Comment.vue"
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import { onBeforeRouteUpdate } from 'vue-router'

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
    isOpen?: boolean
  }
}

const store = useStore()
let { isLogin } = storeToRefs(store)

let props = defineProps<{
  total: number
  totalTop: number // 分页得按照顶级评论数来
  data: Comment[]
  vid: number
  authorUid: number
  incrTotal: (incr: number) => void
  incrTotalTop: (incr: number) => void
}>()

let curPage = ref(1)
let notGetData = ref(false)
let sortBy = ref("hot")

watch(curPage, newVal => {
  if (!notGetData.value) {
    setData()
    return
  }
  notGetData.value = false
})

onBeforeRouteUpdate((to, from, next) => {
  notGetData.value = true // 重置为1会触发watch导致再次获取评论，这是不必要的
  curPage.value = 1 // 切集后评论区页数应该重置为1；子评论区通过:key规避了这个问题
  next()
})

watch(sortBy, newVal => {
  if (curPage.value !== 1) {
    curPage.value = 1
  } else {
    setData()
  }
})

// VSA(video send area): 视频的发布区; CSA(comment send area): 评论的发布区
let VSAInput = ref("")
let activeCSAId = ref(-1)
let CSAInput = ref("")
let CSAReplyTo = ref<{ uid: number, nickname: string }>({
  uid: -1,
  nickname: ''
})
let CSAIsSendToChildComment = ref(false)

function setData() {
  // TODO api
  console.log(`获取vid为${props.vid}的视频的按${sortBy.value}排序的评论的第${curPage.value}页`)
}

function send() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  let sendBtns = document.querySelectorAll(".comment-send") as NodeListOf<HTMLButtonElement>
  if (sendBtns[0].disabled) {
    return
  }

  VSAInput.value = VSAInput.value.trim()
  if (VSAInput.value.length === 0) {
    cmjs.prompt.error("请输入评论")
    return
  }

  sendBtns.forEach((ele) => {
    cmjs.util.btnCD(ele, 5)
  })

  // TODO api
  const cid = Date.now()
  const c: Comment = {
    "cid": cid,
    "avatarUrl": "/resource/avatar.jpeg",
    "uid": 1,
    "nickname": "Bonnenult",
    "level": 6,
    "isVip": true,
    "isUp": true,
    "isTop": false,
    "isUpLike": false,
    "content": VSAInput.value,
    "date": Date.now(),
    "ipLocation": "重庆",
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": false,
    "parentCid": cid
  }
  props.data.unshift(c)
  props.incrTotal(1)
  props.incrTotalTop(1)

  // 由于刚才新插入了一个元素，所以会导致该页最后一条评论的发布按钮未被禁止
  setTimeout(() => {
    sendBtns = document.querySelectorAll(".comment-send") as NodeListOf<HTMLButtonElement>
    let lastSendBtn = sendBtns[sendBtns.length - 1]
    cmjs.util.btnCD(lastSendBtn, 5)
  }, 0);

  VSAInput.value = ""

  setTimeout(() => {
    const newCommentEle = document.getElementById(`comment-${c.cid}`) as HTMLElement
    cmjs.util.scrollIntoView('center', newCommentEle)
  }, 0);
}

function openCommentSendArea(cid: number, uid: number, nickname: string, isChild: boolean) {
  activeCSAId.value = cid
  CSAReplyTo.value = {
    uid: uid,
    nickname: nickname,
  }
  CSAIsSendToChildComment.value = isChild
}

function deleteComment(cid: number) {
  // TODO api
  for (let i = 0; i < props.data.length; i++) {
    if (props.data[i].cid === cid) {
      props.incrTotal(props.data[i].reply ? -(props.data[i].reply!.total + 1) : -1)
      props.data.splice(i, 1)
      // TODO api：若还有评论，则向后端再请求一条评论补充进来
      return
    }
  }
}

function childSend() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  let sendBtns = document.querySelectorAll(".comment-send") as NodeListOf<HTMLButtonElement>
  if (sendBtns[0].disabled) {
    return
  }

  CSAInput.value = CSAInput.value.trim()
  if (CSAInput.value.length === 0) {
    cmjs.prompt.error("请输入评论")
    return
  }

  sendBtns.forEach((ele) => {
    cmjs.util.btnCD(ele, 5)
  })

  //TODO api
  const newComment: Comment = {
    "cid": Date.now(),
    "avatarUrl": "/resource/avatar.jpeg",
    "uid": 1,
    "nickname": "Bonnenult",
    "level": 6,
    "isVip": true,
    "isTop": false,
    "isUp": true,
    "isUpLike": false,
    "content": CSAInput.value,
    "date": Date.now(),
    "ipLocation": "重庆",
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": true,
    "parentCid": activeCSAId.value
  }
  if (CSAIsSendToChildComment.value) {
    newComment.to = {
      "uid": CSAReplyTo.value.uid,
      "nickname": CSAReplyTo.value.nickname
    }
  }
  for (let i = 0; i < props.data.length; i++) {
    const c = props.data[i]
    if (c.cid === activeCSAId.value) {
      if (c.reply === undefined) {
        c.reply = {
          total: 0,
          data: []
        }
      }
      c.reply.total++
      c.reply.data.push(newComment)
      props.incrTotal(1)
      break
    }
  }

  CSAInput.value = ""
  activeCSAId.value = -1

  setTimeout(() => {
    const newCommentEle = document.getElementById(`comment-${newComment.cid}`) as HTMLElement
    cmjs.util.scrollIntoView('center', newCommentEle)
  }, 0);
}

function viewMore(c: Comment, page: number) {
  // TODO api
  console.log(`获取cid为${c.cid}的评论其回复的第${page}页`)

  if (c.reply!.isOpen) {
    return // mock时防止重复添加
  }

  c.reply!.isOpen = true
  // TODO 下方应直接替换reply为获取到的数据
  c.reply?.data.push({
    "cid": Date.now(),
    "uid": 2,
    "avatarUrl": "/resource/avatar2.jpeg",
    "nickname": "惜缘灬冷颜",
    "level": 3,
    "isVip": false,
    "isUp": false,
    "isTop": false,
    "isUpLike": false,
    "content": "嘻嘻😁",
    "date": 1698109740000,
    "ipLocation": "四川",
    "likeNum": 0,
    "isLike": false,
    "isDislike": false,
    "isChild": true,
    "parentCid": c.cid,
    "to": {
      "uid": 1,
      "nickname": "Bonnenult"
    }
  })
}
</script>

<style lang="less" scoped>
.comment-area {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: default;

    .comment-span {
      font-size: 18px;
    }

    .comment-num {
      font-size: 14px;
      margin-left: 5px;
      color: #b1b3b8;
    }

    .sort-by {
      font-size: 14px;
      color: #b1b3b8;
      cursor: pointer;
    }

    .active-sort-by {
      color: #303133;
      cursor: not-allowed;
    }

    .sort-hr {
      font-size: 14px;
      color: #c8c9cc;
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  .body {
    .video-send-area {
      display: flex;
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
      border: 1px solid #dedfe0;
    }

    .comment-input:hover {
      border: 1px solid #c8c9cc;
    }

    .comment-input:focus {
      outline: none;
      border: 1px solid #409EFF;
    }

    .comment-send {
      width: 100px;
      height: 67px;
      margin-left: 20px;
      font-size: 18px;
    }

    .comments {
      .comment {
        .more-reply {
          margin-left: 47.5px;
          margin-top: 20px;
          font-size: 13px;
          color: #909399;

          .view:hover {
            color: #409EFF;
            cursor: pointer;
          }
        }

        .comment-page {
          margin-top: 20px;
          margin-left: 47.5px;
        }

        .comment-send-area {
          display: flex;
          margin-left: 47.5px;
          margin-top: 20px;
        }

        .divide {
          border: none;
          height: 1px;
          background-color: #dedfe0;
          margin-left: 47.5px;
          margin-bottom: 0;
          margin-top: 20px;
        }
      }

      .video-page {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>