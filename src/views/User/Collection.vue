<template>
  <el-card>
    <div v-if="data!.collections.length > 0 || isMe" class="container">
      <div class="left">
        <ul>
          <li v-if="isMe" @click="newCollection" class="new-favlist">新建合集</li>
          <li v-for="(item, idx) in data!.collections" :class="idx === activeId ? 'active' : 'inactive'" :title=item.name
            @click="activeId = idx">{{ item.name }}</li>
        </ul>
      </div>

      <div class="divide"></div>

      <div v-if="data!.collections.length > 0" class="right">
        <div class="right-head">
          <div class="info">
            <div class="title">{{ data!.collections[activeId].name }}</div>
            <div class="num">共{{ data!.collections[activeId].videos.length }}个视频</div>
            <el-tooltip effect="light" :content="data!.collections[activeId].introduction || '-'" placement="bottom">
              <span class="iconfont el-icon-browse num">简介</span>
            </el-tooltip>
          </div>
          <div class="ctl" v-if="isMe">
            <span @click="addToCollection" class="add">+添加</span>
            <span @click="modifyCollection" class="iconfont el-icon-edit modify">修改</span>
            <span @click="deleteCollection" class="iconfont el-icon-ashbin delete">删除</span>
          </div>
        </div>

        <div v-if="data!.collections[activeId].videos.length > 0">
          <div class="right-body">
            <div v-for="(v, idx) in data!.collections[activeId].videos">
              <div class="card-container">
                <VideoCard :data="v" type="small" :extra="isMe ? [
                  { name: '移出合集', cb: () => { removeItem(idx) } },
                  { name: '移动到', cb: () => { cmjs.prompt.info('敬请期待') } },
                ] : undefined"></VideoCard>
              </div>
            </div>
          </div>

          <el-pagination class="page" v-model:current-page="curPage" background layout="prev, pager, next" :page-size="12"
            :total=data!.collections[activeId].total hide-on-single-page />
        </div>

        <el-empty v-else description="该合集内暂无视频" />
      </div>

      <div class="right" v-else>
        <el-empty description="暂无合集" />
      </div>
    </div>

    <div v-else>
      <el-empty description="暂无合集" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VideoCard from "@/components/common/VideoCard.vue"
import { ElMessageBox } from 'element-plus'
import cmjs from '@/cmjs'
import { useRoute } from 'vue-router'
import { useStore } from "@/store"
import Data from '@/mock/user/collection.json'

type Data = {
  collections: Collection[]
}

type Collection = {
  id: number
  name: string,
  introduction: string
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
  expire?: boolean // 视频已失效
}

