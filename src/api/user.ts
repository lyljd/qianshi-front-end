import { apiInstance } from "."

type MeSetting = {
  nickname: string
  signature: string
  gender: string
  birthday: string
  tags: string[]
}

const emailLogin = (email: string, code: string) => apiInstance.post("/api/v1/user/login/email", { email: email, code: code }).then(res => res.data)

const passLogin = (email: string, pass: string) => apiInstance.post("/api/v1/user/login/pass", { email: email, pass: pass }).then(res => res.data)

const meExp = () => apiInstance.get("/api/v1/user/me/exp").then(res => res.data)

const meInfo = () => apiInstance.get("/api/v1/user/me/info").then(res => res.data)

const meInfoUpdate = (info: MeSetting) => apiInstance.put("/api/v1/user/me/info", info).then(res => res.data)

const meSecurity = () => apiInstance.get("/api/v1/user/me/security").then(res => res.data)

const meCoin = () => apiInstance.get("/api/v1/user/me/coin").then(res => res.data)

const mePassOrEmailVerify = (option: "pass" | "email", code: string, email?: string) => apiInstance.post(`/api/v1/user/me/${option}/verify`, { code: code, email: email }).then(res => res.data)

const mePassChange = (pass: string) => apiInstance.post("/api/v1/user/me/pass/change", { pass: pass }).then(res => res.data)

const meEmailChange = (email: string) => apiInstance.post("/api/v1/user/me/email/change", { email: email }).then(res => res.data)

const meAvatar = () => apiInstance.get("/api/v1/user/me/avatar").then(res => res.data)

const mePower = () => apiInstance.get("/api/v1/user/me/power").then(res => res.data)

const userInfo = (uid: number) => apiInstance.get(`/api/v1/user/${uid}`).then(res => res.data)

const MeSignature = (newSignature: string) => apiInstance.put('/api/v1/user/me/signature', { newSignature: newSignature }).then(res => res.data)

const MeTopImgNo = (topImgNo: number) => apiInstance.put('/api/v1/user/me/top-img-no', { topImgNo: topImgNo }).then(res => res.data)

const MeAvatarHover = () => apiInstance.get('/api/v1/user/me/avatar-hover').then(res => res.data)

const SignIn = () => apiInstance.post('/api/v1/user/sign-in').then(res => res.data)

const IsSignIn = () => apiInstance.get('/api/v1/user/sign-in').then(res => res.data)

const Follow = (followingId: number) => apiInstance.post(`/api/v1/user/follow/${followingId}`).then(res => res.data)

const CancelFollow = (followingId: number) => apiInstance.delete(`/api/v1/user/follow/${followingId}`).then(res => res.data)

const GetFollows = (uid: number, page: number, timestamp: number) => apiInstance.post('/api/v1/user/follows', { id: uid, page: page, timestamp: timestamp }).then(res => res.data)

const GetFans = (uid: number, page: number, timestamp: number) => apiInstance.post('/api/v1/user/fans', { id: uid, page: page, timestamp: timestamp }).then(res => res.data)

const getMyVipInfo = () => apiInstance.get('/api/v1/user/vip').then(res => res.data)

const PurchaseVip = (goodsId: number) => apiInstance.post('/api/v1/user/vip/purchase', { goodsId: goodsId }).then(res => res.data)

export {
  emailLogin,
  passLogin,
  meExp,
  meInfo,
  meInfoUpdate,
  meSecurity,
  meCoin,
  mePassOrEmailVerify,
  mePassChange,
  meEmailChange,
  meAvatar,
  mePower,
  userInfo,
  MeSignature,
  MeTopImgNo,
  MeAvatarHover,
  SignIn,
  IsSignIn,
  Follow,
  CancelFollow,
  GetFollows,
  GetFans,
  getMyVipInfo,
  PurchaseVip
}