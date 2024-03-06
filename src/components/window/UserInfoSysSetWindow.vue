<template>
  <el-dialog v-model="dialogVisible" title="调整信息" class="uissw" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <div>
        <div class="span">头像：</div>
        <Avatar :url="data.coverUrl" size="medium" :upload="{ handler: avatarHandler }"></Avatar>
      </div>

      <div>
        <div class="span">昵称：</div>
        <el-input v-model="data.nickname" />
      </div>

      <div>
        <div class="span">个性签名：</div>
        <el-input v-model="data.signature" />
      </div>

      <div>
        <div class="span">性别：</div>
        <el-radio-group v-model="data.gender">
          <el-radio-button label="男" />
          <el-radio-button label="女" />
          <el-radio-button label="保密" />
        </el-radio-group>
      </div>

      <div>
        <div class="span">出生日期：</div>
        <el-config-provider :locale="locale">
          <el-date-picker v-model="data.birthday" value-format="YYYYMMDD" type="date" placeholder="选择日期"
            :disabled-date="birthdaySelectCheck" />
        </el-config-provider>
      </div>

      <div>
        <div class="span">个人标签：</div>
        <div class="tag-container">
          <el-tag class="tag" v-for="tag in data.tags" closable @close="delTag(tag)">
            {{ tag }}
          </el-tag>
          <input v-if="newTagInputVisible" class="new-tag-input" ref="newTagInput" v-model="newTagInputValue"
            @keyup.enter="newTag" @blur="newTag" />
          <el-button v-blur class="new-tag-btn" v-else size="small" @click="showNewTagInput">
            + New Tag
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button v-blur :disabled="uploading" @click="closeWindow">取消</el-button>
      <el-button v-blur :disabled="uploading" @click="save" type="primary">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Avatar from '@/components/common/Avatar.vue'
import cmjs from '@/cmjs'
import Data from "@/mock/manage/userInfo.json"
import { useStore } from "@/store"
import { ElMessageBox } from "element-plus"
import zhCn from 'element-plus/es/locale/lang/zh-cn'

type User = {
  coverUrl: string,
  nickname: string,
  signature: string,
  gender: string,
  birthday: string,
  tags: string[],
}

const store = useStore()

const locale = zhCn

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openWindow)

const newTagInput = ref<HTMLInputElement>()

let dialogVisible = ref(false)
let data: User
let dataCopy: User
let afterSuccDo: Function = () => { }
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)
let uploading = ref(false)

function avatarHandler(file: File, succ: Function, fail: Function) {
  // TODO api
  uploading.value = true
  console.log(file)
  setTimeout(() => {
    succ()
    // fail()
    uploading.value = false
  }, 2000)
}

function userDataDeepCopy(up: User): User {
  let u: User = {
    coverUrl: up.coverUrl,
    nickname: up.nickname,
    signature: up.signature,
    gender: up.gender,
    birthday: up.birthday,
    tags: up.tags
  }
  return u
}

function getUserData(uid: number): User {
  // TODO api
  console.log(uid)

  return userDataDeepCopy(Data)
}

function openWindow(uid: number, afterSuccDoP?: Function) {
  data = reactive(getUserData(uid))
  dataCopy = reactive(getUserData(uid))
  if (afterSuccDoP) {
    afterSuccDo = afterSuccDoP
  }
  dialogVisible.value = true

  watch(data, newVal => {
    if (newVal !== dataCopy) {
      store.switchAsk = true
    }
    console.log(newVal, dataCopy)
  })
}

function closeWindow() {
  if (store.switchAsk) {
    ElMessageBox.confirm(
      '你所做的更改可能未保存',
      '关闭窗口？',
      {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'warning',
        autofocus: false,
        showClose: false,
      }
    ).then(() => {
      store.switchAsk = false
      dialogVisible.value = false
    }).catch(() => { })
  } else {
    dialogVisible.value = false
  }
}

function save() {
  // TODO api
  afterSuccDo(data)
  store.switchAsk = false
  closeWindow()
  cmjs.prompt.success("保存成功")
}

function birthdaySelectCheck(date: Date) {
  return date.getTime() > Date.now()
}

function delTag(tag: string) {
  data.tags.splice(data.tags.indexOf(tag), 1)
}

function showNewTagInput() {
  newTagInputVisible.value = true
  nextTick(() => {
    newTagInput.value!.focus()
  })
}

function newTag() {
  let val = newTagInputValue.value
  if (val) {
    if (data.tags.includes(val)) {
      cmjs.prompt.error("该标签已存在")
      newTagInput.value!.focus()
      return
    }
    data.tags.push(val)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
}
</script>

<style lang="less" scoped>
.uissw .body>div {
  display: flex;
  align-items: center;
}

.uissw .body>div:not(:last-child) {
  margin-bottom: 20px;
}

.uissw .body .span {
  width: 75px;
  text-align: right;
}

.uissw .body .tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  width: calc(100% - 75px);
}

.uissw .body .tag,
.uissw .body .new-tag-btn {
  min-width: 100px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
}

.uissw .body .new-tag-input {
  width: 78px;
}

.uissw .body input {
  outline: none;
  border-radius: 5px;
  border: 1px solid #c8c9cc;
  padding: 5px 10px;
  font-size: 14px;
  height: 18px;
}

.uissw .body input:hover {
  border: 1px solid #b1b3b8;
}

.uissw .body input:focus {
  border: 1px solid #409EFF;
}
</style>

<style>
.uissw .el-dialog__header,
.uissw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.uissw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.uissw .el-button+.el-button {
  margin-left: 12px !important;
}

.uissw .el-input {
  width: calc(100% - 75px);
}
</style>