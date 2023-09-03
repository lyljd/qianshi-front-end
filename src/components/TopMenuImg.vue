<template>
  <header>
    <div class="view">
      <img src="/top-menu-img/view-morning.jpg" class="morning" alt="">
      <img src="/top-menu-img/view-afternoon.jpg" class="afternoon" alt="">
      <video autoplay loop muted class="evening">
        <source src="/top-menu-img/view-evening.webm" type="video/webm" />
      </video>
      <img src="/top-menu-img/view-evening-snow.png" class="window-cover" alt="">
    </div>

    <div class="tree">
      <img src="/top-menu-img/tree-morning.png" class="morning" alt="">
      <img src="/top-menu-img/tree-afternoon.png" class="afternoon" alt="">
      <img src="/top-menu-img/tree-evening.png" class="evening" alt="">
    </div>
  </header>
</template>

<script setup lang="ts">
onMounted(() => {
  let startingPoint: number
  const header = document.querySelector('header') as HTMLElement

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

<style scoped>
header {
  height: 160px;
  position: relative;
  overflow: hidden;
  display: none;

  --percentage: 0.5;
}

header .view,
header .tree {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

header img,
header video {
  position: absolute;
  display: block;
  width: 120%;
  height: 100%;
  object-fit: cover;
}

header .morning {
  z-index: 20;
  opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
}

header .afternoon {
  z-index: 10;
  opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
}

header .view {
  transform: translatex(calc(var(--percentage) * 100px));
}

header .tree {
  transform: translatex(calc(var(--percentage) * 50px));
  filter: blur(3px);
}

header .view,
header .tree,
header .morning,
header .afternoon {
  transition: .2s all ease-in;
}

header.moving .view,
header.moving .tree,
header.moving .morning,
header.moving .afternoon {
  transition: none;
}

header .window-cover {
  opacity: calc((var(--percentage) - 0.9) / 0.1);
}
</style>