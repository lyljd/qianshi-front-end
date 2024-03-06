import { apiInstance } from "."

const generateCaptchaId = () => apiInstance.get("/api/v1/captcha/image").then(res => res.data)

const getCaptcha = (id: string) => apiInstance.get(`/api/v1/captcha/image/${id}`).then(res => res.data)

const reloadCaptcha = (captchaId: string) => apiInstance.post("/api/v1/captcha/image/reload", { id: captchaId }).then(res => res.data)

const verifyCaptcha = (captchaId: string, code: string) => apiInstance.post("/api/v1/captcha/image/verify", { id: captchaId, code: code }).then(res => res.data)

export {
  generateCaptchaId,
  getCaptcha,
  reloadCaptcha,
  verifyCaptcha,
}