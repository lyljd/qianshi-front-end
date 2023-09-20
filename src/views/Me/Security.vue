<template>
  <div class="sec-container">
    <div>
      <span>
        <svg class="icon-symbol" aria-hidden="true">
          <use :xlink:href="meSecurity.isSetPassword ? '#el-icon-success' : '#el-icon-warning'"></use>
        </svg>
        <span class="notice">密码</span>
      </span>
      <span class="info">{{ meSecurity.isSetPassword ? "已设置" : "未设置" }}</span>
      <span class="btn">{{ meSecurity.isSetPassword ? "修改密码" : "设置密码" }}</span>
    </div>

    <el-divider />

    <div>
      <span>
        <svg class="icon-symbol" aria-hidden="true">
          <use :xlink:href="'#el-icon-success'"></use>
        </svg>
        <span class="notice">邮箱</span>
      </span>
      <span class="info">{{ meSecurity.email }}</span>
      <!--后端传邮箱时使用*加密@前面的部分字符，取前3位加上3个*组成，若不足3位则有多少位取多少位，反正最后@前面固定只有6位-->
      <span class="btn">更换邮箱</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import mockMeSecurity from "@/mock/me/security.json"
import { useStore } from "@/store"

type MeSecurity = {
  isSetPassword: boolean
  email: string
}

const store = useStore()
store.setMeCurTitle("账号安全")

let meSecurity: MeSecurity = reactive(getMeSecurity())

function getMeSecurity() {
  return mockMeSecurity //TODO
}
</script>

<style scoped>
.sec-container>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sec-container .notice {
  margin-left: 3px;
}

.sec-container .info {
  font-size: 14px;
  color: #909399;
}

.sec-container .btn {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
}

.sec-container .btn:hover {
  color: #337ecc;
}
</style>