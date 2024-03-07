import axios from "axios"
import cmjs from '@/cmjs'
import { useStore } from '@/store'
import router from "@/router"

const apiInstance = axios.create({
  timeout: 6000,
})

apiInstance.interceptors.request.use(function (config) {
  const token = cmjs.cache.getLS("token")
  if (token) {
    config.headers.Token = token
  }

  return config

}, function (err) {
  return Promise.reject(err)
})

apiInstance.interceptors.response.use(function (res) {
  return res
}, function (err) {
  if (err.response.status !== 401) {
    return Promise.reject(err)
  }

  const rft = cmjs.cache.getLS("refreshToken")
  if (rft) {
    return apiInstance.post('/api/v1/auth/token/refresh', { refresh_token: rft })
      .then((res) => {
        if (res.data.code !== 0) {
          return Promise.reject("登录状态已失效，请重新登录！")
        }

        const token = res.data.data.token
        cmjs.cache.setLS("token", token)
        err.config.headers['Token'] = token
        return apiInstance.request(err.config)
      })
      .catch(() => {
        handleLogout()
        return Promise.reject("登录状态已失效，请重新登录！")
      })
  }

  handleLogout()
  return Promise.reject("登录状态已失效，请重新登录！")
})

function handleLogout() {
  const store = useStore()
  store.isLogin = false
  cmjs.biz.clearLoginInfo()
  cmjs.jump.error(401)
  store.openLoginWindow("")
}


export {
  apiInstance,
}