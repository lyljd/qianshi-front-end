import { apiInstance } from "."

const getUploadUrl = (uploadType: string, fileSuffix: string) => apiInstance.post("/api/v1/auth/url/upload", { upload_type: uploadType, file_suffix: fileSuffix }).then(res => res.data)

export {
  getUploadUrl,
}