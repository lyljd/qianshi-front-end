import { apiInstance } from "."

type Region = {
  sort?: number
  name: string
  slug: string
}

const setRegions = (regions: Region[]) => apiInstance.put("/api/v1/manage/region", { regions: regions }).then(res => res.data)

export {
  setRegions
}