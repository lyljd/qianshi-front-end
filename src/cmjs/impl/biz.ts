// biz.ts 与业务强相关且并没有被归入除util外其他工具类的抽象工具类

import prompt from "./prompt"
import cache from "./cache"
import { useStore } from '@/store'

export default {
  // verifyLoginUid 判断传入的uid是否为当前登录的用户（未登录返回false）
  // 原理：调用getUid（如果uid被篡改则token将会失效，以达到一定的安全性【并不完全安全】）
  verifyLoginUid(uid: number): boolean {
    const store = useStore()

    if (!store.isLogin) {
      return false
    }

    if (uid === this.getUid()) {
      return true
    }
    return false
  },

  // getUid 读取token中payload部分的uid
  getUid(): number {
    return parseInt((cache.getLS('token') as string))
  },

  // expToLevel (用户)经验转换至等级
  expToLevel(exp: number): 1 | 2 | 3 | 4 | 5 | 6 {
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

  // levelReqExp 用户等级升至对应等级所需经验
  levelReqExp(level: number): number {
    switch (level) {
      case 1: return 0
      case 2: return 350
      case 3: return 1500
      case 4: return 4500
      case 5: return 9000
      case 6: return 18000
      default: return 0
    }
  },

  // watchLater (视频)稍后再看
  watchLater(vid: number): number {
    const store = useStore()

    if (!store.isLogin) {
      store.openLoginWindow()
      return -1
    }

    console.log(vid)
    // TODO api
    /*
    带上vid请求固定api，后端会根据当前视频是否已加入稍后再看返回1或0，
    其分别代表添加或取消(若该视频已加入稍后再看就需要取消)
    这里只需要根据是1还是0提示“已添加”和”已取消“即可
    因为视频卡片上有个小图标的动态切换效果，所以这里还需要返回一个number值：
    1：已添加；0：已取消；-1：操作失败
    */

    prompt.error("操作失败")
    return -1
  },
}