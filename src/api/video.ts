import { apiInstance } from "."

type Video = {
  videoName: string,
  coverName: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean,
  autoPublish: boolean
}

type EditVideo = {
  videoUrl: string // 后端不会接收该参数
  videoName: string
  coverUrl: string // 后端不会接收该参数
  coverName: string
  title: string
  region: string
  tags: string[]
  intro: string
  empower: boolean
  id: number
  typ: "video" | "video-is-pubing" | "video-not-pubed"
  autoPublish: boolean
}

const getRegions = () => apiInstance.get("/api/v1/video/region").then(res => res.data)

const getMyArticleVideoNum = (timestamp: number) => apiInstance.post("/api/v1/user/platform/article/video/num", { timestamp: timestamp }).then(res => res.data)

const getMyPubedVideo = (timestamp: number, page: number) => apiInstance.post("/api/v1/user/platform/article/video/pubed", { timestamp: timestamp, page: page }).then(res => res.data)

const getMyIsPubingVideo = (timestamp: number, page: number) => apiInstance.post("/api/v1/user/platform/article/video/is-pubing", { timestamp: timestamp, page: page }).then(res => res.data)

const getMyNotPubedVideo = (timestamp: number, page: number) => apiInstance.post("/api/v1/user/platform/article/video/not-pubed", { timestamp: timestamp, page: page }).then(res => res.data)

const uploadVideo = (video: Video) => apiInstance.post("/api/v1/video/upload", video).then(res => res.data)

const getVideo = (vid: number) => apiInstance.get(`/api/v1/video/${vid}`).then(res => res.data)

const pbOrNopbVideo = (id: number, pb: boolean) => apiInstance.post("/api/v1/video/oper/pb-or-nopb", { id: id, pb: pb }).then(res => res.data)

const deleteVideo = (id: number, typ: "video" | "video-is-pubing" | "video-not-pubed") => apiInstance.post("/api/v1/video/oper/del", { id: id, typ: typ }).then(res => res.data)

const getEditVideo = (id: number, typ: "video" | "video-is-pubing" | "video-not-pubed") => apiInstance.post("/api/v1/video/edit/query", { id: id, typ: typ }).then(res => res.data)

const uploadEditVideo = (video: EditVideo) => apiInstance.post("/api/v1/video/edit", video).then(res => res.data)

const appealVideo = (id: number, content: string, imgs: string[]) => apiInstance.post("/api/v1/video/appeal", { id: id, content: content, imgs: imgs }).then(res => res.data)

const getAppealVideo = (id: number) => apiInstance.get(`/api/v1/video/appeal/${id}`).then(res => res.data)

export {
  getRegions,
  getMyArticleVideoNum,
  getMyPubedVideo,
  getMyIsPubingVideo,
  getMyNotPubedVideo,
  uploadVideo,
  getVideo,
  pbOrNopbVideo,
  deleteVideo,
  getEditVideo,
  uploadEditVideo,
  appealVideo,
  getAppealVideo,
}