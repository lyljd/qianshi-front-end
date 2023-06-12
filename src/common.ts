function isMobile(): boolean {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) === null
}

function isLogin(): boolean {
  const token = localStorage.getItem("token")
  return token !== null && token !== ""
}

function logout() {
  localStorage.removeItem("uid")
  localStorage.removeItem("nickname")
  localStorage.removeItem("avatarUrl")
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
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

function toFixed(num: number, decimal: number) {
  let numS = num.toString();
  let index = numS.indexOf('.');
  if (index !== -1) {
    numS = numS.substring(0, decimal + index + 1)
  } else {
    numS = numS.substring(0)
  }
  return parseFloat(numS).toFixed(decimal)
}

function numFormatterW(num: number) {
  if (num < 10000) {
    return num.toString()
  }
  return toFixed(num / 10000, 1).toString() + "万"
}

function videoTimeFormatterHMS(time: number) {
  let h = Math.floor(time / 3600)
  time -= h * 3600
  let m = Math.floor(time / 60)
  time -= m * 60
  let s = time

  let hs = h < 10 ? "0" + h.toString() : h.toString()
  let ms = m < 10 ? "0" + m.toString() : m.toString()
  let ss = s < 10 ? "0" + s.toString() : s.toString()

  return h > 0 ? hs + ":" + ms + ":" + ss : ms + ":" + ss
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

function timestampFormatterMD(timestamp: number) {
  let date = timestampFormatter(timestamp)
  let dateNow = timestampFormatter(Date.now())

  if (date.year !== dateNow.year || date.month !== dateNow.month) {
    let mons = date.month < 10 ? "0" + date.month.toString() : date.month.toString()
    let ds = date.day < 10 ? "0" + date.day.toString() : date.day.toString()
    return mons + "-" + ds
  }

  let dayDiff = dateNow.day - date.day
  if (dayDiff >= 1) {
    if (dayDiff === 1) {
      let hs = date.hour < 10 ? "0" + date.hour.toString() : date.hour.toString()
      let mins = date.minute < 10 ? "0" + date.minute.toString() : date.minute.toString()
      return "昨天 " + hs + ":" + mins
    }
    return `${dayDiff}天前`
  }

  let hourDiff = dateNow.hour - date.hour
  if (hourDiff >= 1) {
    return `${hourDiff}小时前`
  }

  let minuteDiff = dateNow.minute - date.minute
  if (minuteDiff >= 1) {
    return `${minuteDiff}分钟前`
  }

  let secondDiff = dateNow.second - date.second
  if (secondDiff >= 1) {
    return `${secondDiff}秒前`
  }

  return "刚刚"
}

function ToVideo(vid: number) {
  window.open(`/v/${vid}`, "_blank")
}

function ToUser(uid: number) {
  window.open(`/u/${uid}`, "_blank")
}

function ToDeveloper() {
  window.open("https://github.com/lyljd", "_blank")
}

function checkCookieExists(cookieName:string) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return true;
    }
  }
  return false;
}

export {
  isMobile,
  isLogin,
  logout,
  btnCD,
  numFormatterW,
  videoTimeFormatterHMS,
  ToVideo,
  ToUser,
  ToDeveloper,
  timestampFormatter,
  timestampFormatterMD,
  checkCookieExists,
}