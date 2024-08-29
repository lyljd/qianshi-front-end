import { defineStore } from 'pinia'
import { UploadUserFile } from 'element-plus'

interface StoreState {
  isLogin: boolean
  switchAsk: boolean
  topPath: string
  power: number
  errCode: number
  errMsg: string
  videoRegions: Region[]
  readRegions: Region[]
  richTextEditorHasRegist: boolean
  richTextEditorPreview: boolean
}

type Region = {
  name: string
  slug: string
}

type FSOpt = {
  title: string
  tip?: string
  placeholder?: string
  msgMaxlength?: number
  fileSize?: number
  fileNum?: number
  submitHandler: (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => void
  cancelHandler?: Function
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
    videoRegions: [],
    readRegions: [],
    richTextEditorHasRegist: false,
    richTextEditorPreview: false,
  }),

  actions: {
    openLoginWindow: (cfg?: { tip?: string, option?: 'password' | 'vcode' }) => { },
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
    getVideoRegions: async () => { },
    getReadRegions: async () => { },
    setReadSlug: (slug: string) => { },
  }
})
