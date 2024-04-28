<template>
  <div :id="`comment-${data.cid}`" class="comment-container">
    <Avatar v-model="data.avatarUrl" :size="data.isChild ? 'small' : 'medium'" :home="{ uid: data.uid }"></Avatar>
    <div class="right">
      <div class="main">
        <div class="user-info">
          <span :class="{ nicknameVip: data.isVip }" @click="cmjs.jump.user(data.uid)" class="nickname">{{ data.nickname
            }}</span>

          <LevelIco :level="data.level" style="margin-left: 6px;"></LevelIco>

          <svg v-if="data.isUp" style="font-size: 27.5px;" class="icon-symbol" aria-hidden="true">
            <use xlink:href="#el-icon-UPzhu-copy"></use>
          </svg>
        </div>

        <div class="to" v-if="data.to !== undefined">回复 @<span @click="cmjs.jump.user(data.to.uid)" class="nickname">{{
    data.to?.nickname }}</span>：</div>

        <textarea :id="`content-${data.cid}`" class="comment" rows="1" readonly>{{ data.content }}</textarea>

        <div class="comment-info">
          <span>
            <span class="date">{{ cmjs.fmt.tsYRichTmpl(data.date, "MM-DD HH:mm") }}</span>

            <span class="ip-location">IP属地：{{ data.ipLocation }}</span>

            <span @click="like" :style="{ color: data.isLike && isLogin ? '#409EFF' : '' }"
              :title="data.likeNum.toString()" class="iconfont el-icon-zan like-btn">{{ cmjs.fmt.numWE(data.likeNum)
              }}</span>

            <span @click="dislike" :style="{ color: data.isDislike && isLogin ? '#409EFF' : '' }"
              class="iconfont el-icon-cai dislike-btn"></span>

            <span @click="openCommentSendArea(data.parentCid, data.cid, data.nickname, data.isChild)"
              class="reply-btn">回复</span>
          </span>

          <el-popover ref="extraPop" trigger="click" placement="bottom-end">
            <template #reference>
              <span class="iconfont el-icon-diandiandianshu extra"></span>
            </template>
            <div class="extra-container">
              <div class="item" v-if="isUp && !props.data.isChild" @click="setTop"><span
                  :class="!data.isTop ? 'el-icon-zhiding' : 'el-icon-quxiaozhiding'" class="iconfont em-icon"></span>{{
    !data.isTop ? '置顶' : '取消置顶' }}</div>

              <el-popconfirm @confirm="deleteComment(data.cid)" hide-icon
                :title="!data.isChild ? '删除评论后，评论下所有回复都会被删除，是否继续?' : '你确认要删除该评论吗？'" confirm-button-text="确认"
                cancel-button-text="取消">
                <template #reference>
                  <div class="item" v-if="isMe || isUp"><span class="iconfont el-icon-ashbin em-icon"></span>删除</div>
                </template>
              </el-popconfirm>

              <div class="item" @click="report"><span class="iconfont el-icon-jubao em-icon"></span>举报</div>
            </div>
          </el-popover>
        </div>

        <div v-if="data.isTop || data.isUpLike" class="status">
          <span v-if="data.isTop" class="top">置顶</span>
          <span v-if="data.isUpLike" class="up-like">UP主觉得很赞</span>
        </div>
      </div>

      <div v-for="c in data.reply?.data">
        <ChildComment :data="c" :openCommentSendArea="openCommentSendArea" :deleteComment="deleteChildComment"
          :authorUid="authorUid" :incr-total="incrTotal"></ChildComment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/common/Avatar.vue'
import LevelIco from '@/components/common/LevelIco.vue'
import cmjs from '@/cmjs'
import { useStore } from "@/store"
import { storeToRefs } from "pinia"

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
  }
}

let props = defineProps<{
  data: Comment
  openCommentSendArea: Function
  deleteComment: Function
  authorUid: number
  incrTotal: (incr: number) => void
}>()

const store = useStore()
let { isLogin } = storeToRefs(store)
watch(() => store.isLogin, (newVal: boolean) => {
  if (newVal) {
    isMe.value = cmjs.biz.verifyLoginUid(props.data.uid)
    isUp.value = cmjs.biz.verifyLoginUid(props.authorUid)
  } else {
    isMe.value = false
    isUp.value = false
  }
})

const extraPop = ref()

