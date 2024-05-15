import router from "@/router"
import { useStore } from '@/store'

export default {
  // new 不带http(s)://前缀时为相对路径跳转
  new(url: string) {
    window.open(url, "_blank")
  },

  video(vid: number, t?: number) {
    this.new(`/v/${vid}${t !== undefined ? `?t=${t}` : ''}`)
  },

  region(name: string) {
    this.new(`/region/${name}`)
  },

  read(rid: number) {
    this.new(`/r/${rid}`)
  },

  user(uid: number) {
    if (uid > 0) {
      this.new(`/u/${uid}`)
    }
  },

  follow(uid: number, noJump?:boolean) {
    if (noJump) {
      this.push(`/u/${uid}/follow`)
      return
    }
    this.new(`/u/${uid}/follow`)
  },

  fan(uid: number, noJump?:boolean) {
    if (noJump) {
      this.push(`/u/${uid}/fan`)
      return
    }
    this.new(`/u/${uid}/fan`)
  },

  coinVideos(uid: number) {
    this.new(`/u/${uid}/coinVideos`)
  },

  likeVideos(uid: number) {
    this.new(`/u/${uid}/likeVideos`)
  },

  dynamic(uid: number) {
    this.new(`/u/${uid}/dynamic`)
  },

  collection(uid: number, cid: number) {
    this.new(`/u/${uid}/collection?id=${cid}`)
  },

  favlist(uid: number) {
    this.new(`/u/${uid}/favlist`)
  },

  developer() {
    this.new("https://github.com/lyljd")
  },

  push(url: string) {
    router.push(url)
  },

  pushVideo(vid: number, t?: number) {
    this.push(`/v/${vid}${t !== undefined ? `?t=${t}` : ''}`)
  },

  error(code: number, msg?: string) {
    const store = useStore()
    store.errCode = code
    store.errMsg = msg ? msg : getErrorMsg(code)
    if (code !== 401) {
      this.push("/error")
    } else {
      this.push(`/error?from=${location.pathname}`)
    }
  },
}

function getErrorMsg(code: number): string {
  switch (code) {
    case 400: return "请求参数异常"
    case 401: return "请登录"
    case 403: return "无权访问"
    case 404: return "资源未找到"
    default: return "未知错误"
  }
}