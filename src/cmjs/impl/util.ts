export default {
  isMobile(): boolean {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) !== null
  },
  
  isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  },

  checkCookieExist(cookieName: string): boolean {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName + "=")) {
        return true;
      }
    }
    return false;
  },
  
  scrollToTopSmoothly() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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
  btnCD(btn: HTMLButtonElement, cdTime: number) {
    const text = btn.innerText
  
    btn.disabled = true
    btn.classList.add('is-disabled')
    btn.innerText = text + "(" + cdTime + ")"
  
    const dec = setInterval(() => {
      cdTime--
      btn.innerText = text + "(" + cdTime + ")"
      if (cdTime === 0) {
        clearInterval(dec);
        btn.innerText = text
        btn.classList.remove('is-disabled')
        btn.disabled = false
      }
    }, 1000)
  },
}