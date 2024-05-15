import axios from "axios"
import { AxiosProgressEvent } from "axios"

type UploadPara = {
  uploadUrl: string
  file: File
  contentType: string
  xOssCallback: string
  onUploadProgress: (progressEvent: AxiosProgressEvent)=>void,
}

const upload = (up: UploadPara) => axios({
  method: "put",
  url: up.uploadUrl,
  data: up.file,
  headers: {
    "Content-Type": up.contentType,
    "X-Oss-Callback": up.xOssCallback,
  },
  onUploadProgress: up.onUploadProgress,
}).then(res => res.data)

export {
  upload,
}