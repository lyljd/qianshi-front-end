import prompt from "./prompt"
import cache from "./cache"
import { ElMessageBox } from 'element-plus'

export default {
  browserAlert() {
    if (cache.checkCookieExist('browserAlert')) {
      return
    }

    ElMessageBox.alert('', '', {
      title: '浏览器建议',
      message: '使用Edge或Safari访问以获得最好的体验',
      confirmButtonText: '确认',
      autofocus: false,
      showClose: false,
      callback: () => {
        cache.setCookie('browserAlert', 'confirm', 604800) // 7d * 24h * 3600s
      },
    })
  },

  isMobile(): boolean {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) !== null
  },

  // isVisible 判断某元素是否处于页面可见区域内
  isVisible(ele: HTMLElement): boolean {
    const rect = ele.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  },

  scrollTo(top: number, ele?: HTMLElement) {
    if (ele) {
      ele.scrollTo({
        top: top,
        behavior: 'smooth',
      })
      return
    }

    window.scrollTo({
      top: top,
      behavior: 'smooth',
    })
  },

  // scrollIntoView 如果某元素不在页面可见区域内，则滚动页面到该元素可见的指定位置
  scrollIntoView(pos: 'start' | 'center' | 'end', ele: HTMLElement) {
    if (!this.isVisible(ele)) {
      ele.scrollIntoView({
        block: pos,
        behavior: "smooth",
      })
    }
  },

  // toFixed 将一个数字转换为指定位小数的字符串（不会四舍五入，位数不足会补0）
  toFixed(num: number, digits: number): string {
    let numS = num.toString();
    const index = numS.indexOf('.');
    if (index !== -1) {
      numS = numS.substring(0, digits + index + 1)
    } else {
      numS = numS.substring(0)
    }
    return parseFloat(numS).toFixed(digits)
  },

  // btnCD 让按钮进入指定秒的冷却状态（不能点击，并且会显示剩余的冷却时间）
  // 返回一个重置函数（恢复按钮到禁止前）；调用重置函数时会触发whenOverDo）
  // 如果按钮的click事件会被其他元素所触发，则需在click事件的函数内部最开始位置判断按钮是否处于禁止状态
  btnCD(btn: HTMLButtonElement, cdTime: number, whenOverDo?: Function): Function {
    const text = btn.innerText

    btn.disabled = true
    btn.classList.add('is-disabled')
    btn.innerText = text + "(" + cdTime + ")"

    const reset = () => {
      clearInterval(dec);
      btn.innerText = text
      btn.classList.remove('is-disabled')
      if (whenOverDo) {
        whenOverDo()
      }
      btn.disabled = false
    }

    const dec = setInterval(() => {
      cdTime--
      btn.innerText = text + "(" + cdTime + ")"
      if (cdTime === 0) {
        reset()
      }
    }, 1000)

    return reset
  },

  // spanCD 让标签进入指定秒的冷却状态（不能点击，并且会显示剩余的冷却时间）
  // 返回一个重置函数（恢复标签到禁止前）；调用重置函数时会触发whenOverDo）
  spanCD(span: HTMLSpanElement, cdTime: number, whenOverDo?: Function): Function {
    const text = span.innerText

    span.style.pointerEvents = "none"
    span.innerText = text + "(" + cdTime + ")"

    const reset = () => {
      clearInterval(dec);
      span.innerText = text
      span.style.pointerEvents = "unset"
      if (whenOverDo) {
        whenOverDo()
      }
    }

    const dec = setInterval(() => {
      cdTime--
      span.innerText = text + "(" + cdTime + ")"
      if (cdTime === 0) {
        reset()
      }
    }, 1000)

    return reset
  },

  copyToClip(content: string, appendToEle?: HTMLElement) {
    try {
      navigator.clipboard.writeText(content)
      prompt.success("复制成功", appendToEle)
    } catch (error) {
      if (!appendToEle) {
        prompt.error("失败复制，您的浏览器暂不支持", appendToEle)
        return
      }
      // 兼容
      const textarea = document.createElement('textarea')
      textarea.value = content
      appendToEle.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      appendToEle.removeChild(textarea)
      prompt.success("复制成功", appendToEle)
    }
  },

  getUrlQuery(name: string): string | null {
    return new URLSearchParams(window.location.search).get(name)
  },

  clearUrlQuery() {
    history.replaceState({}, '', window.location.href.split('?')[0])
  },

  // 先清除当前所有query，然后再新增指定query
  addUrlQuery(name: string, value: string | number) {
    history.replaceState({}, '', `${window.location.href.split('?')[0]}?${name}=${value}`)
  },

  // encryptionEmailText 加密邮箱文本（@前字符串下称为前缀，若前缀<=3位则前缀将被替换为"***"，若>3位则取前3位(不足3则有多少取多少)并拼接"***"）
  encryptionEmailText(email: string): string {
    const pos = email.indexOf("@")
    const prefix = email.substring(0, pos)
    return `${prefix.length > 3 ? prefix.substring(0, 3) : ""}***${email.substring(pos)}`
  }
}