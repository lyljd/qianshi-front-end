import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { useStore } from "@/store"
import { ElMessageBox } from 'element-plus'
import cmjs from "@/cmjs"
import * as API from '@/api/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Index.vue")
  },

  {
    path: "/:pathMatch(.*)",
    component: () => import("@/views/Error.vue")
  },

  {
    path: "/400",
    component: () => import("@/views/Error.vue"),
    meta: {
      code: 400,
      msg: "参数异常",
    }
  },

  {
    path: "/401",
    component: () => import("@/views/Error.vue"),
    meta: {
      code: 401,
      msg: "未登录",
    }
  },

  {
    path: "/403",
    component: () => import("@/views/Error.vue"),
    meta: {
      code: 403,
      msg: "拒绝服务",
    }
  },

  {
    path: "/v/:vid",
    component: () => import("@/views/Video.vue")
  },

  {
    path: "/u/:uid",
    component: () => import("@/views/User.vue"),
    children: [
      { path: "/u/:uid", component: () => import("@/views/User/Home.vue") },
      { path: "/u/:uid/dynamic", component: () => import("@/views/User/Dynamic.vue") },
      { path: "/u/:uid/post", component: () => import("@/views/User/Post.vue") },
      { path: "/u/:uid/collection", component: () => import("@/views/User/Collection.vue") },
      { path: "/u/:uid/favlist", component: () => import("@/views/User/Favlist.vue") },
      { path: "/u/:uid/setting", component: () => import("@/views/User/Setting.vue") },
    ]
  },

  {
    path: "/me",
    component: () => import("@/views/Me.vue"),
    children: [
      { path: "/me", component: () => import("@/views/Me/Home.vue") },
      { path: "/me/setting", component: () => import("@/views/Me/Setting.vue") },
      { path: "/me/security", component: () => import("@/views/Me/Security.vue") },
      { path: "/me/coin", component: () => import("@/views/Me/Coin.vue") },
      { path: "/me/blacklist", component: () => import("@/views/Me/Blacklist.vue") },
    ],
    meta: {
      title: '个人中心',
      needLogin: true,
    }
  },

  {
    path: "/platform",
    component: () => import("@/views/Platform.vue"),
    children: [
      { path: "/platform", component: () => import("@/views/Platform/Home.vue") },

      {
        path: "/platform/upload/video",
        component: () => import("@/views/Platform/Upload.vue"),
        children: [
          { path: "/platform/upload/video", component: () => import("@/views/Platform/Upload/Video.vue") },
          { path: "/platform/upload/read", component: () => import("@/views/Platform/Upload/Read.vue") },
        ]
      },

      {
        path: "/platform/article/video",
        component: () => import("@/views/Platform/Article.vue"),
        children: [
          { path: "/platform/article/video", component: () => import("@/views/Platform/Article/Video.vue") },
          { path: "/platform/article/read", component: () => import("@/views/Platform/Article/Read.vue") },
        ]
      },
    ],
    meta: {
      title: '创作中心',
      needLogin: true,
    }
  },

  {
    path: "/manage",
    component: () => import("@/views/Manage.vue"),
    children: [
      { path: "/manage", component: () => import("@/views/Manage/Home.vue") },

      {
        path: "/manage/review/video",
        component: () => import("@/views/Manage/Review.vue"),
        children: [
          { path: "/manage/review/video", component: () => import("@/views/Manage/Review/Video.vue"), meta: { power: 1 } },
          { path: "/manage/review/read", component: () => import("@/views/Manage/Review/Read.vue"), meta: { power: 1 } },
          { path: "/manage/review/avatar", component: () => import("@/views/Manage/Review/Avatar.vue"), meta: { power: 1 } },
          { path: "/manage/review/title", component: () => import("@/views/Manage/Review/Title.vue"), meta: { power: 2 } },
        ]
      },

      {
        path: "/manage/feedback/appeal/video",
        component: () => import("@/views/Manage/Feedback.vue"),
        children: [
          {
            path: "/manage/feedback/appeal/video",
            component: () => import("@/views/Manage/Feedback/Appeal.vue"),
            children: [
              { path: "/manage/feedback/appeal/video", component: () => import("@/views/Manage/Feedback/Appeal/Video.vue") },
              { path: "/manage/feedback/appeal/read", component: () => import("@/views/Manage/Feedback/Appeal/Read.vue") },
            ]
          },

          { path: "/manage/feedback/msg", component: () => import("@/views/Manage/Feedback/Msg.vue"), meta: { power: 2 } },

          {
            path: "/manage/feedback/report/video",
            component: () => import("@/views/Manage/Feedback/Report.vue"),
            children: [
              { path: "/manage/feedback/report/video", component: () => import("@/views/Manage/Feedback/Report/Video.vue") },
              { path: "/manage/feedback/report/read", component: () => import("@/views/Manage/Feedback/Report/Read.vue") },
              { path: "/manage/feedback/report/comment", component: () => import("@/views/Manage/Feedback/Report/Comment.vue") },
              { path: "/manage/feedback/report/danmu", component: () => import("@/views/Manage/Feedback/Report/Danmu.vue") },
              { path: "/manage/feedback/report/user", component: () => import("@/views/Manage/Feedback/Report/User.vue") },
            ],
            meta: {
              power: 3,
            }
          },
        ]
      },

      { path: "/manage/user", component: () => import("@/views/Manage/User.vue"), meta: { power: 4 } },

      {
        path: "/manage/power",
        component: () => import("@/views/Manage/Power.vue"),
        children: [
          { path: "/manage/power", component: () => import("@/views/Manage/Power/All.vue") },
          { path: "/manage/power/admin", component: () => import("@/views/Manage/Power/Admin.vue") },
          { path: "/manage/power/table", component: () => import("@/views/Manage/Power/Table.vue") },
        ],
        meta: {
          power: 3,
        }
      },

      { path: "/manage/statistic", component: () => import("@/views/Manage/Statistic.vue"), meta: { power: 5 } },
    ],
    meta: {
      title: '后台管理',
      needLogin: true,
      power: 1,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useStore()
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

async function getPower() {
  const store = useStore()
  await API.mePower()
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error("获取我的权限失败")
        store.power = 0
        return
      }

      store.power = res.data.power
    })
    .catch((err) => {
      cmjs.prompt.error(err)
      store.power = 0
    })
}

async function beforeEach(to: any, from: any, next: Function) {
  const store = useStore()
  store.topPath = to.path.split('/')[1]

  if (to.meta.needLogin && !store.isLogin) {
    next(`/401?from=${to.href}`)
    return
  }

  if (store.isLogin && !cmjs.cache.checkCookieExist('avatar')) {
    API.meAvatar() // 异步不阻塞
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error("获取我的头像失败")
          cmjs.cache.setCookie("avatar", "", 300)
          store.setTopMenuBarAvatar("")
          return
        }

        cmjs.cache.setCookie("avatar", res.data.avatarUrl, 300)
        store.setTopMenuBarAvatar(res.data.avatarUrl)
      })
      .catch((err) => {
        cmjs.prompt.error(err)
        cmjs.cache.setCookie("avatar", "", 300)
        store.setTopMenuBarAvatar("")
      })
  }

  if (store.topPath === 'manage' && store.isLogin && store.power === -1) {
    await getPower() // 同步阻塞
  }

  if (to.meta.power && store.power < to.meta.power) {
    next("/403")
    return
  }

  if (to.meta.title) {
    document.title = to.meta.title + " - 浅时"
  } else {
    document.title = "浅时"
  }

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
}

export default router