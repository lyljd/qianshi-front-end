import prompt from "./prompt"
import cache from "./cache"
import { ElMessageBox } from 'element-plus'

type disabledEleResp = {
  disabled: () => void,
  cancelDisabled: () => void,
  isCounting: () => boolean,
  countDown: (second: number, endStatus?: Function, endDo?: Function) => void,
  endCountDown: (disabled: boolean) => void,
}

export default {
  browserAlert() {
    if (this.isMobile() || cache.checkCookieExist('browserAlert')) {
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

  // isVisible 判断某元素是否处于页面的可见区域内
  isVisible(ele: HTMLElement): boolean {
    const rect = ele.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  },

  // isVisibleInContainer 判断某元素是否处于某个容器（另一个元素）的可见区域内
  isVisibleInContainer(ele: HTMLElement, container: HTMLElement) {
    const eleRect = ele.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    return (
      eleRect.top >= containerRect.top &&
      eleRect.left >= containerRect.left &&
      eleRect.bottom <= containerRect.bottom &&
      eleRect.right <= containerRect.right
    )
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

  // scrollIntoView 如果某元素不在页面的可见区域内，则滚动页面直至元素可见，并让元素出现在页面的pos位置处
  scrollIntoView(pos: 'start' | 'center' | 'end', ele: HTMLElement) {
    if (!this.isVisible(ele)) {
      ele.scrollIntoView({
        block: pos,
        behavior: "smooth",
      })
    }
  },

  // scrollIntoViewInContainer 如果某元素不在某个容器（另一个元素）的可见区域内，则在该容器内滚动直至元素可见，offset为偏移量（在滚动后对位置进行上下调整）
  scrollIntoViewInContainer(ele: HTMLElement, container: HTMLElement, offset?: number) {
    if (!this.isVisibleInContainer(ele, container)) {
      container.scrollTop = ele.offsetTop - container.offsetTop + (offset ? offset : 0)
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

  // btnCD 让一个按钮禁止second秒（到时间后会取消禁止，所以如果按钮的禁止状态不固定请使用disabledButton）
  btnCD(btn: HTMLButtonElement, second: number) {
    if (second <= 0) {
      return
    }

    const text = btn.innerText

    btn.disabled = true
    btn.classList.add('is-disabled')
    btn.innerText = text + "(" + second + ")"

    const timerId = setInterval(() => {
      second--
      btn.innerText = text + "(" + second + ")"

      if (second === 0) {
        clearInterval(timerId)
        btn.innerText = text
        btn.classList.remove('is-disabled')
        btn.disabled = false
      }
    }, 1000)
  },

  // disabled: 让元素处于禁止状态
  // cancelDisabled: 取消元素的禁止状态
  // countDown: 让元素处于禁止状态，接着开启一个倒计时，在倒计时结束时调用endStatus，然后根据返回值决定取消是否元素的禁止状态（默认为true），最后再调用endDo
  // endCountDown: 立即结束倒计时（根据disabled的值决定元素的禁止状态；优先级大于endDisabled）
  // isCounting: 是否处于倒计时中
  disabledButton(btn: HTMLButtonElement): disabledEleResp {
    const disabled = () => {
      btn.disabled = true
      btn.classList.add('is-disabled')
    }

    const cancelDisabled = () => {
      btn.classList.remove('is-disabled')
      btn.disabled = false
    }

    let countDownDo: Function
    let counting = ref(false)

    const isCounting = (): boolean => {
      return counting.value
    }

    const countDown = (second: number, endStatus?: Function, endDo?: Function) => {
      if (isCounting() || second <= 0) {
        return
      }

      disabled()

      const text = btn.innerText
      btn.innerText = text + "(" + second + ")"

      let timerId: number
      countDownDo = function (status: boolean) {
        clearInterval(timerId)
        btn.innerText = text

        if (status) {
          cancelDisabled()
        }

        if (endDo) {
          endDo()
        }
      }

      counting.value = true
      timerId = setInterval(() => {
        second--
        btn.innerText = text + "(" + second + ")"

        if (second === 0) {
          counting.value = false
          countDownDo(!endStatus || endStatus())
        }
      }, 1000)
    }

    const endCountDown = (disabled: boolean) => {
      if (!isCounting()) {
        return
      }

      counting.value = false
      countDownDo(!disabled)
    }

    return {
      disabled, cancelDisabled, isCounting, countDown, endCountDown
    }
  },

  disabledSpan(span: HTMLSpanElement): disabledEleResp {
    const disabled = () => {
      span.style.pointerEvents = "none"
    }

    const cancelDisabled = () => {
      span.style.pointerEvents = "auto"
    }

    let countDownDo: Function
    let counting = ref(false)

    const isCounting = (): boolean => {
      return counting.value
    }

    const countDown = (second: number, endStatus?: Function, endDo?: Function) => {
      if (isCounting() || second <= 0) {
        return
      }

      disabled()

      const text = span.innerText
      span.innerText = text + "(" + second + ")"

      let timerId: number
      countDownDo = function (status: boolean) {
        clearInterval(timerId)
        span.innerText = text

        if (status) {
          cancelDisabled()
        }

        if (endDo) {
          endDo()
        }
      }

      counting.value = true
      timerId = setInterval(() => {
        second--
        span.innerText = text + "(" + second + ")"

        if (second === 0) {
          counting.value = false
          countDownDo(!endStatus || endStatus())
        }
      }, 1000)
    }

    const endCountDown = (disabled: boolean) => {
      if (!isCounting()) {
        return
      }

      counting.value = false
      countDownDo(!disabled)
    }

    return {
      disabled, cancelDisabled, isCounting, countDown, endCountDown
    }
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

  // encEmail 加密邮箱（只针对@前加密；<=3时填充3个*；4、5时保留前后1位，中间填充等量*；，>=6时保留前后2位，中间填充2个*）
  encEmail(email: string): string {
    const idx = email.indexOf("@")
    if (idx === -1) {
      return ""
    }

    const prefix = email.substring(0, idx)
    const suffix = email.substring(idx)
    const l = prefix.length
    if (l <= 3) {
      return "***" + suffix
    } else if (l <= 5) {
      return prefix[0] + (l === 4 ? '**' : '***') + prefix[l - 1] + suffix
    } else {
      return prefix.substring(0, 2) + "**" + prefix.substring(l - 2) + suffix
    }
  },

  // 获取的时间戳是后端所需要的格式；BE:back-end
  getCurBETimestamp(): number {
    return Math.trunc(Date.now() / 1000)
  },

  // 获取文件后缀名（不带.）
  getFileSuffix(fileName: string): string {
    let idx = fileName.lastIndexOf(".")
    return fileName.substring(idx + 1)
  },
}