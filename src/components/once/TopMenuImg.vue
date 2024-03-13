<template>
  <div class="header">
    <div class="view">
      <img src="https://cdn.qianshi.fun/top-menu-img/view-morning.jpg?auth_key=1741881767-0-0-c046e33e98108a50780eb02db1a1fa26" class="morning" alt="" />
      <img src="https://cdn.qianshi.fun/top-menu-img/view-afternoon.jpg?auth_key=1741881786-0-0-2c4e7030e31e0dc916efae4c8063ff25" class="afternoon" alt="" />
      <video autoplay loop muted class="evening">
        <source src="https://cdn.qianshi.fun/top-menu-img/view-evening.webm?auth_key=1741881809-0-0-231667d62ef243059770867e1578ca7a" type="video/webm" />
      </video>
      <img src="https://cdn.qianshi.fun/top-menu-img/view-evening-snow.png?auth_key=1741881834-0-0-82523d442ee5d5f96bd91ef9b002f71f" class="window-cover" alt="" />
    </div>

    <div class="tree">
      <img src="https://cdn.qianshi.fun/top-menu-img/tree-morning.png?auth_key=1741881848-0-0-773eb3553c256e2861d05ca56c2d20f9" class="morning" alt="" />
      <img src="https://cdn.qianshi.fun/top-menu-img/tree-afternoon.png?auth_key=1741881861-0-0-0c381908ab69b93e9e54399256a7928b" class="afternoon" alt="" />
      <img src="https://cdn.qianshi.fun/top-menu-img/tree-evening.png?auth_key=1741881878-0-0-9ca36803d579f2a0b959c4cd27de64a0" class="evening" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  let startingPoint: number
  const header = document.querySelector('.header') as HTMLElement

  header.addEventListener('mouseenter', (e) => {
    startingPoint = e.clientX
    header.classList.add('moving')
  })

  header.addEventListener('mouseout', () => {
    header.classList.remove('moving')
    header.style.setProperty('--percentage', "0.5")
  })

  header.addEventListener('mousemove', (e) => {
    let percentage = (e.clientX - startingPoint) / window.outerWidth + 0.5

    header.style.setProperty('--percentage', percentage.toString())
  })
})
</script>

<style lang="less" scoped>
.header {
  height: 160px;
  position: relative;
  overflow: hidden;
  display: none;

  --percentage: 0.5;
}

.header .view,
.header .tree {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header img,
.header video {
  position: absolute;
  display: block;
  width: 120%;
  height: 100%;
  object-fit: cover;
}

.header .morning {
  z-index: 20;
  opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
}

.header .afternoon {
  z-index: 10;
  opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
}

.header .view {
  transform: translatex(calc(var(--percentage) * 100px));
}

.header .tree {
  transform: translatex(calc(var(--percentage) * 50px));
  filter: blur(3px);
}

.header .view,
.header .tree,
.header .morning,
.header .afternoon {
  transition: .2s all ease-in;
}

.header.moving .view,
.header.moving .tree,
.header.moving .morning,
.header.moving .afternoon {
  transition: none;
}

.header .window-cover {
  opacity: calc((var(--percentage) - 0.9) / 0.1);
}
</style>