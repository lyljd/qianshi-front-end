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
    path: "/live",
    component: () => import("../views/LiveIndex.vue")
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