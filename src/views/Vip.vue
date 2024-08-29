<template>
  <div class="vip-container">
    <div>
      <el-card class="card">
        <div v-if="!isLogin" class="no-login">
          <span>登录后查看我的会员信息</span>
          <el-button type="primary" @click="store.openLoginWindow({ tip: '' })">登录</el-button>
        </div>
        <div v-else>
          <div class="avatar-container" v-show="!userLoading">
            <div>
              <Avatar v-model="avatarUrl" size="large"></Avatar>
            </div>
            <div class="right">
              <div>{{ vi.nickname }}</div>
              <div class="vip-expire">您的会员到期时间：<span
                  :style="{ color: Date.now() / 1000 <= vi.vipExpire ? '#67C23A' : '#F56C6C' }">{{ vi.vipExpire === 0 ?
          '未开通过'
          : cmjs.fmt.tsStandard(vi.vipExpire) }}<span style="color: #F56C6C;"
                    v-if="vi.vipExpire > 0 && vi.vipExpire < Date.now() / 1000">（已过期）</span></span></div>
            </div>
            <el-button @click="openPurchaseWindow" v-loading="coinLoading"
              :style="{ Cursor: coinLoading ? 'not-allowed' : 'cursor' }" type="success"
              style="position: absolute; right: 20px;">{{ Date.now() / 1000 > vi.vipExpire ?
          '开通' : '续费' }}</el-button>
          </div>
          <div v-show="userLoading" v-loading="userLoading">加载我的会员信息中...</div>
        </div>
      </el-card>
    </div>

    <div style="margin-top: 40px;">
      <div style="margin-bottom: 5px;">会员特权有哪些？</div>
      <div style="display: flex; gap: 20px;">
        <el-card header="内容特权" style="flex-grow: 1;">尊享会员专享视频</el-card>
        <el-card header="身份特权" style="flex-grow: 1;">尊享评论区<span style="color:#FF6699;">粉红</span>昵称展示</el-card>
        <el-card header="敬请期待" style="flex-grow: 1;">...</el-card>
      </div>
    </div>

    <div style="margin-top: 40px;">
      <div style="margin-bottom: 5px; font-size: 20px">猜你喜欢</div>
      <div style="display: flex;justify-content: space-between">
        <VideoCard v-for="v in videos" :loading="videoLoading" :data="v" type="big"></VideoCard>
        <VideoRefreshBtn v-show="videos.length > 0" @click="setVideos" style="margin-left: 0;position: unset;">
        </VideoRefreshBtn>
      </div>
    </div>
  </div>

  <el-dialog v-model="purchaseWindowShow" title="订单确认" align-center :show-close="false" :close-on-press-escape="false"
    :close-on-click-modal="false">
    <div class="purahase-container" v-loading.fullscreen.lock="paying" element-loading-text="提交订单中"
      element-loading-background="rgba(0, 0, 0, 0.7)">
      <div>商品名：<span class="goods-name">会员</span></div>
      <div class="items">
        <div v-for="g in goods" @click="purchaseChooseId = g.id" :class="{ highlight: purchaseChooseId === g.id }">
          <span>{{ g.name }}</span>
          <span class="iconfont el-icon-Bbi"><span class="cost">{{ g.cost }}</span></span>
          <span v-if="g.originCost" class="iconfont el-icon-Bbi" style="text-decoration:line-through"><span
              class="origin-cost">{{ g.originCost }}</span></span>
          <span v-if="g.discount" class="discount">{{ g.discount }}折</span>
        </div>
      </div>
      <div>硬币余额：<span class="coin-num">{{ coins }}</span></div>
    </div>
    <template #footer>
      <el-button @click="purchaseWindowShow = false">取消</el-button>
      <el-button @click="pay" type="success" :disabled="coins < goods[purchaseChooseId - 1].cost">购买</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import Avatar from '@/components/common/Avatar.vue'
import VideoCard from '@/components/common/VideoCard.vue'
import VideoRefreshBtn from "@/components/common/VideoRefreshBtn.vue"
import { ElMessageBox } from "element-plus"
import { useStore } from "@/store"
import { storeToRefs } from "pinia"
import * as UserAPI from '@/api/user'
import * as VideoAPI from '@/api/video'

type VipInfo = {
  nickname: string
  vipExpire: number
}

type Video = {
  vid: number
  videoUrl: string
  coverUrl: string
  playNum: number
  title: string
  uid: number
  nickname: string
  date: number
  vip: boolean
}

type Goods = {
  id: number
  name: string
  cost: number
  originCost?: number
  discount?: number
}

const goods: Goods[] = [
  { id: 1, name: '月度会员', cost: 50 },
  { id: 2, name: '季度会员', cost: 135, originCost: 150, discount: 9 },
  { id: 3, name: '年度会员', cost: 480, originCost: 600, discount: 8 },
]

const store = useStore()
let { isLogin } = storeToRefs(store)
watch(() => store.isLogin, (newVal: boolean) => {
  setVipInfo()
  setVideos()
})

let userLoading = ref(false)
let videoLoading = ref(false)
let coinLoading = ref(false)
let paying = ref(false)
let purchaseWindowShow = ref(false)
let purchaseChooseId = ref(1)
let avatarUrl = ref('')
let coins = ref(0)
let vi = ref<VipInfo>({ nickname: "", vipExpire: 0 })
let videos = ref<Video[]>([{} as Video, {} as Video, {} as Video, {} as Video])
setVipInfo()
setVideos()

function setVipInfo() {
  if (isLogin.value) {
    userLoading.value = true
    UserAPI.getMyVipInfo()
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        vi.value = res.data
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })
      .finally(() => {
        avatarUrl.value = cmjs.cache.getCookie('avatar')
        userLoading.value = false
      })
  }
}

function setVideos() {
  videoLoading.value = true
  VideoAPI.getRecommendVipVideo()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      videos.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      videoLoading.value = false
    })
}

function openPurchaseWindow() {
  if (coinLoading.value) {
    return
  }

  coinLoading.value = true
  UserAPI.meCoin()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      coins.value = res.data.coin
      purchaseWindowShow.value = true
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      coinLoading.value = false
    })
}

function pay() {
  ElMessageBox.confirm(`你确认要购买"${goods[purchaseChooseId.value - 1].name}"吗？`, '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      paying.value = true
      UserAPI.PurchaseVip(purchaseChooseId.value)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          purchaseWindowShow.value = false
          cmjs.prompt.success('购买成功！')
          setVipInfo()
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          paying.value = false
        })
    })
}
</script>

<style lang="less" scoped>
.vip-container {
  margin-top: 77px;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;

  .card {
    height: 100px;
    display: flex;
    align-items: center;
    position: relative;

    .no-login {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 10px;

      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        .vip-expire {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}

.purahase-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 16px;

  .goods-name {
    color: #67C23A;
  }

  .items {
    display: flex;
    gap: 20px;

    .highlight {
      border-color: #FF6699;
      background: rgba(246, 94, 140, 0.15);
    }

    >* {
      border: 2px solid #DCDFE6;
      border-radius: 10px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 0;
      cursor: pointer;
      position: relative;

      .cost {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-left: 2px;
      }

      .origin-cost {
        margin-left: 2px;
      }

      .discount {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #FF6699;
        color: white;
        font-size: 12px;
        padding: 4px;
        border-radius: 5px;
      }
    }
  }

  .coin-num {
    color: #F56C6C;
  }
}
</style>