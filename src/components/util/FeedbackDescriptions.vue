<template>
  <div class="fd-container">
    <el-descriptions :title="title" :column="1" border>
      <el-descriptions-item label="正文">
        {{ data.content }}
      </el-descriptions-item>

      <el-descriptions-item v-if="data.imgs.length > 0" label="附件">
        <div ref="imgRow" class="img-row">
          <Image v-for="url in data.imgs" class="fd-image" :url="url" preview contain border round></Image>
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

const imgRow = ref<HTMLDivElement>()

onMounted(() => {
  setImgElesSize()
})

onUpdated(() => { // 解决bug：在后台管理的反馈中若某一项有图片的前一项从数组中移除后会导致设置尺寸失效
  setImgElesSize()
})

function setImgElesSize() {
  const width = ((imgRow.value?.clientWidth as number) - 88 - 18) / 9 //88是每两张图片的间距(gap)11px*8，18是每张图片的左右边框2px*9
  const imgEles = document.getElementsByClassName("fd-image") as HTMLCollectionOf<HTMLDivElement>
  for (let i = 0; i < imgEles.length; i++) {
    imgEles[i].style.width = `${width}px`
    imgEles[i].style.height = `${width}px`
  }
}
</script>

<style lang="less" scoped>
.fd-container .img-row {
  display: flex;
  gap: 11px;
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