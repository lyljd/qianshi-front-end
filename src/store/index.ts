import { defineStore } from 'pinia'
import * as common from "../common"

export const useStore = defineStore("qianshi", {
  state: () => ({
    switchAsk: false,
    topPath: '',
    mui: {
      nickname: '',
      coverUrl: '',
      power: 0,
    }, //manage user info

    isLogin: common.isLogin(),
    openLoginWindow: () => { },
    openFSWindow: (title: string, bzUrl: string, placeholder?: string, failMsg?: string, succMsg?: string, afterSuccDo?: Function) => { },
    openPVWindow: (videoUrl: string) => { },
    setPlatformCurTitle: (_: string) => { },
    setMeCurTitle: (_: string) => { },
    setUploadItem: (_: string) => { },
    getUploadItem: (): string => { return "" },
  }),
})