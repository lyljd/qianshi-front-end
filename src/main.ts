import { createApp } from 'vue'
import './normalize.css'
import './main.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'
import 'animate.css'
import { useStore } from "./store"

const app = createApp(App)
const store = useStore()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
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
