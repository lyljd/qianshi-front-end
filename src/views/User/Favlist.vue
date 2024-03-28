<template>
  <el-card>
    <div v-if="data!.favlists.length > 0 || isMe" class="container">
      <div class="left">
        <ul>
          <li v-if="isMe" @click="newFavlist" class="new-favlist">新建收藏夹</li>
          <li v-for="(item, idx) in data!.favlists" :class="idx === activeId ? 'active' : 'inactive'" :title="item.name"
            @click="activeId = idx">{{ item.name }}</li>
        </ul>
      </div>

      <div class="divide"></div>

      <div v-if="data!.favlists.length > 0" class="right">
        <div class="right-head">
          <div style="display: flex; gap: 20px;">
            <div class="info">
              <div class="title">{{ data!.favlists[activeId].name }}</div>
              <div class="num">共{{ data!.favlists[activeId].videos.length }}个视频</div>
            </div>
            <div class="ctl" v-if="isMe">
              <span @click="modifyFavlist" class="iconfont el-icon-edit modify">修改</span>
              <span @click="deleteFavlist" class="iconfont el-icon-ashbin delete">删除</span>
            </div>
          </div>
          <div class="flex-center" v-if="isMe">
            <span class="span">公开</span>
            <el-switch @change="openChange" v-model="data!.favlists[activeId].open" />
          </div>
        </div>

        <div v-if="data!.favlists[activeId].videos.length > 0">
          <div class="right-body">
            <div v-for="(v, idx) in data!.favlists[activeId].videos">
              <div class="card-container">
                <VideoCard :data="v" type="small-star" :extra="isMe ? [
                  { name: '取消收藏', cb: () => { deleteItem(idx) } },
                  { name: '移动到', cb: () => { cmjs.prompt.info('敬请期待') } },
                  { name: '复制到', cb: () => { cmjs.prompt.info('敬请期待') } },
                ] : undefined"></VideoCard>
              </div>
            </div>

            <el-pagination class="page" v-model:current-page="curPage" background layout="prev, pager, next"
              :page-size="12" :total="data!.favlists[activeId].total" hide-on-single-page />
          </div>
        </div>

        <el-empty v-else description="该收藏夹内暂无视频" />
      </div>

      <div class="right" v-else>
        <el-empty description="暂无收藏夹" />
      </div>
    </div>

    <div v-else>
      <el-empty :description="data!.open ? '暂无收藏夹' : '用户未公开'" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VideoCard from "@/components/common/VideoCard.vue"
import { ElMessageBox } from 'element-plus'
import cmjs from '@/cmjs'
import { useRoute } from 'vue-router'
import { useStore } from "@/store"
import Data from '@/mock/user/favlist.json'

type Data = {
  favlists: Favlist[],
  open: boolean
}

type Favlist = {
  id: number
  name: string,
  open: boolean,
  total: number
  videos: Video[]
}

type Video = {
  vid: number
  videoUrl: string
  coverUrl: string
  playNum: number
  danmuNum: number
  duration: number
  title: string
  uid: number
  nickname: string
  date: number
  starDate: number
  expire?: boolean // 视频已失效
  vip: boolean
}

const route = useRoute()
const store = useStore()
watch(() => store.isLogin, (newVal: boolean) => {
  if (newVal) {
    isMe.value = cmjs.biz.verifyLoginUid(parseInt(route.params.uid as string))
  } else {
    isMe.value = false
  }
  setData()
})

let isMe = ref(cmjs.biz.verifyLoginUid(parseInt(route.params.uid as string)))
let data = ref<Data>()
let activeId = ref(-1)
let newName = ref("")
let inputModify = ref(false)
let curPage = ref(1)

watch(curPage, newVal => {
  setData()
})

watch(activeId, newVal => {
  if (newVal !== -1) {
    // 删除收藏夹时由于activeId可能没有变，所以在删除合集的函数内会手动调用一次
    cmjs.util.addUrlQuery("id", data.value!.favlists[newVal].id)
  } else {
    cmjs.util.clearUrlQuery()
  }
})

const queryId = cmjs.util.getUrlQuery("id")
setData(queryId ? parseInt(queryId) : undefined)

function setData(queryId?: number) {
  // TODO api
  console.log("获取第" + curPage.value + "页的数据")
  data.value = Data

  if (data.value.favlists.length > 0) {
    if (!queryId) {
      activeId.value = 0
      if (Number.isNaN(queryId)) {
        cmjs.prompt.error("收藏夹不存在")
      }
    } else {
      let i = 0
      for (; i < data.value.favlists.length; i++) {
        if (data.value.favlists[i].id === queryId) {
          activeId.value = i
          break
        }
      }
      if (i === data.value.favlists.length) {
        activeId.value = 0
        cmjs.prompt.error("收藏夹不存在或未公开")
      }
    }
  } else if (queryId || Number.isNaN(queryId)) {
    cmjs.util.clearUrlQuery()
    cmjs.prompt.error("收藏夹不存在或未公开")
  }

  store.setUserMenuFavlistNum(data.value.favlists.length)
}

