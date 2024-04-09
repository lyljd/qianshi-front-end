import { apiInstance } from "."

const getRegions = () => apiInstance.get("/api/v1/video/region").then(res => res.data)

export {
  getRegions
}