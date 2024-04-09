import { defineStore } from 'pinia'

interface StoreState {
  isLogin: boolean
  switchAsk: boolean
  topPath: string
  power: number
  errCode: number
  errMsg: string
  regions: Region[]
}

type Region = {
  name: string
  slug: string
}

type FSOpt = {
  title: string,
  placeholder?: string,
  msgMaxlength?: number,
  fileSize?: number,
  fileNum?: number,
  submitHandler: (msg: string, fileList: File[], closeWindow: Function) => void,
  cancelHandler?: Function,
}

type Receiver = {
  uid: number
  nickname: string
}

export const useStore = defineStore("qianshi", {
  state: (): StoreState => ({
    isLogin: localStorage.getItem("token") !== null && localStorage.getItem("token") !== "",
    switchAsk: false,
    topPath: '',
    power: -1,
    errCode: 404,
    errMsg: "未找到页面",
    regions: [],
  }),

  actions: {
    openLoginWindow: (tip?: string) => { },
    setTopMenuBarAvatar: (avatarUrl: string) => { },
    openCaptchaWindow: (afterSuccDo: Function) => { },
    openEVWindow: (email: string, option: "pass" | "email-1" | "email-2", afterSuccDo: Function) => { },
    openFSWindow: (opt: FSOpt) => { },
    openPVWindow: (videoUrl: string) => { },
    openSMSWindow: (openParameter?: { afterSuccDo?: Function, to?: Receiver[] }) => { },
    setPlatformCurTitle: (title: string) => { },
    setMeCurTitle: (title: string) => { },
    setManegeItemIndex: (idx: number, index: string) => { },
    setManegeFeedbackItemIndex: (idx: number, index: string) => { },
    setPlatformItemIndex: (idx: number, index: string) => { },
    setUserMenuPostNum: (newNum: number) => { },
    setUserMenuCollectionNum: (newNum: number) => { },
    setUserMenuFavlistNum: (newNum: number) => { },
    setNewMessageNum: (num: number) => { },
    setNewDynamicNum: (num: number) => { },
    getRegions: () => {},
  }
})
