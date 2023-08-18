<template>
  <div class="set-container">
    <div>
      <span class="notice">&emsp;&emsp;昵称：</span>
      <input v-model="meSetting.nickname" id="nickname" class="nickname" @blur="showNNMDY">
      <span v-show="nnmdy" class="iconfont el-icon-info nnmdy">已修改</span>
      <span class="info">注：修改一次昵称需要消耗5个硬币</span>
    </div>

    <div>
      <span class="notice">我的签名：</span>
      <input v-model="meSetting.signature" class="signature">
    </div>

    <div>
      <span class="notice">&emsp;&emsp;性别：</span>
      <el-radio-group v-model="meSetting.gender">
        <el-radio-button label="男" />
        <el-radio-button label="女" />
        <el-radio-button label="保密" />
      </el-radio-group>
    </div>

    <div>
      <span class="notice">出生日期：</span>
      <el-config-provider :locale="locale">
        <el-date-picker v-model="meSetting.birthday" value-format="YYYYMMDD" type="date"
          placeholder="选择日期" :disabled-date="birthdaySelectCheck" />
      </el-config-provider>
      <span class="info">注：可直接输入，格式为：YYYY-MM-DD</span>
    </div>

    <div class="personal-tag-row">
      <span style="min-width: 75px;" class="notice">个人标签：</span>
      <div class="tag-container">
        <el-tag class="tag" v-for="tag in meSetting.tag" closable @close="delTag(tag)">
          {{ tag }}
        </el-tag>
        <input v-if="newTagInputVisible" class="new-tag-input" ref="newTagInput" v-model="newTagInputValue"
          @keyup.enter="newTag" @blur="newTag">
        <el-button class="new-tag-btn" v-else size="small" @click="showNewTagInput">
          + New Tag
        </el-button>
      </div>
    </div>
    
    <div class="btn-row">
      <el-button @click="saveSetting" id="sava-setting-btn" type="primary" size="large">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import mockMeSetting from "../../mock/me/setting.json"
import * as common from "../../common"
import { useStore } from "../../store"

type MeSetting = {
  nickname: string
  signature: string
  gender: string
  birthday: string
  tag: string[]
}

const store = useStore()
store.setMeCurTitle("我的信息")

let meSetting: MeSetting = reactive(getMeSetting())

const locale = zhCn
const oldNickname = meSetting.nickname

const newTagInput = ref<HTMLInputElement>()
let saveSettingBtn: HTMLButtonElement

let nnmdy = ref(false)
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)

onMounted(()=>{
  saveSettingBtn = document.getElementById("sava-setting-btn") as HTMLButtonElement
})

function getMeSetting() {
  return mockMeSetting //TODO
}

function showNNMDY() {
  meSetting.nickname = meSetting.nickname.trim()
  if (meSetting.nickname !== oldNickname) {
    nnmdy.value = true
  } else {
    nnmdy.value = false
  }
}

function birthdaySelectCheck(date: Date) {
  return date.getTime() > Date.now()
}

function delTag(tag: string) {
  meSetting.tag.splice(meSetting.tag.indexOf(tag), 1)
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
    if (meSetting.tag.includes(val)) {
      common.showError("该标签已存在")
      newTagInput.value!.focus()
      return
    }
    meSetting.tag.push(val)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
}

function saveSetting() {
  if (saveSettingBtn.disabled) {
    return
  }
  meSetting.nickname = meSetting.nickname.trim()
  meSetting.signature = meSetting.signature.trim()
  if (meSetting.nickname.length === 0) {
    common.showError("请输入昵称")
    return
  }
  if (meSetting.nickname.length > 20) {
    common.showError("昵称的长度最大为20")
    return
  }
  if (meSetting.signature.length > 50) {
    common.showError("签名的长度最大为50")
    return
  }
  common.btnCD(saveSettingBtn, 5)
  nnmdy.value = false
  common.showSuccess("保存成功")
}
</script>

<style scoped>
.set-container {
  width: 800px;
}

.set-container>*:not(:last-child) {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.set-container .notice {
  font-size: 14px;
  margin-right: 10px;
}

.set-container .info {
  font-size: 14px;
  margin-left: 10px;
  color: #909399;
}

.set-container .nickname {
  width: 196px;
}

.set-container .nnmdy {
  font-size: 14px;
  margin-left: 10px;
  color: #F56C6C;
}

.set-container .signature {
  width: 695px;
}

.set-container .personal-tag-row {
  margin-top: -5px;
}

.set-container .tag-container {
  margin-left: -5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.set-container .tag,
.set-container .new-tag-btn {
  min-width: 100px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
}

.set-container .new-tag-input {
  width: 78px;
}

.set-container .btn-row {
  text-align: center;
}

.set-container input {
  outline: none;
  border-radius: 5px;
  border: 1px solid #c8c9cc;
  padding: 5px 10px;
  font-size: 14px;
  height: 18px;
}

.set-container input:hover {
  border: 1px solid #b1b3b8;
}

.set-container input:focus {
  border: 1px solid #409EFF;
}
</style>