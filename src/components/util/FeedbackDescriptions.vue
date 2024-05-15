<template>
  <div class="fd-container">
    <el-descriptions :title="title" :column="1" border>
      <el-descriptions-item label="正文">
        {{ data.content }}
      </el-descriptions-item>

      <el-descriptions-item v-if="data.imgs && data.imgs.length > 0" label="附件">
        <div class="img-row">
          <Image :w="135" :h="135" v-for="url in data.imgs" :url="url" preview contain border round></Image>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
type feedbackInfo = {
  content: string,
  imgs: string[],
}

defineProps<{
  title: string
  data: feedbackInfo
}>()
</script>

<style lang="less" scoped>
.fd-container .img-row {
  display: flex;
  gap: 8px;
}
</style>

<style>
.fd-container .el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 52px !important;
}

.fd-container .el-descriptions__header {
  margin-bottom: 3px;
}
</style>