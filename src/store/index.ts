import { defineStore } from 'pinia'
import * as common from "../common"

export const useStore = defineStore("qianshi", {
  state: () => ({
    isLogin: common.isLogin(),
    openLoginWindow: () => { }
  }),
})