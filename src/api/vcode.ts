import { apiInstance } from "."

const login = (email: string, captchaId: string) => apiInstance.post("/api/v1/vcode/email/login", { email: email, captcha_id: captchaId }).then(res => res.data)

const changePasswordOrEmail = (option: "password" | "email", captchaId: string, email?: string) => apiInstance.post(`/api/v1/vcode/email/change-${option}`, { captcha_id: captchaId, email: email }).then(res => res.data)

export {
  login,
  changePasswordOrEmail,
}