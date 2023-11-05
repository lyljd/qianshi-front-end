import { ElMessage } from 'element-plus'

const offset = 77 // 页面顶部菜单栏高度为57，再间隔20

export default {
  success(msg: string, appendToEle?: HTMLElement) {
    ElMessage({
      type: "success",
      message: msg,
      offset: offset,
      grouping: true,
      appendTo: appendToEle,
    })
  },

  error(msg: string, appendToEle?: HTMLElement) {
    ElMessage({
      type: "error",
      message: msg,
      offset: offset,
      grouping: true,
      appendTo: appendToEle,
    })
  },

  warning(msg: string, appendToEle?: HTMLElement) {
    ElMessage({
      type: "warning",
      message: msg,
      offset: offset,
      grouping: true,
      appendTo: appendToEle,
    })
  },

  info(msg: string, appendToEle?: HTMLElement) {
    ElMessage({
      message: msg,
      offset: offset,
      grouping: true,
      appendTo: appendToEle,
    })
  },
}