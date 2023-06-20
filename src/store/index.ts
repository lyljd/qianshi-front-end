import { defineStore } from 'pinia'

export const useStore = defineStore("qianshi", {
  state: () => ({
    isLogin: localStorage.getItem("token") !== null && localStorage.getItem("token") !== "",
    openLoginWindow: () => { }
  }),
})