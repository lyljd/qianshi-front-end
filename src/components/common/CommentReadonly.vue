<template>
  <div :id="`comment-${data.cid}`" class="comment-container">
    <Image :customClick="() => { cmjs.jump.user(data.uid) }" :url="data.avatarUrl" :w="40" :h="40" customClass="avatar"
      avatar>
    </Image>
    <div class="right">
      <div class="main">
        <div class="user-info">
          <span :class="{ nicknameVip: data.isVip }" @click="cmjs.jump.user(data.uid)" class="nickname">{{ data.nickname
          }}</span>

          <svg class="icon-symbol level" aria-hidden="true">
            <use :xlink:href="`#el-icon-level_${cmjs.biz.expToLevel(data.exp)}`"></use>
          </svg>

          <svg v-if="data.isUp" style="font-size: 25px;" class="icon-symbol" aria-hidden="true">
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

            <span :title="data.likeNum.toString()" class="iconfont el-icon-zan like-btn">{{ cmjs.fmt.numWE(data.likeNum)
            }}</span>
          </span>
        </div>

        <div v-if="data.isTop || data.isUpLike" class="status">
          <span v-if="data.isTop" class="top">置顶</span>
          <span v-if="data.isUpLike" class="up-like">UP主觉得很赞</span>
        </div>
      </div>

      <div v-for="c in data.reply?.data">
        <ChildComment style="margin-top: 20px;" :data="c"></ChildComment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'

type Comment = {
  cid: number
  avatarUrl: string
  uid: number
  nickname: string
  exp: number
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
}>()

onMounted(() => {
  nextTick(() => {
    const contentContainer = document.getElementById(`content-${props.data.cid}`) as HTMLTextAreaElement
    contentContainer.style.height = contentContainer.scrollHeight + "px"
  })
})
</script>

<script lang="ts">
export default {
  name: "ChildComment"
}
</script>

<style lang="less" scoped>
.comment-container {
  display: flex;
  width: 100%;

  .right {
    width: 100%;

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

        .level {
          font-size: 25px;
          margin-left: 7.5px;
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
        .ip-location {
          font-size: 13px;
          cursor: default;
        }

        .like-btn {
          font-size: 15px;
        }

        .date,
        .ip-location {
          margin-right: 15px;
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
  }
}
</style>

<style>
.container .avatar {
  margin-right: 7.5px;
}
</style>