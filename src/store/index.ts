import { defineStore } from 'pinia'
import * as common from "../common"

export const useStore = defineStore("qianshi", {
  state: () => ({
    switchAsk: false,

    isLogin: common.isLogin(),
    openLoginWindow: () => { },
    setPlatformCurTitle: (_: string) => { },
    setMeCurTitle: (_: string) => { },
    setUploadItem: (_: string) => { },
    getUploadItem: (): string => { return "" },
  }),
})