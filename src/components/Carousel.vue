<template>
  <el-carousel v-if="data.length > 0" class="carousel" trigger="click" :height="`${height}px`">
    <el-carousel-item v-for="c in data">
      <a :href="c.linkUrl !== '' ? c.linkUrl : undefined" target="_blank">
        <el-image class="image" :src="c.imgUrl">
          <template #error>
            <div class="default">轮播图加载失败</div>
          </template>
        </el-image>
        <div v-if="c.title" class="title">
          <span class="info">{{ c.title }}</span>
        </div>
      </a>
    </el-carousel-item>
  </el-carousel>
  <div v-else :style="{ height: `${height}px` }" class="default carousel-empty">暂无轮播图</div>
</template>

<script setup lang="ts">

type carousel = {
  title?: string,
  imgUrl: string,
  linkUrl?: string,
}

defineProps<{
  data: carousel[]
  height: number,
}>()
</script>

<style scoped>
.carousel {
  border-radius: 5px;
}

.carousel-empty {
  border-radius: 5px;
  cursor: default;
}

.carousel .image {
  width: 100%;
  height: 100%;
}

.carousel .title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  top: 0;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: absolute;
}

.carousel .title .info {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>