import { apiInstance } from "."

type Read = {
  title: string
  content: string
  coverName: string
  region: string
  tags: string[]
  autoPublish: boolean
}

const getRegions = () => apiInstance.get("/api/v1/read/region").then(res => res.data)

const uploadRead = (read: Read) => apiInstance.post("/api/v1/read/upload", read).then(res => res.data)

export {
  getRegions,
  uploadRead,
}