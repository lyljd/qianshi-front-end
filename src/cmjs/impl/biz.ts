// biz.ts 与业务强相关且并没有被归入除util外其他工具类的抽象工具类

import prompt from "./prompt"

export default {
  // isLogin 判断用户是否登录
  // *该判断并不安全，只能用作一些普通的鉴权
  isLogin(): boolean {
    return localStorage.getItem("token") !== null && localStorage.getItem("token") !== ""
  },

  // isMe 判断传入的uid是否为当前登录的用户（未登录返回false）
  // *该判断并不安全，只能用作一些普通的鉴权
  isMe(uid: number): boolean {
    const localUid = localStorage.getItem("uid")
    if (localUid && uid.toString() === localUid) {
      return true
    }
    return false
  },

  // expToLevel (用户)经验转换至等级
  expToLevel(exp: number): number {
    if (exp < 350) {
      return 1
    }
    if (exp < 1500) {
      return 2
    }
    if (exp < 4500) {
      return 3
    }
    if (exp < 9000) {
      return 4
    }
    if (exp < 18000) {
      return 5
    }
    return 6
  },

  // watchLater (视频)稍后再看
  watchLater(vid: number): number {
    console.log(vid)
    /* TODO
    带上vid请求固定api，后端会根据当前视频是否已加入稍后再看返回1或0，
    其分别代表添加或取消(若该视频已加入稍后再看就需要取消)
    这里只需要根据是1还是0提示“已添加”和”已取消“即可
    因为视频卡片上有个小图标的动态切换效果，所以这里还需要返回一个number值：
    1：已添加；0：已取消；-1：请求失败
    */

    prompt.error("操作失败")
    return -1
  },
}