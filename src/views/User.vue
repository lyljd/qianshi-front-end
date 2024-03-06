<template>
  <div class="container">
    <div class="head">
      <Image :url="user.topImg" :w="1140" :h="180" errorText="头图加载失败" :errorTextFontSize="20"></Image>

      <div v-show="isMe" @click="replaceTopImg" class="replace-top-img">更换头图</div>

      <el-drawer v-model="replaceTopImgDrawerShow" title="头图" :direction="'btt'" :modal="false" :show-close="false"
        size="auto">
        <template #default>
          <div class="top-img-selecter">
            <Image v-for="ti in topImgs" :url="ti" @click="user.topImg = ti"
              :style="{ cursor: user.topImg === ti ? 'not-allowed' : 'pointer' }" class="top-img-select-item"
              errorText="头图加载失败"></Image>
          </div>
        </template>
        <template #footer>
          <el-button v-blur @click="cancelTopImg">取消</el-button>
          <el-button v-blur @click="saveTopImg">保存</el-button>
        </template>
      </el-drawer>

      <div class="info">
        <Avatar :url="user.avatarUrl" size="large" :upload="isMe ? { handler: avatarUploadHandler } : undefined"></Avatar>

        <div class="right">
          <div class="head-row">
            <span class="nickname">{{ user.nickname }}</span>

            <span v-if="user.gender === '男'" style="color: #a0cfff;" class="iconfont el-icon-male"></span>
            <span v-else style="color: #ff6699;" class="iconfont el-icon-female"></span>

            <LevelIco :level="user.level"></LevelIco>

            <VipIco v-if="user.isVip" style="margin-left: 5px;"></VipIco>

            <span class="ip">
              <span class="iconfont el-icon-ip"></span>
              {{ user.ipLocation }}
            </span>

            <el-tooltip v-if="user.isReview" content="在此期间你可以重新上传头像" placement="top">
              <span class="iconfont el-icon-info tool-tip">头像审核中</span>
            </el-tooltip>

            <el-tooltip v-if="user.isBan" content="" placement="top">
              <span class="iconfont el-icon-info tool-tip">账号封禁中</span>
            </el-tooltip>
          </div>

          <input ref="signatureInput" @blur="saveSignature" :readonly="isMe ? false : true"
            :class="{ 'signature-row-me': isMe, 'signature-row': !isMe }" :placeholder="isMe ? '编辑个性签名' : ''"
            v-model="signature" @keyup.enter.native="signatureInput?.blur()" />
        </div>
      </div>

      <div v-show="!isMe" class="oper">
        <el-button v-blur @click="focu" :class="!user.isFocu ? 'not-focu' : ''">{{ !user.isFocu ? "关注" : "已关注"
        }}</el-button>

        <el-button v-blur @click="sendMessage">发消息</el-button>

        <el-popover ref="extraPop" placement="bottom-end">
          <template #reference>
            <span class="iconfont el-icon-diandiandianshu icon extra"></span>
          </template>
          <div class="extra-menu">
            <ul>
              <li v-if="!user.isBlock || !isLogin" @click="blockUser"><span
                  class="iconfont el-icon-lahei em-icon"></span>拉黑</li>
              <li v-else @click="cancelBlockUser"><span class="iconfont el-icon-lahei em-icon"></span>取消拉黑</li>
              <li @click="reportUser"><span class="iconfont el-icon-jubao2 em-icon"></span>举报</li>
            </ul>
          </div>
        </el-popover>
      </div>
    </div>


    <el-card class="nav">
      <el-menu class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
        <el-menu-item :index="`/u/${$route.params.uid}`">主页</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/dynamic`">动态</el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/post`">投稿<span class="item-num">{{ user.postNum
        }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/collection`">合集<span class="item-num">{{ user.collectionNum
        }}</span></el-menu-item>
        <el-menu-item :index="`/u/${$route.params.uid}/favlist`">收藏<span class="item-num">{{ user.favlistNum
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
            <div :title="(user.followNum).toString()" @click="cmjs.jump.follow(uid)" class="num focu-num">{{
              cmjs.fmt.numWE(user.followNum) }}</div>
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
import LevelIco from '@/components/common/LevelIco.vue'
import VipIco from '@/components/common/VipIco.vue'
import Avatar from '@/components/common/Avatar.vue'
import cmjs from '@/cmjs'
import mockUser from "@/mock/user.json"
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import { ElMessageBox } from "element-plus"

type User = {
  uid: number
  nickname: string
  signature: string
  avatarUrl: string
  gender: string
  level: number
  isVip: boolean
  ipLocation: string
  isReview?: boolean
  isBan?: boolean
  topImg: string
  isFocu: boolean
  isBlock: boolean
  postNum: number
  collectionNum: number
  favlistNum: number
  followNum: number
  fanNum: number
  likeNum: number
  playNum: number
  readNum: number
}

const route = useRoute()

const extraPop = ref()

const uid = parseInt(route.params.uid as string)
let user = ref<User>(getUser())
document.title = user.value.nickname + "的个人空间 - 浅时"

onBeforeRouteUpdate((to, from, next) => {
  document.title = user.value.nickname + "的个人空间 - 浅时"
  next()
})

const store = useStore()
let { isLogin } = storeToRefs(store)
watch(() => store.isLogin, (newVal: boolean) => {
  if (newVal) {
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

function avatarUploadHandler(file: File, succ: Function, fail: Function) {
  // TODO api
  console.log(file)
  setTimeout(() => {
    succ()
    user.value.isReview = true
    cmjs.prompt.info("待审核通过后你的头像将被更新")
    // fail()
  }, 2000)
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
  replaceTopImgDrawerShow.value = true
  oldTopImg.value = user.value.topImg
}

function cancelTopImg() {
  replaceTopImgDrawerShow.value = false
  user.value.topImg = oldTopImg.value
}

function saveTopImg() {
  //TODO api
  replaceTopImgDrawerShow.value = false
  cmjs.prompt.success("更换成功")
}

function focu() {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }
  if (isMe.value) {
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

function blockUser() {
  extraPop.value.hide()

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  ElMessageBox.prompt('请输入备注（比如拉黑的原因；可为空）', '拉黑用户', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
  })
    .then(({ value }) => {
      //TODO api
      console.log(uid)
      console.log("备注：" + value)

      user.value.isBlock = true
      cmjs.prompt.success("拉黑成功")
    })
    .catch(() => { })
}

function cancelBlockUser() {
  extraPop.value.hide()

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  ElMessageBox.confirm('你确认要取消拉黑该用户吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api
      console.log(uid)

      user.value.isBlock = false
      cmjs.prompt.success('取消拉黑成功')
    })
}

function reportUser() {
  extraPop.value.hide()

  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }

  store.openFSWindow({
    title: "用户举报",
    placeholder: "请输入举报理由",
    submitHandler: (msg: string, fileList: File[], closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          uid: uid,
        },
      })
      cmjs.prompt.success("提交成功")
      closeWindow()
    },
  })
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

  .head {
    width: 1140px;
    height: 180px;
    position: relative;

    .replace-top-img {
      position: absolute;
      top: 10px;
      right: 10px;
      color: white;
      font-size: 12px;
      cursor: pointer;
    }

    .top-img-selecter {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding-left: 20px;
      padding-right: 20px;

      .top-img-select-item {
        width: calc(50% - 16px);
        border: 3px solid #909399;
        border-radius: 10px;
      }
    }

    .info {
      position: absolute;
      left: 20px;
      bottom: 20px;
      display: flex;
      align-items: center;

      .right {
        margin-left: 10px;

        .head-row {
          display: flex;
          align-items: center;

          >*:not(:first-child) {
            margin-left: 5px;
          }

          .nickname {
            color: #f4f4f5;
            font-size: 20px;
          }

          .ip {
            color: #dedfe0;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: default;
          }

          .tool-tip {
            color: #dedfe0;
            font-size: 14px;
            cursor: default;
          }
        }

        .signature-row,
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

        .signature-row::placeholder,
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
      }
    }

    .oper {
      position: absolute;
      right: 20px;
      bottom: 20px;
      display: flex;
      align-items: center;

      .el-button {
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border: none;
        box-shadow: 0 0 0 2px hsla(0, 0%, 100%, 0.3);
      }

      .el-button:hover {
        background: rgba(0, 0, 0, 0.5);
      }

      .not-focu {
        background-color: #409EFF;
        box-shadow: 0 0 0 2px white;
      }

      .not-focu:hover {
        background-color: #79bbff;
      }

      .extra {
        cursor: pointer;
        font-size: 20px;
        color: #dedfe0;
      }

      .extra:hover {
        color: #b1b3b8;
      }
    }
  }

  .nav {
    margin-left: -1px;
    margin-right: -1px;
    margin-bottom: 10px;

    .menu {
      border-bottom: none;
      margin: -20px;

      .el-menu-item:focus {
        background-color: transparent !important;
        color: inherit !important;
      }

      .item-num {
        color: #909399;
        font-size: 12px;
        margin-left: 3px;
      }

      .search-container {
        display: flex;
        align-items: center;
        margin-left: 20px;

        .search {
          height: 30px;
          width: 225px;
        }
      }

      .num-container {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-right: 10px;

        .num-box {
          margin-right: 10px;
          text-align: center;
          cursor: default;

          .num-span {
            color: #909399;
          }

          .num {
            text-align: center;
            margin-top: 5px;
          }

          .focu-num:hover,
          .fan-num:hover {
            color: #409EFF;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.extra-menu ul {
  list-style-type: none;
  padding: 0;
  margin: -7.5px;

  li {
    cursor: pointer;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:hover {
    background-color: #e9e9eb;
  }

  .em-icon {
    font-size: 18px;
    margin-right: 5px;
  }
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