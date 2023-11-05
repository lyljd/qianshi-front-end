import { defineStore } from 'pinia'

export const useStore = defineStore("qianshi", {
  state: () => ({
    isLogin: localStorage.getItem("token") !== null && localStorage.getItem("token") !== "",
    switchAsk: false,
    topPath: '',
    power: -1,
  }),

  actions: {
    openLoginWindow: (tip?: string) => { },
    setTopMenuBarAvatar: (avatar: string) => { },
    openCaptchaWindow: (afterSuccDo: Function) => { },
    openEVWindow: (email: string, afterSuccDo: Function) => { },
    openFSWindow: (title: string, bzUrl: string, dataP: object, placeholder?: string, failMsg?: string, succMsg?: string, afterSuccDo?: Function, afterDo?: Function) => { },
    openPVWindow: (videoUrl: string) => { },
    openSMSWindow: (openParameter?: { afterSuccDo?: Function, to?: Receiver[] }) => { },
    setPlatformCurTitle: (title: string) => { },
    setMeCurTitle: (title: string) => { },
    setUploadItem: (item: string) => { },
    getUploadItem: (): string => { return "" },
    setManegeItemIndex: (idx: number, index: string) => { },
    setManegeFeedbackItemIndex: (idx: number, index: string) => { },
    setPlatformItemIndex: (idx: number, index: string) => { },
    setUserMenuPostNum: (newNum: number) => { },
    setUserMenuCollectionNum: (newNum: number) => { },
    setUserMenuFavlistNum: (newNum: number) => { },
  }
})

type Receiver = {
  uid: number
  nickname: string
}