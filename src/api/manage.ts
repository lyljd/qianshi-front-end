import { apiInstance } from "."

type Region = {
  sort?: number
  name: string
  slug: string
}

const setVideoRegions = (regions: Region[]) => apiInstance.put("/api/v1/manage/region/video", { regions: regions }).then(res => res.data)

const setReadRegions = (regions: Region[]) => apiInstance.put("/api/v1/manage/region/read", { regions: regions }).then(res => res.data)

const getReviewVideos = (timestamp: number, page: number) => apiInstance.post("/api/v1/manage/review/video", { timestamp: timestamp, page: page }).then(res => res.data)

const operReviewVideo = (id: number, oper: "pass" | "deny", reason?: string) => apiInstance.post("/api/v1/manage/review/video/oper", { id: id, oper: oper, reason: reason ? reason : "" }).then(res => res.data)

const getAppealVideos = (timestamp: number, page: number) => apiInstance.post("/api/v1/manage/feedback/video", { timestamp: timestamp, page: page }).then(res => res.data)

const operAppealVideo = (id: number, oper: "pass" | "deny", reason?: string) => apiInstance.post("/api/v1/manage/feedback/video/oper", { id: id, oper: oper, reason: reason ? reason : "" }).then(res => res.data)

export {
  setVideoRegions,
  setReadRegions,
  getReviewVideos,
  operReviewVideo,
  getAppealVideos,
  operAppealVideo,
}