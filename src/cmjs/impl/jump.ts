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
    this.new(`/u/${uid}`)
  },

  follow(uid: number) {
    this.new(`/u/${uid}/follow`)
  },

  fan(uid: number) {
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

  error(code: 400 | 401 | 403 | 404) {
    if (code === 401) {
      location.href = `/401?from=${location.pathname}`
    } else {
      location.href = `/${code}`
    }
  }
}