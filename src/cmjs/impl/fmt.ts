// fmt.ts 将数据格式化

import util from "./util"

// tsRich 将时间戳转换为富日期
// 富日期：刚刚、x秒前、x分钟前、x小时前
// *使用该函数时需确保时间戳是今天
function tsRich(ts: number): string {
  // diff 时间戳相减后再除以1000，可得到时间相差多少秒
  const diff = Math.floor((Date.now() - ts) / 1000)

  const hAgo = Math.floor(diff / 3600)
  if (hAgo >= 1) {
    return hAgo + "小时前"
  }

  const mAgo = Math.floor(diff / 60)
  if (mAgo >= 1) {
    return mAgo + "分钟前"
  }

  if (diff > 0) {
    return diff + "秒前"
  }

  return "刚刚"
}

export default {
  // tsTmpl 将时间戳转换为指定格式的日期
  tsTmpl(timestamp: number, template: string): string {
    const date = new Date(timestamp)

    const year = date.getFullYear().toString()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    const formattedDate = template
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)

    return formattedDate
  },

  // tsStandard 将时间戳转换为标准格式的日期（YYYY-MM-DD HH:mm:ss）
  tsStandard(timestamp: number): string {
    return this.tsTmpl(timestamp, "YYYY-MM-DD HH:mm:ss")
  },

  // tsYTmpl 同tsTmpl，但如果传入的时间戳是今年，将不会显示年份
  // *使用该函数时template不能含有"YYYY-"
  tsYTmpl(timestamp: number, template: string): string {
    const curYear = new Date(Date.now()).getFullYear()
    const tsYear = new Date(timestamp).getFullYear()
    if (curYear === tsYear) {
      return this.tsTmpl(timestamp, template)
    }
    return this.tsTmpl(timestamp, "YYYY-" + template)
  },

  // tsYRichTmpl 同tsYTmpl，但如果传入的时间戳是今天，将显示富日期
  // 富日期：刚刚、x秒前、x分钟前、x小时前
  // *使用该函数时template不能含有"YYYY-"
  tsYRichTmpl(timestamp: number, template: string): string {
    const curDay = new Date(Date.now()).getDate()
    const tsDay = new Date(timestamp).getDate()
    if (curDay !== tsDay) {
      return this.tsYTmpl(timestamp, template)
    }
    return tsRich(timestamp)
  },

  // numWE 将数字转换为x万或x亿
  numWE(num: number): string {
    if (num < 10000) {
      return num.toString()
    }
    if (num < 100000000) {
      return util.toFixed(num / 10000, 1).toString() + "万"
    }
    return util.toFixed(num / 100000000, 1).toString() + "亿"
  },

  // videoDuration 将视频秒数转换为视频时长
  // 视频时长：>=1h：HH:mm:ss，<1h：mm:ss
  videoDuration(videoSecond: number): string {
    const hours = Math.floor(videoSecond / 3600)
    videoSecond -= hours * 3600
    const minutes = Math.floor(videoSecond / 60)
    videoSecond -= minutes * 60
    const seconds = videoSecond

    const mm = String(minutes).padStart(2, '0')
    const ss = String(seconds).padStart(2, '0')

    if (hours !== 0) {
      const HH = String(hours).padStart(2, '0')
      return `${HH}:${mm}:${ss}`
    }

    return `${mm}:${ss}`
  },
}