const route = useRoute()
const store = useStore()
store.$subscribe((_, state) => {
  if (state.isLogin) {
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
let newIntro = ref("")
let inputModify = ref(false)
let curPage = ref(1)

watch(curPage, newVal => {
  setData()
})

watch(activeId, newVal => {
  if (newVal !== -1) {
    // 删除合集时由于activeId可能没有变，所以在删除合集的函数内会手动调用一次
    cmjs.util.addUrlQuery("id", data.value!.collections[newVal].id)
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

  if (data.value.collections.length > 0) {
    if (!queryId) {
      activeId.value = 0
      if (Number.isNaN(queryId)) {
        cmjs.prompt.error("合集不存在")
      }
    } else {
      let i = 0
      for (; i < data.value.collections.length; i++) {
        if (data.value.collections[i].id === queryId) {
          activeId.value = i
          break
        }
      }
      if (i === data.value.collections.length) {
        activeId.value = 0
        cmjs.prompt.error("合集不存在")
      }
    }
  } else if (queryId || Number.isNaN(queryId)) {
    cmjs.util.clearUrlQuery()
    cmjs.prompt.error("合集不存在")
  }

  store.setUserMenuCollectionNum(data.value.collections.length)
}

function newCollection() {
  ElMessageBox({
    title: '新建合集',
    message: h('div', { style: 'margin-right: 20px;' }, [
      h('div', null, [
        h('span', null, '请输入新合集的名称'),
      ]),
      h('div', null, [
        h('input', { id: 'new-name', onInput: onNewNameChange }),
      ]),
      h('div', { style: 'margin-top: 20px;' }, [
        h('span', null, '请输入新合集的简介'),
      ]),
      h('div', null, [
        h('input', { id: 'new-intro', onInput: onNewIntroChange }),
      ]),
      h('span', { id: 'notice' }, '名称的长度范围为1～20，简介的长度最大为50'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeNewCollectionWindowClose,
  })

  setTimeout(() => {
    (document.getElementById("new-name") as HTMLInputElement).focus()
  }, 100)
}

function beforeNewCollectionWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim()
    newIntro.value = newIntro.value.trim()
    if (!checkInput()) {
      return
    }

    // TODO api
    const id = Date.now() // id由后端返回
    data.value!.collections.push({ id: id, name: newName.value, introduction: newIntro.value, total: 0, videos: [] })
    activeId.value = data.value!.collections.length - 1
    store.setUserMenuCollectionNum(data.value!.collections.length)
    cmjs.prompt.success("新建成功")
  }
  newName.value = ""
  newIntro.value = ""
  inputModify.value = false
  done()
}

function onNewNameChange() {
  inputModify.value = true
  newName.value = (document.getElementById("new-name") as HTMLInputElement).value;
  checkInput()
}

function onNewIntroChange() {
  inputModify.value = true
  newIntro.value = (document.getElementById("new-intro") as HTMLInputElement).value;
  checkInput()
}

function checkInput() {
  if (newName.value.length >= 1 && newName.value.length <= 20 && newIntro.value.length <= 50) {
    (document.getElementById("notice") as HTMLSpanElement).style.display = "none"
    return true
  }
  (document.getElementById("notice") as HTMLSpanElement).style.display = "inline"
  return false
}

function addToCollection() {
  cmjs.prompt.info("敬请期待")
  //TODO 这里需要用到远程搜索：https://element-plus.org/zh-CN/component/autocomplete.html#%E8%BF%9C%E7%A8%8B%E6%90%9C%E7%B4%A2
}

function modifyCollection() {
  ElMessageBox({
    title: '修改合集',
    message: h('div', { style: 'margin-right: 20px;' }, [
      h('div', null, [
        h('span', null, '请输入新合集的名称'),
      ]),
      h('div', null, [
        h('input', { id: 'new-name', onInput: onNewNameChange }),
      ]),
      h('div', { style: 'margin-top: 20px;' }, [
        h('span', null, '请输入新合集的简介'),
      ]),
      h('div', null, [
        h('input', { id: 'new-intro', onInput: onNewIntroChange }),
      ]),
      h('span', { id: 'notice' }, '名称的长度范围为1～20，简介的长度最大为50'),
    ]),
    showClose: false,
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    lockScroll: false,
    beforeClose: beforeModifyCollectionWindowClose,
  })

  setTimeout(() => {
    newName.value = data.value!.collections[activeId.value].name
    newIntro.value = data.value!.collections[activeId.value].introduction;
    (document.getElementById("new-name") as HTMLInputElement).value = newName.value;
    (document.getElementById("new-name") as HTMLInputElement).select();
    (document.getElementById("new-intro") as HTMLInputElement).value = newIntro.value
  }, 100);
}

function beforeModifyCollectionWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim()
    newIntro.value = newIntro.value.trim()
    if (!checkInput()) {
      return
    }

    if (inputModify.value) {
      // TODO api
      data.value!.collections[activeId.value].name = newName.value
      data.value!.collections[activeId.value].introduction = newIntro.value
    }
    cmjs.prompt.success("修改成功")
  }
  newName.value = ""
  newIntro.value = ""
  inputModify.value = false
  done()
}

function deleteCollection() {
  ElMessageBox.confirm('你确认要删除该合集吗？', '确认提示', {
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
      data.value!.collections.splice(activeId.value, 1)
      if (activeId.value >= data.value!.collections.length) {
        activeId.value = data.value!.collections.length - 1
      } else {
        cmjs.util.addUrlQuery("id", data.value!.collections[activeId.value].id)
      }
      store.setUserMenuCollectionNum(data.value!.collections.length)
      cmjs.prompt.success('删除成功')
    })
}

function removeItem(idx: number) {
  data.value!.collections[activeId.value].videos.splice(idx, 1)
  data.value!.collections[activeId.value].total--
  cmjs.prompt.success("移出合集成功")
  if (data.value!.collections[activeId.value].total > 12) {
    //TODO api：若有多的视频，则请求一个补充到最后
  }
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
  gap: 20px;
}

.right-head .info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right-head .info .title {
  font-size: 30px;
  max-width: 540px;
}

.right-head .info .num {
  font-size: 14px;
  color: #909399;
}

.right-head .ctl {
  display: flex;
  gap: 20px;

  .add,
  .modify,
  .delete {
    font-size: 14px;
    cursor: pointer;
  }

  .add {
    color: #67C23A;
  }

  .add:hover {
    color: #529b2e;
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
#new-name,
#new-intro {
  width: 100%;
  margin-top: 10px;
  border-radius: 5px;
  height: 25px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #dedfe0;
}

#new-name:hover,
#new-intro:hover {
  border-color: #c8c9cc;
}

#notice {
  color: red;
  font-size: 12px;
  display: none;
}
</style>