function newFavlist() {
  ElMessageBox({
    title: '新建收藏夹',
    message: h('div', { style: 'margin-right: 20px;' }, [
      h('div', null, [
        h('span', null, '请输入新收藏夹的名称'),
      ]),
      h('div', null, [
        h('input', { id: 'new-name', onInput: onNewNameChange }),
      ]),
      h('span', { id: 'notice' }, '名称的长度范围为1～20'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeNewFavlistWindowClose,
  })

  setTimeout(() => {
    (document.getElementById("new-name") as HTMLInputElement).focus()
  }, 100)
}

function beforeNewFavlistWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim();
    if (!checkInput()) {
      return
    }

    // TODO api
    const id = Date.now() // id由后端返回
    data.value!.favlists.push({ id: id, name: newName.value, open: true, total: 0, videos: [] })
    activeId.value = data.value!.favlists.length - 1
    store.setUserMenuFavlistNum(data.value!.favlists.length)
    cmjs.prompt.success("新建成功")
  }
  newName.value = ""
  inputModify.value = false
  done()
}

function onNewNameChange() {
  inputModify.value = true
  newName.value = (document.getElementById("new-name") as HTMLInputElement).value;
  checkInput()
}

function checkInput() {
  if (newName.value.length >= 1 && newName.value.length <= 20) {
    (document.getElementById("notice") as HTMLSpanElement).style.display = "none"
    return true
  }
  (document.getElementById("notice") as HTMLSpanElement).style.display = "inline"
  return false
}

function modifyFavlist() {
  ElMessageBox({
    title: '新建收藏夹',
    message: h('div', { style: 'margin-right: 20px;' }, [
      h('div', null, [
        h('span', null, '请输入新收藏夹的名称'),
      ]),
      h('div', null, [
        h('input', { id: 'new-name', onInput: onNewNameChange }),
      ]),
      h('span', { id: 'notice' }, '名称的长度范围为1～20'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeModifyFavlistWindowClose,
  })

  setTimeout(() => {
    newName.value = data.value!.favlists[activeId.value].name;
    (document.getElementById("new-name") as HTMLInputElement).value = newName.value;
    (document.getElementById("new-name") as HTMLInputElement).select();
  }, 100);
}

function beforeModifyFavlistWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim()
    if (!checkInput()) {
      return
    }

    if (inputModify.value) {
      // TODO api
      data.value!.favlists[activeId.value].name = newName.value
    }
    cmjs.prompt.success("修改成功")
  }
  newName.value = ""
  inputModify.value = false
  done()
}

function deleteFavlist() {
  ElMessageBox.confirm('你确认要删除该收藏夹吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      // TODO api
      data.value!.favlists.splice(activeId.value, 1)
      if (activeId.value >= data.value!.favlists.length) {
        activeId.value = data.value!.favlists.length - 1
      } else {
        cmjs.util.addUrlQuery("id", data.value!.favlists[activeId.value].id)
      }
      store.setUserMenuFavlistNum(data.value!.favlists.length)
      cmjs.prompt.success('删除成功')
    })
}

function deleteItem(idx: number) {
  data.value!.favlists[activeId.value].videos.splice(idx, 1)
  data.value!.favlists[activeId.value].total--
  cmjs.prompt.success("取消收藏成功")
  if (data.value!.favlists[activeId.value].total > 12) {
    //TODO api：若有多的视频，则请求一个补充到最后
  }
}

function openChange(newVal: boolean) {
  // TODO api
  // data.value!.favlists[activeId.value].id
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
}

.left {
  width: 199px;
  margin-left: -20px;
  margin-top: -20px;
  margin-bottom: -20px;
  overflow: auto;
}

.left .new-favlist {
  cursor: pointer;
  background-color: #67C23A;
  color: white;
}

.left ul {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.active {
  background-color: #409EFF;
  color: white;
  cursor: default;
}

.inactive {
  cursor: pointer;
}

.inactive:hover {
  background-color: #f4f4f5;
}

.left ul li {
  list-style-type: none;
  padding: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #dedfe0;
}

.divide {
  width: 1px;
  background-color: #dedfe0;
  margin-top: -20px;
  margin-bottom: -20px;
}

.right {
  width: 920px;
  display: flex;
  flex-direction: column;
}

.right-head {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.right-head .info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right-head .info .title {
  font-size: 30px;
  max-width: 600px;
}

.right-head .info .num {
  font-size: 14px;
  color: #909399;
  cursor: default;
}

.right-head .ctl {
  display: flex;
  align-items: center;
  gap: 20px;

  .modify,
  .delete {
    font-size: 14px;
    cursor: pointer;
  }

  .modify {
    color: #E6A23C;
  }

  .modify:hover {
    color: #b88230;
  }

  .delete {
    color: #F56C6C;
  }

  .delete:hover {
    color: #c45656;
  }
}

.right-body {
  display: flex;
  flex-wrap: wrap;
  width: 920px;
  margin-left: 20px;
  gap: 20px;
}

.page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

<style>
#new-name {
  width: 100%;
  margin-top: 10px;
  border-radius: 5px;
  height: 25px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #dedfe0;
}

#new-name:hover {
  border-color: #c8c9cc;
}

#notice {
  color: red;
  font-size: 12px;
  display: none;
}
</style>