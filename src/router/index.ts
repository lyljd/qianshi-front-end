import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

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
      { path: "/platform/upload", component: () => import("../views/Platform/Upload.vue") },
      { path: "/platform/article", component: () => import("../views/Platform/Article.vue") },
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
  if (to.meta.title) {
    document.title = to.meta.title + " - 浅时"
  } else {
    document.title = "浅时"
  }

  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
});

export default router