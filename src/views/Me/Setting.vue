<template>
  <div v-loading="loading" class="set-container">
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
        <el-date-picker v-model="meSetting.birthday" value-format="YYYYMMDD" type="date" placeholder="选择日期"
          :disabled-date="birthdaySelectCheck" />
      </el-config-provider>
      <span class="info">注：可直接输入，格式为：YYYY-MM-DD</span>
    </div>

    <div>
      <span style="min-width: 75px;" class="notice">个人标签：</span>
      <TagInput :tags="meSetting.tags" :limit="10"></TagInput>
    </div>

    <div class="btn-row">
      <el-button v-blur @click="saveSetting" id="sava-setting-btn" type="primary" size="large">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import TagInput from '@/components/common/TagInput.vue'
import { useStore } from "@/store"
import cmjs from '@/cmjs'
import * as API from '@/api/user'
import _ from 'lodash'

type MeSetting = {
  nickname: string
  signature: string
  gender: string
  birthday: string
  tags: string[]
}

const store = useStore()
store.setMeCurTitle("我的信息")

let meSetting = ref<MeSetting>({ nickname: "", signature: "", gender: "保密", birthday: "", tags: [] })
let meSettingCopy = ref<MeSetting>({ nickname: "", signature: "", gender: "保密", birthday: "", tags: [] })
let loading = ref(false)
getMeInfo()

const locale = zhCn
let oldNickname = ref("")

let saveSettingBtn: HTMLButtonElement

let nnmdy = ref(false) // nickname modify

onMounted(() => {
  saveSettingBtn = document.getElementById("sava-setting-btn") as HTMLButtonElement
})

function getMeInfo() {
  loading.value = true
  API.meInfo()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取我的信息失败")
        return
      }

      if (res.data.tags === null) {
        res.data.tags = []
      }
      meSetting.value = res.data
      meSettingCopy.value = _.cloneDeep(res.data)
      oldNickname.value = meSetting.value.nickname

      watch(meSetting.value, newVal => {
        if (!_.isEqual(newVal, meSettingCopy.value)) {
          store.switchAsk = true
        } else {
          store.switchAsk = false
        }
      })
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function saveSetting() {
  if (saveSettingBtn.disabled) {
    return
  }

  meSetting.value.nickname = meSetting.value.nickname.trim()
  meSetting.value.signature = meSetting.value.signature.trim()
  if (meSetting.value.nickname.length === 0) {
    cmjs.prompt.error("请输入昵称")
    return
  }
  if (meSetting.value.nickname.length > 20) {
    cmjs.prompt.error("昵称的长度最大为20")
    return
  }
  if (meSetting.value.signature.length > 50) {
    cmjs.prompt.error("签名的长度最大为50")
    return
  }

  if (!meSetting.value.birthday) {
    meSetting.value.birthday = ""
  }

  API.meInfoUpdate(meSetting.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      nnmdy.value = false
      cmjs.prompt.success("保存成功")
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })

  cmjs.util.btnCD(saveSettingBtn, 5)
}

function showNNMDY() {
  meSetting.value.nickname = meSetting.value.nickname.trim()
  if (meSetting.value.nickname !== oldNickname.value) {
    nnmdy.value = true
  } else {
    nnmdy.value = false
  }
}

function birthdaySelectCheck(date: Date) {
  return date.getTime() > Date.now()
}
</script>

<style lang="less" scoped>
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