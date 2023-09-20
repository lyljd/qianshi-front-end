import { ElMessage } from 'element-plus'

const offset = 77 // 页面顶部菜单栏高度为57，再间隔20

export default {
  success(msg: string) {
    ElMessage({
      type: "success",
      message: msg,
      offset: offset,
      grouping: true,
    })
  },

  error(msg: string) {
    ElMessage({
      type: "error",
      message: msg,
      offset: offset,
      grouping: true,
    })
  },

  warning(msg: string) {
    ElMessage({
      type: "warning",
      message: msg,
      offset: offset,
      grouping: true,
    })
  },

  info(msg: string) {
    ElMessage({
      message: msg,
      offset: offset,
      grouping: true,
    })
  },
}