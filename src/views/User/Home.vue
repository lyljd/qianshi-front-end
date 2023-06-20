<template>
  <div class="home-container">
    <div class="left">
      <el-card>
        <template #header>
          <div class="header">
            <span>投币的视频 {{ coinVideoTotalNum }}</span>
            <el-button v-if="coinVideoTotalNum > 6">更多</el-button>
          </div>
        </template>
        <div v-if="coinVideoNum > 0" class="video-card-container">
          <SmallVideoCard v-for="() in coinVideoNum" class="video-card" :data="mockVideo"></SmallVideoCard>
        </div>
        <el-empty v-else description="暂无视频" />
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>点赞的视频 {{ likeVideoTotalNum }}</span>
            <el-button v-if="likeVideoTotalNum > 6">更多</el-button>
          </div>
        </template>
        <div v-if="likeVideoNum > 0" class="video-card-container">
          <SmallVideoCard v-for="() in likeVideoNum" class="video-card" :data="mockVideo"></SmallVideoCard>
        </div>
        <el-empty v-else description="暂无视频" />
      </el-card>
    </div>

    <div class="right">
      <el-card v-if="title != '' || isMe">
        <template #header>
          <div class="header">
            <span>个人认证</span>
            <div v-if="isMe">
              <el-button @click="apply" v-if="applyTitle === ''">{{ title === "" ? "申请" : "重新申请" }}</el-button>
              <div v-else>
                <el-tooltip :content="applyTitle" placement="top">
                  <span class="iconfont el-icon-info"
                    style="font-size: 14px; margin-right: 10px; cursor: default;">申请中</span>
                </el-tooltip>
                <el-button @click="cancelApply">取消申请</el-button>
              </div>
            </div>
          </div>
        </template>
        <span v-if="title !== ''" class="iconfont el-icon-renzheng title">{{ title }}</span>
        <el-empty v-else style="padding: 0;" description="暂无称号" :image-size="100" />
      </el-card>

      <el-card v-if="notice != '' || isMe" header="公告">
        <div :class="{ 'space-notice-gap': isMe }">
          <textarea :class="{ 'space-notice-me': isMe, 'space-notice': !isMe }" v-model="notice"
            :readonly="isMe ? false : true" id="space-notice" placeholder="编辑我的空间公告"></textarea>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="header">
            <span>个人资料</span>
            <el-button v-if="isMe">修改资料</el-button>
          </div>
        </template>
        <div class="info-row">
          <div class="item">
            <span class="span">UID</span>
            <span class="value">{{ uid }}</span>
          </div>
          <div class="item">
            <span class="span">生日</span>
            <span class="value">{{ birthday }}</span>
          </div>
        </div>
        <div class="tag-row">
          <span v-for="(item) in tag" class="iconfont el-icon-tag tag">{{ item }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as common from "../../common"
import SmallVideoCard from '../../components/SmallVideoCard.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { useStore } from "../../store"

const mockVideo = {
  "vid": 0,
  "coverUrl": "",
  "playNum": 0,
  "duration": 0,
  "title": "标题",
  "date": 1686799558000
}
const coinVideoNum = 2
const coinVideoTotalNum = 2
const likeVideoNum = 6
const likeVideoTotalNum = 13
const title = "浅时创始人（站长）"
let applyTitle = ref("")
let notice = ref("Ciallo～(∠・ω< )⌒☆")
let uid = ref(1)
let birthday = ref("11-19")
let tag = ["柚子厨", "anime", "可可爱爱，没有脑袋",]

const store = useStore()
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = common.isMe(parseInt(route.params.uid as string))
  } else {
    isMe.value = false
  }
})

let noticeEle: HTMLTextAreaElement

let route: any
let isMe = ref(false)

onMounted(() => {
  route = useRoute()
  isMe.value = common.isMe(parseInt(route.params.uid as string))

  noticeEle = document.getElementById("space-notice") as HTMLTextAreaElement
  noticeEle.addEventListener("blur", function () {
    notice.value = notice.value.trim()
    if (notice.value.length > 150) {
      ElMessage({
        "message": "公告的字数最多为150，超出部分已自动选中",
        "offset": 77,
      })
      noticeEle.focus()
      noticeEle.setSelectionRange(150, notice.value.length)
    }
  })
})

function apply() {
  ElMessageBox.prompt('请输入认证称号', '认证申请', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^\S{1,50}$/,
    inputErrorMessage: '称号的长度范围为1～50，且不能为空白字符',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    showClose: false
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        offset: 77,
        message: "已提交申请",
      })
      applyTitle.value = value
    })
}

function cancelApply() {
  applyTitle.value = ""
}
</script>

<style scoped>
.home-container {
  display: flex;
}

.home-container .left {
  width: 702px;
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
  margin-top: 10px;
}

.home-container .right .tag-row .tag:last-child {
  margin-right: 0;
}

.home-container .right .tag-row .tag {
  font-size: 14px;
  margin-right: 20px;
  white-space: nowrap;
  overflow-wrap: break-word;
  color: #73767a;
}
</style>