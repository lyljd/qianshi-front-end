<template>
  <div class="ti-container">
    <el-tag class="tag" v-for="tag in tags" closable @close="delTag(tag)">
      {{ tag }}
    </el-tag>

    <el-button v-blur class="new-tag-btn" v-show="!inputStatus" size="small" @click="showNewTagInput">
      + New Tag
    </el-button>

    <input class="new-tag-input" v-show="inputStatus" ref="inputRef" v-model="inputValue" @keyup.enter="newTag"
      @blur="newTag">
  </div>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'

const data = defineProps<{
  tags: string[],
  limit: number,
}>()

const inputRef = ref<HTMLInputElement>()

let inputStatus = ref(false)
let inputValue = ref("")

function delTag(tag: string) {
  data.tags.splice(data.tags.indexOf(tag), 1)
}

function showNewTagInput() {
  if (data.tags.length === data.limit) {
    cmjs.prompt.warning("tag数已达上限")
    return
  }

  inputStatus.value = true
  nextTick(() => {
    inputRef.value!.focus()
  })
}

function newTag() {
  inputValue.value = inputValue.value.trim()
  const val = inputValue.value
  if (val !== '') {
    if (data.tags.includes(val)) {
      cmjs.prompt.warning("Tag已存在")
      inputRef.value!.focus()
      return
    }
    data.tags.push(val)
  }
  inputStatus.value = false
  inputValue.value = ""
}
</script>

<style lang="less" scoped>
.ti-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  .tag,
  .new-tag-btn {
    min-width: 100px;
    height: 30px;
    font-size: 14px;
    border-radius: 5px;
  }

  .new-tag-input {
    width: 78px;
    height: 18px;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #409EFF;
    padding: 5px 10px;
  }
}
</style>