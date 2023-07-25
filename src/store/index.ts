import { defineStore } from 'pinia'
import * as common from "../common"

export const useStore = defineStore("qianshi", {
  state: () => ({
    switchAsk: false,
    topPath: '',
    mui: {
      id: -1,
      nickname: '',
      coverUrl: '',
      power: -1,
    }, //manage user info

    isLogin: common.isLogin(),
    openLoginWindow: () => { },
    openFSWindow: (title: string, bzUrl: string, placeholder?: string, failMsg?: string, succMsg?: string, afterSuccDo?: Function) => { },
    openPVWindow: (videoUrl: string) => { },
    openSMSWindow: (openParameter?: { afterSuccDo?: Function, to?: string[] }) => { },
    setPlatformCurTitle: (_: string) => { },
    setMeCurTitle: (_: string) => { },
    setUploadItem: (_: string) => { },
    getUploadItem: (): string => { return "" },
    setManegeItemIndex: (idx: number, index: string) => { },
    setManegeFeedbackItemIndex: (idx: number, index: string) => { },
    setPlatformItemIndex: (idx: number, index: string) => { },
  }),
})