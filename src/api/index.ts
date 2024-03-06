import axios from "axios"
import cmjs from '@/cmjs'
import { useStore } from '@/store'

const apiInstance = axios.create({
  timeout: 6000,
})

apiInstance.interceptors.request.use(function (config) {
  const token = cmjs.cache.getLS("token")
  if (token) {
    config.headers.Token = token
  }

  return config

}, function (error) {
  return Promise.reject(error)
});

apiInstance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    const rft = cmjs.cache.getLS("refreshToken")
    if (rft) {
      //
    }

    cmjs.prompt.error("登录状态已失效")
    cmjs.biz.clearLoginInfo()
    const store = useStore()
    store.isLogin = false
    cmjs.jump.error(401)
    store.openLoginWindow()
  }

  return Promise.reject(error)
});

export {
  apiInstance,
}