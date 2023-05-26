<template>
  <TopMenuImg></TopMenuImg>

  <el-menu id="menu" class="menu" mode="horizontal" :default-active=$route.path :ellipsis="false" router="true">
    <div class="logo">
      <img class="icon" src="favicon.png">
      <span class="notice">浅时</span>
    </div>

    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/hot">热门</el-menu-item>
    <el-sub-menu>
      <template #title>频道</template>
      <el-menu-item index="/channel/anime">番剧</el-menu-item>
      <el-menu-item index="/channel/game">游戏</el-menu-item>
      <el-menu-item index="/channel/music">音乐</el-menu-item>
      <el-menu-item index="/channel/tech">科技</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/read">专栏</el-menu-item>
    <el-menu-item index="/live">直播</el-menu-item>

    <div class="flex-grow" />

    <div>
      <el-input v-model="searchKey" class="search" placeholder="搜索" clearable>
        <template #prefix><el-icon style="cursor: pointer;">
            <search />
          </el-icon></template>
      </el-input>
    </div>

    <div class="flex-grow" />

    <el-avatar class="avatar" size="40" src="" @error="true">
      <img src="default-avatar.png" />
    </el-avatar>

    <div class="ico-btn">
      <el-button class="iconfont el-icon-vip ico" circle></el-button>
      <div class="notice">会员</div>
    </div>

    <div class="ico-btn">
      <el-button circle><el-icon class="ico">
          <Message />
        </el-icon></el-button>
      <div class="notice">消息</div>
    </div>

    <div class="ico-btn">
      <el-button class="iconfont el-icon-fengche ico" circle></el-button>
      <div class="notice">动态</div>
    </div>

    <div class="ico-btn">
      <el-button circle><el-icon class="ico">
          <Star />
        </el-icon></el-button>
      <div class="notice">收藏</div>
    </div>

    <div class="ico-btn">
      <el-button circle><el-icon class="ico">
          <Clock />
        </el-icon></el-button>
      <div class="notice">历史</div>
    </div>

    <div style="text-align: center;" class="ico-btn">
      <el-button style="font-weight: bold;" class="iconfont el-icon-idea ico" circle></el-button>
      <div class="notice">创作中心</div>
    </div>

    <el-button type="primary" class="upload-btn">
      <el-icon>
        <Upload />
      </el-icon>
      <span class="notice">投稿</span>
    </el-button>
  </el-menu>
</template>

<script lang="ts" setup>
import TopMenuImg from "./TopMenuImg.vue"

let menu: HTMLElement

let searchKey = ref("")

onMounted(() => {
  menu = document.getElementById("menu") as HTMLElement
  window.addEventListener('scroll', scrollListenerHandler)
})
onUnmounted(() => {
  window.removeEventListener("scroll", scrollListenerHandler)
})

function scrollListenerHandler() {
  if (document.documentElement.scrollTop > 104) {
    menu.style.backgroundColor = "white"
    menu.style.borderBottom = "1px solid #dedfe0"
  } else {
    menu.style.backgroundColor = "transparent"
    menu.style.border = "none"
  }
  menu.style.marginLeft = -document.documentElement.scrollLeft.toString() + "px"
}
</script>

<style scoped>
.menu {
  width: 100%;
  min-width: 1280px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: none;
  background-color: transparent;
  position: fixed;
  top: 0px;
  z-index: 1;
}

.el-menu--horizontal>.el-menu-item.is-active,
.el-menu--horizontal>.el-menu-item,
.el-menu--horizontal>.el-sub-menu.is-active :deep(.el-sub-menu__title),
.el-menu--horizontal>.el-sub-menu :deep(.el-sub-menu__title) {
  border-bottom: none;
}

.el-sub-menu.is-active :deep(.el-sub-menu__title) {
  border-bottom-color: transparent;
}

.el-menu--horizontal>.el-menu-item,
.el-sub-menu :deep(.el-sub-menu__title) {
  margin-left: -12.5px;
  margin-right: -12.5px;
}

.el-menu-item:focus {
  background-color: transparent !important;
  color: inherit !important;
}

.el-menu-item:hover,
.el-sub-menu:hover,
.el-sub-menu :deep(.el-sub-menu__title:hover) {
  background-color: transparent !important;
}

.el-sub-menu {
  width: 55px;
}

.flex-grow {
  flex-grow: 1;
}

.logo {
  margin-right: 10px;
}

.logo .icon {
  width: 37.5px;
  vertical-align: top;
}

.logo .notice {
  font-size: 30px;
  cursor: default;
}

.search {
  width: 300px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 10px;
}

.avatar {
  margin-right: 10px;
  cursor: pointer;
}

.ico-btn:hover {
  font-size: 30px;
  /*让功能按钮向下垂一点*/
  cursor: pointer;
}

.ico-btn .el-button {
  border: none;
  font-size: 25px;
  background-color: transparent;
}

.ico-btn .el-button:hover {
  background-color: transparent;
}

.ico-btn .notice {
  text-align: center;
  font-size: 13.5px;
}

.ico-btn .notice,
.ico-btn .ico {
  color: #303133;
}

.upload-btn {
  font-size: 17.5px;
  border-radius: 7.5px;
  margin-left: 10px;
}

.upload-btn .notice {
  font-size: 13.5px;
}
</style>

<style>
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: auto !important;
}
</style>