let isMe = ref(cmjs.biz.verifyLoginUid(props.data.uid))
let isUp = ref(cmjs.biz.verifyLoginUid(props.authorUid))

onMounted(() => {
  const contentContainer = document.getElementById(`content-${props.data.cid}`) as HTMLTextAreaElement
  contentContainer.style.height = contentContainer.scrollHeight + "px"
})

function deleteChildComment(cid: number) {
  // TODO api
  for (let i = 0; i < props.data.reply!.data.length; i++) {
    if (props.data.reply!.data[i].cid === cid) {
      props.data.reply!.data.splice(i, 1)
      props.data.reply!.total--
      props.incrTotal(-1)
      // TODO api
      return
    }
  }
}

function like() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  if (isMe.value) {
    cmjs.prompt.info("不能给自己的评论点赞")
    return
  }

  // TODO api
  if (!props.data.isLike) {
    props.data.isLike = true
    props.data.likeNum++
  } else {
    props.data.isLike = false
    props.data.likeNum--
  }
  props.data.isDislike = false
  if (isUp) {
    props.data.isUpLike = props.data.isLike
  }
}

function dislike() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  if (isMe.value) {
    cmjs.prompt.info("不能给自己的评论点踩")
    return
  }

  // TODO api
  if (props.data.isLike) {
    props.data.likeNum--
    props.data.isLike = false
    props.data.isUpLike = false

  }
  props.data.isDislike = !props.data.isDislike
}

function report() {
  extraPop.value.hide()

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  store.openFSWindow({
    title: "评论举报",
    placeholder: "请输入举报理由",
    submitHandler: (msg: string, fileList: File[], closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          cid: props.data.cid,
        },
      })
      cmjs.prompt.success("提交成功")
      closeWindow()
    },
  })
}

function setTop() {
  // TODO api
  extraPop.value.hide()
  props.data.isTop = !props.data.isTop
  cmjs.prompt.success(props.data.isTop ? '置顶成功' : '取消置顶成功')
}
</script>

<script lang="ts">
export default {
  name: "ChildComment" // 需要在组件内嵌套本身，但由于"Comment"和type名重复，所以就得重定义组件名
}
</script>

<style lang="less" scoped>
.comment-container {
  display: flex;
  margin-top: 20px;
  width: 100%;

  .right {
    width: 100%;
    margin-left: 7.5px;

    .main {
      display: flex;
      flex-direction: column;

      .user-info {
        display: flex;
        align-items: center;

        .nickname {
          color: #606266;
          font-size: 14px;
        }

        .nickname:hover {
          color: #409EFF;
          cursor: pointer;
        }

        .nicknameVip {
          color: #FF6699;
        }
      }

      .to {
        margin-bottom: 4.5px;
        color: #b1b3b8;
        font-size: 14px;

        .nickname {
          color: #73767a;
          cursor: pointer;
        }

        .nickname:hover {
          color: #409EFF;
        }
      }

      .comment {
        resize: none;
        border: none;
        padding: 0;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
      }

      .comment:focus {
        outline: none;
      }

      .comment-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #909399;
        margin-top: 3px;

        .date,
        .ip-location,
        .reply-btn {
          font-size: 13px;
          cursor: default;
        }

        .like-btn,
        .dislike-btn {
          font-size: 15px;
        }

        .reply-btn:hover,
        .like-btn:hover,
        .dislike-btn:hover {
          color: #409EFF;
          cursor: pointer;
        }

        .date,
        .ip-location,
        .dislike-btn {
          margin-right: 15px;
        }

        .like-btn {
          margin-right: 7.5px;
        }

        .extra {
          display: none;
          font-size: 13px;
          cursor: pointer;
        }

        .extra:hover {
          color: #409EFF;
        }
      }

      .status {
        font-size: 13px;
        margin-top: 10.5px;

        .top {
          color: #F56C6C;
          background-color: #fde2e2;
          padding: 3px;
          cursor: default;
          margin-right: 10.5px;
        }

        .up-like {
          color: #909399;
          background-color: #e9e9eb;
          padding: 3px;
          cursor: default;
        }
      }
    }

    .main:hover .extra {
      display: inline;
    }
  }
}

.extra-container {
  font-size: 14px;
  margin: -7.5px;

  .item {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .item:hover {
    color: #409EFF;
    background-color: #f4f4f5;
  }

  .em-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}
</style>