<template>
  <div class="video-card">
    <el-image class="cover" src="">
      <template #error>
        <div class="default">封面加载失败</div>
      </template>
    </el-image>
    <div class="info">
      <span>
        <span class="iconfont el-icon-bofangshu icon"></span>
        播放数
        <span class="danmushu">
          <span class="iconfont el-icon-danmushu icon"></span>
          弹幕数
        </span>
      </span>
      <span class="duration">时长</span>
    </div>
    <div class="content">
      <div class="title-container"><span class="title">标题</span></div>
      <div class="up-time-container">
        <span class="up-time-text"><span class="iconfont el-icon-UPzhu icon"></span>
          昵称 · 日期</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.video-card {
  width: 270px;
  height: 200px;
}

.video-card .cover {
  width: 270px;
  height: 151.875px;
  border-radius: 5px;
  cursor: pointer;
}

.video-card .info {
  width: 260px;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  margin-top: -22px;
  margin-left: 5px;
  margin-right: 5px;
  color: white;
  position: absolute;
  display: flex;
  justify-content: space-between;
  cursor: default;
}

.video-card .info .icon {
  font-size: 14px;
}

.video-card .info .danmushu {
  margin-left: 10px;
}

.video-card .content {
  height: 43.125px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2px;
}

.video-card .content .title-container {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .title:hover {
  font-size: 16px;
  cursor: pointer;
  color: #409EFF;
}

.video-card .up-time-container {
  color: #909399;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-card .up-time-text:hover {
  color: #409EFF;
  cursor: pointer;
}

.video-card .up-time-container .icon {
  font-size: 12px;
}
</style>