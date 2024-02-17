export default {
  // setLS set localStorage
  setLS(key: string, value: string | number | boolean) {
    switch (typeof value) {
      case 'string': {
        localStorage.setItem(key, value)
        return
      }
      case 'number': {
        localStorage.setItem(key, value.toString())
        return
      }
      case 'boolean': {
        localStorage.setItem(key, value ? "true" : "false")
        return
      }
    }
  },

  getLS(key: string): string | null {
    return localStorage.getItem(key)
  },

  delLS(key: string) {
    localStorage.removeItem(key)
  },

  // maxAge单位：秒
  setCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`
  },

  // 未找到名为name的cookie时将返回“”
  getCookie(name: string): string {
    name += "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length)
      }
    }

    return ""
  },

  checkCookieExist(name: string): boolean {
    name += "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim()
      if (cookie.indexOf(name) === 0) {
        return true
      }
    }

    return false
  },

  delCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}