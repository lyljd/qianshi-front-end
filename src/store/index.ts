import { defineStore } from 'pinia'
import cmjs from '@/cmjs'

export const useStore = defineStore("qianshi", {
  state: () => ({
    isLogin: cmjs.biz.isLogin(),
    switchAsk: false,
    topPath: '',
    mui: {
      id: -1,
      nickname: '',
      coverUrl: '',
      power: -1,
    }, //manage user info

    openLoginWindow: () => { },
    openFSWindow: (title: string, bzUrl: string, placeholder?: string, failMsg?: string, succMsg?: string, afterSuccDo?: Function) => { },
    openPVWindow: (videoUrl: string) => { },
    openSMSWindow: (openParameter?: { afterSuccDo?: Function, to?: string[] }) => { },
    setPlatformCurTitle: (title: string) => { },
    setMeCurTitle: (title: string) => { },
    setUploadItem: (item: string) => { },
    getUploadItem: (): string => { return "" },
    setManegeItemIndex: (idx: number, index: string) => { },
    setManegeFeedbackItemIndex: (idx: number, index: string) => { },
    setPlatformItemIndex: (idx: number, index: string) => { },
    addUserMenuCollectionNum: (incr: number) => { },
    addUserMenuFavlistNum: (incr: number) => { },
  }),
})