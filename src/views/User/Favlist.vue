<template>
  <el-card style="margin-left: -1px;margin-right: -1px;">
    <div v-if="mockFavlistNum > 0 || isMe" class="container">
      <div class="left">
        <ul>
          <li v-if="isMe" @click="newFavlist" class="new-favlist">新建收藏夹</li>
          <li v-for="(item, index) in mockFavlistNum"
            :class="{ active: index === activeId, inactive: index !== activeId }" :title="'收藏夹' + item.toString()"
            @click="activeId = index">收藏夹{{ item }}</li>
        </ul>
      </div>

      <div class="divide"></div>

      <div class="right">
        <div v-show="mockFavlistNum > 0" class="right-head">
          <div class="info">
            <div class="title">{{ title }}</div>
            <div class="num">共{{ mockVideoTotalNum }}个视频</div>
            <span v-if="isMe" @click="deleteFavlist" class="iconfont el-icon-ashbin delete">删除</span>
          </div>
          <div v-if="isMe" class="option">
            <span class="span">公开</span>
            <el-switch v-model="open" />
          </div>
        </div>

        <div v-if="mockVideoNum > 0" class="right-body">
          <div v-for="() in mockVideoNum">
            <VideoCard class="card" :data="mockVideo"></VideoCard>
            <el-popconfirm @confirm="deleteItem" width="212" hide-icon title="你确认要取消收藏该视频吗？" confirm-button-text="确认"
              cancel-button-text="取消">
              <template #reference>
                <span v-if="isMe" class="iconfont el-icon-ashbin delete-item"></span>
              </template>
            </el-popconfirm>
          </div>
        </div>

        <div class="right-foot">
          <el-pagination background layout="prev, pager, next" :page-size="9" :total="mockVideoTotalNum"
            :hide-on-single-page="true" />
        </div>

        <el-empty v-show="mockVideoNum === 0" description="暂无收藏" />
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无收藏" />
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
  "date": 1685599556000
}
const mockFavlistNum = 6
const mockVideoNum = 9
const mockVideoTotalNum = 13

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
let open = ref(true)
let newName = ref("")

onMounted(() => {
  route = useRoute();
  isMe.value = common.isMe(parseInt(route.params.uid as string))
})

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
  //TODO 向数组添加一个元素，并设置activeId为数组长度-1
}

function onNewNameChange() {
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

function beforeNewFavlistWindowClose(action: string, _: any, done: Function) {
  if (action === "confirm") {
    newName.value = newName.value.trim();
    if (!checkInput()) {
      return
    }
    ElMessage({
      type: 'success',
      offset: 77,
      message: `新收藏夹的名称为：${newName.value}`,
    })
  }
  newName.value = ""
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
      ElMessage({
        type: 'success',
        offset: 77,
        message: '删除成功',
      })
    })
  //TODO 删除后若当前activeId不为0则减1
}

function deleteItem() {
  ElMessage({
    type: 'success',
    offset: 77,
    message: "取消收藏成功",
  })
  //TODO 若有多的视频，则请求一个补充到最后
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