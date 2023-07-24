import { ElMessage } from 'element-plus'

function isMobile(): boolean {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) === null
}

function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

function isLogin(): boolean {
  return localStorage.getItem("token") !== null && localStorage.getItem("token") !== ""
}

function isMe(uid: number): boolean {
  const localUid = localStorage.getItem("uid")
  if (localUid && uid.toString() === localUid) {
    return true
  }
  return false
}

function btnCD(btn: HTMLButtonElement, cd: number) {
  let time = cd / 1000
  let text = btn.innerText

  btn.disabled = true
  btn.classList.add('is-disabled')
  btn.innerText = text + "(" + time + ")"

  let dec = setInterval(() => {
    time--
    btn.innerText = text + "(" + time + ")"
    if (time === 0) {
      clearInterval(dec);
      btn.innerText = text
      btn.classList.remove('is-disabled')
      btn.disabled = false
    }
  }, 1000)
}

function toFixed(num: number, decimal: number): string {
  let numS = num.toString();
  let index = numS.indexOf('.');
  if (index !== -1) {
    numS = numS.substring(0, decimal + index + 1)
  } else {
    numS = numS.substring(0)
  }
  return parseFloat(numS).toFixed(decimal)
}

function numFormatterW(num: number): string {
  if (num < 10000) {
    return num.toString()
  }
  if (num < 100000000) {
    return toFixed(num / 10000, 1).toString() + "万"
  }
  return toFixed(num / 100000000, 1).toString() + "亿"
}

function add0(num: number): string {
  return num < 10 ? "0" + num.toString() : num.toString()
}

function videoTimeFormatterHMS(time: number): string {
  let h = Math.floor(time / 3600)
  time -= h * 3600
  let m = Math.floor(time / 60)
  time -= m * 60
  let s = time

  return h > 0 ? add0(h) + ":" + add0(m) + ":" + add0(s) : add0(m) + ":" + add0(s)
}

type date = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}
function timestampFormatter(timestamp: number): date {
  let date = new Date(timestamp)
  let y = date.getFullYear()
  let mon = date.getMonth() + 1 //注意月份从 0 开始，所以要加 1
  let d = date.getDate()
  let h = date.getHours()
  let min = date.getMinutes()
  let s = date.getSeconds()

  return {
    year: y,
    month: mon,
    day: d,
    hour: h,
    minute: min,
    second: s,
  }
}

function timestampFormatterStandard(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  return `${d.year}-${add0(d.month)}-${add0(d.day)} ${add0(d.hour)}:${add0(d.minute)}:${add0(d.second)}`
} //返回日期格式：年-月-日 时:分:秒

function timestampFormatterStandardExcludeSecondOrAndYear(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  let ret = `${add0(d.month)}-${add0(d.day)} ${add0(d.hour)}:${add0(d.minute)}`

  if (d.year < dn.year) {
    ret = `${d.year}-` + ret
  }

  return ret
} //返回日期格式：月-日 时:分；若时间戳不为今年，则为：年-月-日 时:分

function timestampFormatterYMD(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  return `${d.year}-${add0(d.month)}-${add0(d.day)}`
} //返回日期格式：年-月-日

function timestampFormatterAgo(timestamp: number): string {
  let dts = timestamp
  let dnts = Date.now()

  let diff = Math.floor((dnts - dts) / 1000) //时间戳相减后再除以1000，可得到时间相差多少秒

  let hAgo = Math.floor(diff / 3600)
  if (hAgo >= 1) {
    return hAgo + "小时前"
  }

  let mAgo = Math.floor(diff / 60)
  if (mAgo >= 1) {
    return mAgo + "分钟前"
  }

  if (diff === 0) {
    return "刚刚"
  }

  return diff + "秒前"
} //使用此函数时需确保时间戳在今日内；返回x（小时、分钟、秒）前 或 刚刚

function timestampFormatterRich(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  if (d.year < dn.year || d.month < dn.month || d.day < dn.day) {
    return timestampFormatterStandardExcludeSecondOrAndYear(timestamp)
  }

  return timestampFormatterAgo(timestamp)
} //返回日期格式：若时间戳不为今天，为：StandardExcludeSecondOrAndYear；反之则为Ago

function timestampFormatterRichExcludeHM(timestamp: number): string {
  let d = timestampFormatter(timestamp)
  let dn = timestampFormatter(Date.now())

  if (d.year < dn.year || d.month < dn.month || d.day < d.day) {
    let d = timestampFormatter(timestamp)
    let dn = timestampFormatter(Date.now())

    let ret = `${add0(d.month)}-${add0(d.day)}`

    if (d.year < dn.year) {
      ret = `${d.year}-` + ret
    }

    return ret
  }

  return timestampFormatterAgo(timestamp)
} //返回日期格式：不包含小时和分钟的Rich

function ToVideo(vid: number) {
  window.open(`/v/${vid}`, "_blank")
}

function ToRead(vid: number) {
  window.open(`/r/${vid}`, "_blank")
}

function ToUser(uid: number) {
  window.open(`/u/${uid}`, "_blank")
}

function ToNewPage(url: string) {
  window.open(url, "_blank")
}

function ToDeveloper() {
  window.open("https://github.com/lyljd", "_blank")
}

function checkCookieExists(cookieName: string): boolean {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return true;
    }
  }
  return false;
}

function scrollToTopSmoothly() {
  const scrollDuration = 300; // 滚动持续时间（以毫秒为单位）
  const scrollStep = -window.scrollY / (scrollDuration / 15); // 每个步骤滚动的距离

  const scrollInterval = setInterval(function () {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15);
}

function showError(msg: string) {
  ElMessage({
    type: "error",
    offset: 77,
    message: msg,
  })
}

function showSuccess(msg: string) {
  ElMessage({
    type: "success",
    offset: 77,
    message: msg,
  })
}

function showInfo(msg: string) {
  ElMessage({
    offset: 77,
    message: msg,
  })
}

function seeLater(vid: number) {
  console.log(vid) //TODO api request
  showSuccess("添加成功")
}

function cancelSeeLater(vid: number) {
  console.log(vid) //TODO api request
  showSuccess("取消成功")
}

function expToLevel(exp: number): number {
  if (exp < 350) {
    return 1
  }
  if (exp < 1500) {
    return 2
  }
  if (exp < 4500) {
    return 3
  }
  if (exp < 9000) {
    return 4
  }
  if (exp < 18000) {
    return 5
  }
  return 6
}

export {
  isMobile,
  isSafari,
  isLogin,
  isMe,
  btnCD,
  numFormatterW,
  videoTimeFormatterHMS,
  add0,
  timestampFormatter,
  timestampFormatterStandard,
  timestampFormatterStandardExcludeSecondOrAndYear,
  timestampFormatterYMD,
  timestampFormatterAgo,
  timestampFormatterRich,
  timestampFormatterRichExcludeHM,
  ToVideo,
  ToRead,
  ToUser,
  ToNewPage,
  ToDeveloper,
  checkCookieExists,
  scrollToTopSmoothly,
  showError,
  showSuccess,
  showInfo,
  seeLater,
  cancelSeeLater,
  expToLevel,
}