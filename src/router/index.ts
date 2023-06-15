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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0) //设置滚动条位置到顶部
  next()
});

export default router