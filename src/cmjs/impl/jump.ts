export default {
  // new 不带http(s)://前缀时为相对路径跳转
  new(url: string) {
    window.open(url, "_blank")
  },

  video(vid: number) {
    this.new(`/v/${vid}`)
  },
  
  read(rid: number) {
    this.new(`/r/${rid}`)
  },
  
  user(uid: number) {
    this.new(`/u/${uid}`)
  },
  
  developer() {
    this.new("https://github.com/lyljd")
  },
}