import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { ElMessageBox } from 'element-plus'
import { createApp } from 'vue'
import App from '../App.vue'
import { createPinia } from 'pinia'
import { useStore } from "../store"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const store = useStore()

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Index.vue")
  },

  {
    path: "/:pathMatch(.*)",
    component: () => import("../views/404.vue")
  },

  {
    path: "/v/:vid",
    component: () => import("../views/Video.vue")
  },

  {
    path: "/u/:uid",
    component: () => import("../views/User.vue"),
    children: [
      { path: "/u/:uid", component: () => import("../views/User/Home.vue") },
      { path: "/u/:uid/dynamic", component: () => import("../views/User/Dynamic.vue") },
      { path: "/u/:uid/video", component: () => import("../views/User/Video.vue") },
      { path: "/u/:uid/collection", component: () => import("../views/User/Collection.vue") },
      { path: "/u/:uid/favlist", component: () => import("../views/User/Favlist.vue") },
      { path: "/u/:uid/setting", component: () => import("../views/User/Setting.vue") },
    ]
  },

  {
    path: "/me",
    component: () => import("../views/Me.vue"),
    children: [
      { path: "/me", component: () => import("../views/Me/Home.vue") },
      { path: "/me/setting", component: () => import("../views/Me/Setting.vue") },
      { path: "/me/security", component: () => import("../views/Me/Security.vue") },
      { path: "/me/coin", component: () => import("../views/Me/Coin.vue") },
    ],
    meta: {
      title: '个人中心',
    }
  },

  {
    path: "/platform",
    component: () => import("../views/Platform.vue"),
    children: [
      { path: "/platform", component: () => import("../views/Platform/Home.vue") },

      {
        path: "/platform/upload/video",
        component: () => import("../views/Platform/Upload.vue"),
        children: [
          { path: "/platform/upload/video", component: () => import("../views/Platform/Upload/Video.vue") },
          { path: "/platform/upload/read", component: () => import("../views/Platform/Upload/Read.vue") },
        ]
      },

      {
        path: "/platform/article/video",
        component: () => import("../views/Platform/Article.vue"),
        children: [
          { path: "/platform/article/video", component: () => import("../views/Platform/Article/Video.vue") },
          { path: "/platform/article/read", component: () => import("../views/Platform/Article/Read.vue") },
        ]
      },

      { path: "/platform/appeal", component: () => import("../views/Platform/Appeal.vue") },
    ],
    meta: {
      title: '创作中心',
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (store.switchAsk) {
    ElMessageBox.confirm(
      '你所做的更改可能未保存',
      '切换页面？',
      {
        confirmButtonText: '切换',
        cancelButtonText: '取消',
        type: 'warning',
        autofocus: false,
        showClose: false,
      }
    ).then(() => {
      store.switchAsk = false
      beforeEach(to, from, next)
    }).catch(() => { })
  } else {
    beforeEach(to, from, next)
  }
})

function beforeEach(to: any, from: any, next: Function) {
  if (to.meta.title) {
    document.title = to.meta.title + " - 浅时"
  } else {
    document.title = "浅时"
  }

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
}

export default router