<template>
  <el-card :header="`${who}的粉丝`">
    <div v-show="getting" v-loading="getting" element-loading-text="加载中" style="min-height: 100px;"></div>

    <div v-show="!getting">
      <el-empty v-if="r.users.length === 0" :description="`${who}还没有粉丝哦～`" />

      <div v-else class="fan-page">
        <div v-for="(u, idx) in r.users">
          <div class="item">
            <div class="main">
              <div class="avatar" @click="cmjs.jump.user(u.id)">
                <Avatar style="pointer-events: none;" v-model="u.avatarUrl" size="large"></Avatar>
              </div>

              <div class="info">
                <div class="nickname" @click="cmjs.jump.user(u.id)">{{ u.nickname }}</div>
                <div class="signature">{{ u.signature || "这个人没有填简介啊~~~" }}</div>
              </div>
            </div>

            <div style="position: relative;"><el-button @click="focu(u.id, u.isFollow, idx)"
                v-loading="focuing.includes(u.id)" :disabled="focuing.includes(u.id)"
                :type="u.isFollow ? 'info' : 'primary'" plain>{{ (u.isFollow ? '已' :
    '') + '关注' }}</el-button></div>
          </div>

          <el-divider />
        </div>

        <el-pagination class="page" :disabled="focuing.length > 0" :page-count="r.total" v-model:current-page="curPage"
          layout="prev, pager, next" hide-on-single-page />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import cmjs from "@/cmjs";
import { useStore } from "@/store"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import Avatar from '@/components/common/Avatar.vue'
import * as API from '@/api/user'

type Relation = {
  total: number
  cur: number
  users: {
    id: number
    avatarUrl: string
    nickname: string
    signature: string
    isFollow: boolean
  }[]
}

const route = useRoute()

const store = useStore()
let { isLogin } = storeToRefs(store)

watch(() => store.isLogin, (newVal: boolean) => {
  myId.value = cmjs.biz.getUid()
  timestamp.value = cmjs.util.getCurBETimestamp()
  curPage.value = 1
})

let timestamp = ref(cmjs.util.getCurBETimestamp())
const queryId = ref(parseInt(route.params.uid as string))
let myId = ref(cmjs.biz.getUid())
let who = ref(myId.value === queryId.value ? '我' : 'Ta')
let getting = ref(false)
let focuing = ref<number[]>([])
let curPage = ref(1)

let r = ref<Relation>({ total: 0, cur: 0, users: [] })
getFans()

watch(curPage, newVal => {
  getFans()
})

function getFans() {
  getting.value = true
  API.GetFans(queryId.value, curPage.value, timestamp.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      r.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      getting.value = false
    })
}

function focu(followingId: number, isFollow: boolean, idx: number) {
  if (!isLogin.value) {
    store.openLoginWindow()
    return
  }
  if (followingId === myId.value) {
    cmjs.prompt.info("不能关注自己")
    return
  }

  focuing.value.push(followingId)
  if (!isFollow) {
    // 关注
    API.Follow(followingId)
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        r.value.users[idx].isFollow = true
        cmjs.prompt.success("关注成功")
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })
      .finally(() => {
        focuing.value.splice(focuing.value.indexOf(followingId), 1)
      })

  } else {
    // 取关
    API.CancelFollow(followingId)
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        r.value.users[idx].isFollow = false
        cmjs.prompt.success("已取关")
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })
      .finally(() => {
        focuing.value.splice(focuing.value.indexOf(followingId), 1)
      })
  }
}
</script>

<style lang="less" scoped>
.fan-page {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    .main {
      width: 100%;
      display: flex;
      gap: 20px;

      .avatar {
        cursor: pointer;
        border-radius: 50%;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .nickname {
          color: #303133;
          font-size: 16px;
          cursor: pointer;
        }

        .nickname:hover {
          color: #606266;
        }

        .signature {
          color: #909399;
          font-size: 14px;
        }
      }
    }
  }

  .page {
    display: flex;
    justify-content: center;
  }
}
</style>