<template>
  <el-carousel class="carousel" trigger="click" height="420px">
    <el-carousel-item>
      <a href="" target="_blank">
        <el-image class="image" src="">
          <template #error>
            <div class="default">轮播图加载失败</div>
          </template>
        </el-image>
        <div class="title">
          <span class="info">标题</span>
        </div>
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">

</script>

<style scoped>
.carousel {
  border-radius: 5px;
}

.carousel .image {
  width: 100%;
  height: 100%;
}

.carousel .title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin-top: -420px;
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