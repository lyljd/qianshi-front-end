import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: import("../views/Index.vue")
    //()=>import("")是懒加载，等点击到页面后才会加载
    //一般网页都有个首页，首页是不需要懒加载的，直接import就行
  },
  // {
  //   path: "/a",
  //   component: () => import("../components/A.vue")
  //   //()=>import("")是懒加载，等点击到页面后才会加载
  //   //一般网页都有个首页，首页是不需要懒加载的，直接import就行
  // },
  // {
  //   path: "/b",
  //   component: () => import("../components/B.vue"),
  //   name: "b" //在路由跳转时可使用name来跳转
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router