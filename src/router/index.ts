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
    ],
    meta: {
      title: '创作中心',
    }
  },

  {
    path: "/manage",
    component: () => import("../views/Manage.vue"),
    children: [
      { path: "/manage", component: () => import("../views/Manage/Home.vue") },

      {
        path: "/manage/review/video",
        component: () => import("../views/Manage/Review.vue"),
        children: [
          { path: "/manage/review/video", component: () => import("../views/Manage/Review/Video.vue") },
          { path: "/manage/review/read", component: () => import("../views/Manage/Review/Read.vue") },
          { path: "/manage/review/title", component: () => import("../views/Manage/Review/Title.vue") },
        ]
      },

      {
        path: "/manage/feedback/msg",
        component: () => import("../views/Manage/Feedback.vue"),
        children: [
          { path: "/manage/feedback/msg", component: () => import("../views/Manage/Feedback/Msg.vue") },

          {
            path: "/manage/feedback/appeal/video",
            component: () => import("../views/Manage/Feedback/Appeal.vue"),
            children: [
              { path: "/manage/feedback/appeal/video", component: () => import("../views/Manage/Feedback/Appeal/Video.vue") },
              { path: "/manage/feedback/appeal/read", component: () => import("../views/Manage/Feedback/Appeal/Read.vue") },
            ]
          },

          {
            path: "/manage/feedback/report/video",
            component: () => import("../views/Manage/Feedback/Report.vue"),
            children: [
              { path: "/manage/feedback/report/video", component: () => import("../views/Manage/Feedback/Report/Video.vue") },
              { path: "/manage/feedback/report/read", component: () => import("../views/Manage/Feedback/Report/Read.vue") },
              { path: "/manage/feedback/report/comment", component: () => import("../views/Manage/Feedback/Report/Comment.vue") },
              { path: "/manage/feedback/report/danmu", component: () => import("../views/Manage/Feedback/Report/Danmu.vue") },
            ]
          },
        ]
      },

      { path: "/manage/user", component: () => import("../views/Manage/User.vue") },
      { path: "/manage/power", component: () => import("../views/Manage/Power.vue") },
      { path: "/manage/statistic", component: () => import("../views/Manage/Statistic.vue") },
    ],
    meta: {
      title: '后台管理',
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

  store.topPath = to.path.split('/')[1]

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
}

export default router