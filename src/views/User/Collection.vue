<template>
  <el-card style="margin-left: -1px; margin-right: -1px;">
    <div v-if="mockCollectionNum > 0 || isMe" class="container">
      <div class="left">
        <ul>
          <li v-if="isMe" @click="newCollection" class="new-favlist">新建合集
          </li>
          <li v-for="(item, index) in mockCollectionNum"
            :class="{ active: index === activeId, inactive: index !== activeId }" :title="'合集' + item.toString()"
            @click="activeId = index">合集{{ item }}</li>
        </ul>
      </div>

      <div class="divide"></div>

      <div class="right">
        <div v-show="mockCollectionNum > 0" class="right-head">
          <div class="info">
            <div class="title">{{ title }}</div>
            <div class="num">共{{ mockVideoTotalNum }}个视频</div>
            <div class="num">{{ common.numFormatterW(0) }}播放</div>
            <el-tooltip effect="light" :content="'都是些奇奇怪怪的东西' || '-'" placement="bottom">
              <span class="iconfont el-icon-browse num">简介</span>
            </el-tooltip>
            <span @click="addToCollection" v-if="isMe" class="add">+添加</span>
            <span v-if="isMe" @click="deleteCollection" class="iconfont el-icon-ashbin delete">删除</span>
          </div>
        </div>

        <div v-if="mockVideoNum > 0" class="right-body">
          <div v-for="() in mockVideoNum">
            <VideoCard class="card" :data="mockVideo"></VideoCard>
            <el-popconfirm @confirm="removeItem" width="212" hide-icon title="你确认要从此合集中移除该视频吗？" confirm-button-text="确认"
              cancel-button-text="取消">
              <template #reference>
                <span v-if="isMe" class="iconfont el-icon-ashbin delete-item"></span>
              </template>
            </el-popconfirm>
          </div>
        </div>

        <div class="right-foot">
          <el-pagination background layout="prev, pager, next" :page-size="9" :total=mockVideoTotalNum
            :hide-on-single-page="true" />
        </div>

        <el-empty v-show="mockVideoNum === 0" description="暂无合集" />
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无合集" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import VideoCard from "../../components/VideoCard.vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import * as common from "../../common"
import { useRoute } from 'vue-router'
import { useStore } from "../../store"

const mockVideo = {
  "vid": 0,
  "coverUrl": "",
  "playNum": 0,
  "danmuNum": 0,
  "duration": 0,
  "title": "标题",
  "uid": 2,
  "nickname": "admin",
  "date": 1685799558000
}
const mockCollectionNum = 3
const mockVideoNum = 4
const mockVideoTotalNum = 4

const store = useStore()
store.$subscribe((_, state) => {
  if (state.isLogin) {
    isMe.value = common.isMe(parseInt(route.params.uid as string))
  } else {
    isMe.value = false
  }
})

let route: any
let isMe = ref(false)
let title = ref("标题")
let activeId = ref(0)
let newName = ref("")
let newIntro = ref("")

onMounted(() => {
  route = useRoute();
  isMe.value = common.isMe(parseInt(route.params.uid as string))
})

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
  //TODO 向数组添加一个元素，并设置activeId为数组长度-1
}

function deleteCollection() {
  ElMessageBox.confirm('你确认要删除该合集吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        offset: 77,
        message: '删除成功',
      })
    })
  //TODO 删除后若当前activeId不为0则减1
}

function removeItem() {
  ElMessage({
    type: 'success',
    offset: 77,
    message: "移除成功",
  })
  //TODO 若有多的视频，则请求一个补充到最后
}

function onNewNameChange() {
  newName.value = (document.getElementById("new-name") as HTMLInputElement).value;
  checkInput()
}

function onNewIntroChange() {
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

function beforeNewCollectionWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim()
    newIntro.value = newIntro.value.trim()
    if (!checkInput()) {
      return
    }
    ElMessage({
      type: 'success',
      offset: 77,
      message: `新合集的名称为：${newName.value}，新合集的简介为：${newIntro.value}`,
    })
  }
  newName.value = ""
  newIntro.value = ""
  done()
}

function addToCollection() {
  alert("敬请期待")
  //TODO 这里需要用到远程搜索：https://element-plus.org/zh-CN/component/autocomplete.html#%E8%BF%9C%E7%A8%8B%E6%90%9C%E7%B4%A2
}
</script>

<style scoped>
.container {
  display: flex;
  height: 746.5px;
}

.left {
  width: 249px;
  margin-left: -20px;
  margin-top: -20px;
  margin-bottom: -20px;
  overflow: scroll;
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

.inactive:hover {
  background-color: #f4f4f5;
  cursor: pointer;
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
  width: 870px;
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
}

.right-head .info .title {
  font-size: 30px;
}

.right-head .info .num {
  font-size: 14px;
  margin-left: 20px;
  color: #909399;
}

.right-head .info .delete {
  margin-left: 20px;
  font-size: 14px;
  color: #F56C6C;
  cursor: pointer;
}

.right-head .info .delete:hover {
  color: #c45656;
}

.right-head .info .add {
  margin-left: 20px;
  font-size: 14px;
  color: #67C23A;
  cursor: pointer;
}

.right-head .info .add:hover {
  color: #529b2e;
}

.right-head .option {
  display: flex;
  align-items: center;
}

.right-head .option .span {
  margin-right: 5px;
  font-size: 14px;
}

.right-body {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
  width: 870px;
  margin-left: 10px;
}

.right-body .card {
  margin: 10px;
}

.right-body .delete-item {
  position: absolute;
  margin-top: -27.5px;
  margin-left: 266px;
  color: #F56C6C;
  cursor: pointer;
}

.right-body .delete-item:hover {
  color: #c45656;
}

.right-foot {
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