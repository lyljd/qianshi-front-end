<template>
  <div class="dev-info">
    <div class="beian-row">
      <a class="link" href="https://beian.miit.gov.cn" target="_blank">渝ICP备2023011499号-1</a>
      ·
      <span class="gaba">
        <Image url="/gaba.png" :w="14" :h="14"></Image>
        <a class="link" href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010602503726"
          target="_blank">渝公网安备50010602503726号</a>
      </span>
    </div>

    <div>
      <span>Copyright © {{ getEstablishDuration() }} <a class="link" href="http://qianshi.fun"
          target="__blank">qianshi.fun</a></span>
      ·
      <span>Developed by <a class="link" href="https://github.com/lyljd" target="__blank">Bonnenult</a></span>
    </div>

    <div>此网站仅供学习使用，侵权请联系：qianshi_fun#163.com(#换@)</div>
  </div>
</template>

<script setup lang="ts">
const establishYear = 2023

function getEstablishDuration(): string {
  let s = `${establishYear}`
  const curYear = new Date().getFullYear()
  if (curYear > establishYear) {
    s += `-${curYear}`
  }
  return s
}
</script>

<style lang="less" scoped>
.dev-info {
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: default;

  .beian-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .link {
    color: #409EFF;
  }

  .link:hover {
    color: #337ecc;
  }

  .gaba {
    display: inline-flex;
    align-items: center;
  }
}
</style>