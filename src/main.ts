import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Image from "@/components/common/Image.vue"

import '@/assets/iconfont/iconfont.js'

import '@/assets/iconfont/iconfont.css'
import 'element-plus/dist/index.css'
import '@/normalize.css'
import 'animate.css'
import '@/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
const app = createApp(App)

import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)

import { useStore } from "@/store"
const store = useStore()

app.directive('blur', {
  mounted(el) {
    el.addEventListener('click', () => {
      el.blur()
    })
  },
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Image', Image)

app.use(ElementPlus)
app.use(router)

app.mount('#app')

function beforeUnload(e: any) {
  if (store.switchAsk) {
    e.preventDefault()
  }
}

window.addEventListener('beforeunload', beforeUnload)
if (window.opener) {
  window.opener.addEventListener('beforeunload', beforeUnload)
}
