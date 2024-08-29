<template>
  <div class="v-container" v-loading="pageLoading">
    <el-tabs @tab-change="tabChange" v-model="viewItem">
      <el-tab-pane :label="`已通过 ${listNum.pubedNum}`" name="pubed">
        <el-table v-loading="pubedLoading && !pageLoading" @cell-click="pubedCellClick" :cell-style="pubedCellStyle"
          border :data="pubed.list" class="pubed" empty-text="暂无已通过的视频">
          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <Image :url="pubed.list[scope.$index].coverUrl" :w="210" :h="118.13" round errorText="封面加载失败"
                :errorTextFontSize="16"></Image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="89" label="发布状态">
            <template #default="scope">
              <span v-if="pubed.list[scope.$index].isPublish" style="color: #67C23A;">已发布</span>
              <span v-else style="color: #E6A23C;">未发布</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div class="oper">
                <el-button v-blur v-loading="pbing.includes(pubed.list[scope.$index].id)"
                  :disabled="pbing.includes(pubed.list[scope.$index].id)" v-if="!pubed.list[scope.$index].isPublish"
                  @click="publish(scope.$index)" size="small" type="success"><span
                    class="iconfont el-icon-fabu"></span>发布</el-button>
                <el-button v-blur v-loading="pbing.includes(pubed.list[scope.$index].id)"
                  :disabled="pbing.includes(pubed.list[scope.$index].id)" v-else @click="cancelPublish(scope.$index)"
                  size="small" type="warning"><span class="iconfont el-icon-xiajia"></span>下架</el-button>
                <el-button v-blur v-loading="getting.includes(scope.$index) && viewItem === 'pubed'"
                  :disabled="getting.includes(scope.$index) && viewItem === 'pubed'" @click="edit(scope.$index)"
                  size="small"><span class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-loading="deleting.includes(pubed.list[scope.$index].id)"
                  :disabled="deleting.includes(pubed.list[scope.$index].id)" v-blur
                  @click="deleteItem(scope.$index, 'del')" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.pubedNum > 10" class="page-container">
          <el-pagination :total="listNum.pubedNum" v-model:current-page="pubedCurPage" :page-size="10"
            hide-on-single-page background layout="prev, pager, next" />
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`进行中 ${listNum.isPubingNum}`" name="isPubing">
        <el-table v-loading="isPubingLoading && !pageLoading" @cell-click="isPubingCellClick"
          :cell-style="isPubingCellStyle" :data="isPubing.list" class="is-pubing" empty-text="暂无进行中的视频">
          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <Image :url="isPubing.list[scope.$index].coverUrl" :w="210" :h="118.13" round errorText="封面加载失败"
                :errorTextFontSize="16"></Image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="175" :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" />

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div class="oper">
                <el-button v-blur v-loading="getting.includes(scope.$index) && viewItem === 'isPubing'"
                  :disabled="getting.includes(scope.$index) && viewItem === 'isPubing'" @click="edit(scope.$index)"
                  size="small"><span class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-blur v-loading="deleting.includes(isPubing.list[scope.$index].id)"
                  :disabled="deleting.includes(isPubing.list[scope.$index].id)" v-if="!isPubing.list[scope.$index].vid"
                  @click="deleteItem(scope.$index, 'del')" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
                <el-button v-blur v-loading="deleting.includes(isPubing.list[scope.$index].id)"
                  :disabled="deleting.includes(isPubing.list[scope.$index].id)" v-if="isPubing.list[scope.$index].vid"
                  @click="deleteItem(scope.$index, 'cancel-modify')" size="small" type="warning"><span
                    class="iconfont el-icon-cancel"></span>取消修改</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.isPubingNum > 10" class="page-container">
          <el-pagination :total="listNum.isPubingNum" v-model:current-page="isPubingCurPage" :page-size="10"
            hide-on-single-page background layout="prev, pager, next" />
        </div>
      </el-tab-pane>

      <el-tab-pane :label="`未通过 ${listNum.notPubedNum}`" name="notPubed">
        <div class="tip">
          <span style="margin-top: 0; margin-bottom: 3px; color:red">在超过处理时间1天后，未通过且未处于申诉中的视频的视频资源和封面资源将被删除。</span>
        </div>
        <el-table v-loading="notPubedLoading && !pageLoading" @cell-click="notPubedCellClick"
          :cell-style="notPubedCellStyle" border :data="notPubed.list" class="not-pubed" empty-text="暂无未通过的视频">
          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <Image :url="notPubed.list[scope.$index].coverUrl" :w="210" :h="118.13" round errorText="封面加载失败"
                :errorTextFontSize="16"></Image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="175" label="申请～处理 时间">
            <template #default="scope">
              <div>{{ tableTimeFormatter(null, null, notPubed.list[scope.$index].applyTime) }}</div>
              <div>～</div>
              <div>{{ tableTimeFormatter(null, null, notPubed.list[scope.$index].processTime) }}</div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="reason" label="原因" />

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div class="oper">
                <el-button v-blur v-if="!notPubed.list[scope.$index].appealId"
                  v-loading="getting.includes(scope.$index) && viewItem === 'notPubed'"
                  :disabled="getting.includes(scope.$index) && viewItem === 'notPubed'" @click="edit(scope.$index)"
                  size="small"><span class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-blur v-loading="deleting.includes(notPubed.list[scope.$index].id)"
                  :disabled="deleting.includes(notPubed.list[scope.$index].id)" v-if="!notPubed.list[scope.$index].vid"
                  @click="deleteItem(scope.$index, 'del')" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
                <el-button v-blur v-loading="deleting.includes(notPubed.list[scope.$index].id)"
                  :disabled="deleting.includes(notPubed.list[scope.$index].id)" v-if="notPubed.list[scope.$index].vid"
                  @click="deleteItem(scope.$index, 'cancel-modify')" size="small" type="warning"><span
                    class="iconfont el-icon-cancel"></span>取消修改</el-button>
                <el-button v-blur v-loading="viewing.includes(scope.$index)" :disabled="viewing.includes(scope.$index)"
                  @click="!notPubed.list[scope.$index].appealId ? appeal(scope.$index) : showAppealDetails(scope.$index)"
                  size="small" type="info"><span class="iconfont el-icon-appeal"></span>{{
    notPubed.list[scope.$index].appealId ?
      "查看申诉" : "申诉" }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.notPubedNum > 10" class="page-container">
          <el-pagination :total="listNum.notPubedNum" v-model:current-page="notPubedCurPage" :page-size="10"
            hide-on-single-page background layout="prev, pager, next" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog width="75%" v-model="editWindowVisible" class="edit-dialog" :before-close="beforeEditWindowClose"
    title="视频编辑" align-center>
    <div class="v-container">
      <div class="upload-form">
        <div class="row">
          <span class="notice"><span class="require">*</span>视频：</span>
          <VideoUpload style="width: 100%;" :init-video-url="video.videoUrl"
            @setVideoUrl="(f: Function) => { setVideoUrl = f }" :uploadHandler="videoUploadHandler">
          </VideoUpload>
        </div>

        <div class="row">
          <span class="notice"><span class="require">*</span>封面：</span>
          <ImageUpload :init-img-url="video.coverUrl" @setImgUrl="(f: Function) => { setCoverUrl = f }" :w="270"
            :h="151.88" proportion="16:9" :uploadHandler="coverUploadHandler">
          </ImageUpload>
        </div>

        <div class="row">
          <span class="notice"><span class="require">*</span>标题：</span>
          <el-input ref="titleInputRef" v-model="video.title" maxlength="50" placeholder="请输入标题" show-word-limit />
        </div>

        <div class="row">
          <span class="notice">分区：</span>
          <el-select ref="regionSelect" v-model="video.region" placeholder="请选择分区">
            <template #empty>
              <div>暂无分区</div>
            </template>
            <el-option v-for="r in store.videoRegions" :label="r.name" :value="r.slug" />
          </el-select>
        </div>

        <div class="row">
          <span class="notice">标签：</span>
          <TagInput :tags="video.tags" :limit="10"></TagInput>
        </div>

        <div class="row">
          <span class="notice">简介：</span>
          <el-input v-model="video.intro" maxlength="1000" rows="3" placeholder="请输入简介" type="textarea"
            show-word-limit />
        </div>

        <div class="row">
          <span class="notice">权益声明：</span>
          <div>
            <el-checkbox :disabled="editEmpowerDisabled" v-model="video.empower" label="未经作者授权，禁止转载" />
            <div class="tip">
              <span>勾选后该文案会显示在视频播放页中</span>
              <span style="color: #FF6699;">若在编辑时取消勾选该项，后续再编辑时将不能恢复勾选。</span>
            </div>
          </div>
        </div>

        <div class="row">
          <span class="notice">自动发布：</span>
          <div>
            <el-checkbox v-model="video.autoPublish" label="审批通过后自动发布" />
            <div class="tip">
              <span>若未勾选该项，则在审批通过后需要自行手动点击发布</span>
            </div>
          </div>
        </div>

        <div class="row" style="justify-content: center;">
          <el-button v-blur v-loading="submitting"
            :disabled="!hasEdit || videoUploading || coverUploading || submitting" @click="submit" type="primary"
            size="large">修改</el-button>
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog width="75%" v-model="appealDetailsWindowVisible" title="申诉详情" align-center>
    <div class="appeal-detail-container">
      <el-descriptions :column="1" border style="margin-bottom: 20px;">
        <el-descriptions-item label="申诉理由" align="center">
          {{ appealVideoDetail.content }}
        </el-descriptions-item>

        <el-descriptions-item label="申请～处理 时间" align="center">
          <div>{{ cmjs.fmt.tsStandard(appealVideoDetail.applyAt) }}</div>
          <div>～</div>
          <div>{{ appealVideoDetail.processAt ? cmjs.fmt.tsStandard(appealVideoDetail.processAt) : '待处理' }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="附件" align="center">
          <div v-if="appealVideoDetail.imgs.length > 0" style="display: flex; gap: 8px; justify-content: center;">
            <Image :w="135" :h="135" v-for="url in appealVideoDetail.imgs" :url="url" preview contain border round>
            </Image>
          </div>
          <div v-else>无</div>
        </el-descriptions-item>

        <el-descriptions-item v-if="appealVideoDetail.processAt" label="驳回原因" align="center">
          {{ appealVideoDetail.reason || "无" }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import { ElMessageBox, ElSelect, ElInput, UploadUserFile } from 'element-plus'
import { useStore } from "@/store"
import ImageUpload from "@/components/common/ImageUpload.vue"
import VideoUpload from "@/components/common/VideoUpload.vue"
import TagInput from '@/components/common/TagInput.vue'
import * as VideoAPI from '@/api/video'
import * as AuthAPI from '@/api/auth'
import * as UploadAPI from '@/api/upload'
import _ from 'lodash'
import { AxiosProgressEvent } from "axios"

type Num = {
  pubedNum: number,
  isPubingNum: number,
  notPubedNum: number
}

type Pubed = {
  total: number
  list: {
    id: number
    coverUrl: string
    title: string
    vid: number
    isPublish: boolean
  }[]
}

type IsPubing = {
  total: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    applyTime: number,
    vid?: number,
  }[]
}

type NotPubed = {
  total: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    applyTime: number,
    processTime: number,
    reason: string,
    appealId?: number,
    vid?: number,
  }[]
}

type EditVideo = {
  videoUrl: string
  videoName: string
  coverUrl: string
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

type UploadPara = {
  url: string
  filename: string
  contentType: string
  xOssCallback: string
}

type AppealVideoDetail = {
  content: string
  imgs: string[]
  applyAt: number
  processAt?: number
  reason?: string
}

let pageLoading = ref(false)
let pubedLoading = ref(false)
let isPubingLoading = ref(false)
let notPubedLoading = ref(false)
let pbing = ref<number[]>([])
let deleting = ref<number[]>([])
let getting = ref<number[]>([]) // 编辑
let viewing = ref<number[]>([]) // 查看申诉
let submitting = ref(false)

const store = useStore()
store.setPlatformItemIndex(2, location.pathname)

const titleInputRef = ref<InstanceType<typeof ElInput>>()

let timestamp = cmjs.util.getCurBETimestamp()

let pubedCurPage = ref(1)
let isPubingCurPage = ref(1)
let notPubedCurPage = ref(1)

let listNum = ref<Num>({
  pubedNum: 0,
  isPubingNum: 0,
  notPubedNum: 0
})
setNum()
let pubed = ref<Pubed>({
  total: 0,
  list: []
})
let isPubing = ref<IsPubing>({
  total: 0,
  list: []
})
let notPubed = ref<NotPubed>({
  total: 0,
  list: []
})
let viewItem = ref(handleUrlQueryTab())

let video: EditVideo = reactive({
  videoName: "",
  videoUrl: "",
  coverName: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: true,
  id: 0,
  typ: "video",
  autoPublish: true,
})
let videoCopy = ref<EditVideo>({
  videoName: "",
  videoUrl: "",
  coverName: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: true,
  id: 0,
  typ: "video",
  autoPublish: true,
})
let appealVideoDetail = ref<AppealVideoDetail>({ content: "", imgs: [], applyAt: 0 })

let editWindowVisible = ref(false)
let appealDetailsWindowVisible = ref(false)
let editEmpowerDisabled = ref(false)
let hasEdit = ref(false)
let coverUploading = ref(false)
let videoUploading = ref(false)
let setCoverUrl: Function
let setVideoUrl: Function
let getSuccess = ref(false)

watch(video, (newV) => {
  if (!_.isEqual(newV, videoCopy.value)) {
    hasEdit.value = true
    store.switchAsk = true
  } else {
    hasEdit.value = false
    store.switchAsk = false
  }
})
watch(pubedCurPage, (newV) => {
  setPubed()
})
watch(isPubingCurPage, (newV) => {
  setIsPubing()
})
watch(notPubedCurPage, (newV) => {
  setNotPubed()
})

function tabChange() {
  switch (viewItem.value) {
    case "pubed": {
      if (pubed.value.list.length === 0) {
        setPubed()
      }
      cmjs.util.addUrlQuery('tab', 'pubed')
      break
    }
    case "isPubing": {
      if (isPubing.value.list.length === 0) {
        setIsPubing()
      }
      cmjs.util.addUrlQuery('tab', 'isPubing')
      break
    }
    case "notPubed": {
      if (notPubed.value.list.length === 0) {
        setNotPubed()
      }
      cmjs.util.addUrlQuery('tab', 'notPubed')
      break
    }
  }
}

function setNum() {
  pageLoading.value = true
  VideoAPI.getMyArticleVideoNum(timestamp)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      listNum.value = res.data
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      pageLoading.value = false
    })
}

function setPubed() {
  pubedLoading.value = true
  VideoAPI.getMyPubedVideo(timestamp, pubedCurPage.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      pubed.value = res.data
      listNum.value.pubedNum = pubed.value.total
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      pubedLoading.value = false
    })
}

function setIsPubing() {
  isPubingLoading.value = true
  VideoAPI.getMyIsPubingVideo(timestamp, isPubingCurPage.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      isPubing.value = res.data
      listNum.value.isPubingNum = isPubing.value.total
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      isPubingLoading.value = false
    })
}

function setNotPubed() {
  notPubedLoading.value = true
  VideoAPI.getMyNotPubedVideo(timestamp, notPubedCurPage.value)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      notPubed.value = res.data
      listNum.value.notPubedNum = notPubed.value.total
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      notPubedLoading.value = false
    })
}

function deleteItem(idx: number, kind: "del" | "cancel-modify") {
  const kindText = kind === 'del' ? '删除' : '取消修改'
  ElMessageBox.confirm(`你确认要${kindText}该视频吗？`, '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      let id: number = 0
      let typ: "video" | "video-is-pubing" | "video-not-pubed" = "video"

      switch (viewItem.value) {
        case "pubed": {
          id = pubed.value.list[idx].id
          typ = "video"
          break
        }
        case "isPubing": {
          id = isPubing.value.list[idx].id
          typ = "video-is-pubing"
          break
        }
        case "notPubed": {
          id = notPubed.value.list[idx].id
          typ = "video-not-pubed"
          break
        }
      }

      deleting.value.push(id)
      VideoAPI.deleteVideo(id, typ)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          // 移除记录
          switch (viewItem.value) {
            case "pubed": {
              pubed.value.list.splice(idx, 1)
              pubed.value.total--
              listNum.value.pubedNum--
              if (pubed.value.list.length === 0) {
                pubedCurPage.value-- // 删除了当前页的最后一条记录后需要跳转到上一页，以下同理
              }
              break
            }
            case "isPubing": {
              isPubing.value.list.splice(idx, 1)
              isPubing.value.total--
              listNum.value.isPubingNum--
              if (isPubing.value.list.length === 0) {
                isPubingCurPage.value--
              }
              break
            }
            case "notPubed": {
              notPubed.value.total--
              notPubed.value.list.splice(idx, 1)
              listNum.value.notPubedNum--
              if (notPubed.value.list.length === 0) {
                notPubedCurPage.value--
              }
              break
            }
          }
          cmjs.prompt.success(`${kindText}成功`)
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          const idx = deleting.value.indexOf(id)
          deleting.value.splice(idx, 1)
        })
    })
}

function appeal(idx: number) {
  let ups = ref<UploadPara[]>([])
  let timer: number

  store.openFSWindow({
    title: "申诉",
    tip: "每个视频只有一次申诉机会，且一旦提交申诉，该视频将不能再编辑。",
    placeholder: "请输入申诉理由",
    submitHandler: async (msg: string, fileList: UploadUserFile[], submitting: globalThis.Ref<boolean>, closeWindow: Function) => {
      submitting.value = true
      let errorOccur = false

      if (fileList.length !== ups.value.length) {
        clearTimeout(timer)
        ups.value = []
        timer = setTimeout(() => {
          ups.value = []
        }, 300000) // 上传url是有时限的，目前后端定的是5分钟，超时后需重新获取url

        // 循环获取上传所需参数
        for (let i = 0; i < fileList.length; i++) {
          if (errorOccur) {
            break
          }

          const f = fileList[i]
          await AuthAPI.getUploadUrl("attachment", cmjs.util.getFileSuffix(f.name))
            .then((res) => {
              if (res.code !== 0) {
                errorOccur = true
                cmjs.prompt.error(res.msg)
                return
              }

              const up: UploadPara = res.data
              ups.value.push(up)
            })
            .catch((err) => {
              errorOccur = true
              cmjs.prompt.error(err)
            })
        }

        if (errorOccur) {
          submitting.value = false
          return
        }
      }

      const imgs: string[] = []
      // 依次上传文件
      for (let i = 0; i < ups.value.length; i++) {
        if (errorOccur) {
          break
        }

        const up = ups.value[i]
        await UploadAPI.upload({
          uploadUrl: up.url,
          file: fileList[i].raw!,
          contentType: up.contentType,
          xOssCallback: up.xOssCallback,
          onUploadProgress: () => { },
        })
          .then((res) => {
            if (res.code !== 0) {
              errorOccur = true
              cmjs.prompt.error(res.msg)
              return
            }

            imgs.push(up.filename)
          })
          .catch((err) => {
            errorOccur = true
            cmjs.prompt.error(err)
          })

      }

      if (errorOccur) {
        submitting.value = false
        return
      }

      VideoAPI.appealVideo(notPubed.value.list[idx].id, msg, imgs)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          cmjs.prompt.success("提交成功！请留意系统消息")
          notPubed.value.list[idx].appealId = res.data.id
          closeWindow()
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          submitting.value = false
        })
    },
  })
}

async function getVideo(id: number) {
  getSuccess.value = false
  const typ = viewItem.value === 'pubed' ? 'video' : viewItem.value === 'isPubing' ? 'video-is-pubing' : 'video-not-pubed'

  await VideoAPI.getEditVideo(id, typ)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      getSuccess.value = true

      video.videoUrl = res.data.videoUrl
      video.videoName = res.data.videoName
      video.coverUrl = res.data.coverUrl
      video.coverName = res.data.coverName
      video.title = res.data.title
      video.region = res.data.region
      video.intro = res.data.intro
      video.tags = res.data.tags ? res.data.tags : []
      video.empower = res.data.empower
      video.autoPublish = res.data.autoPublish
      video.id = id
      video.typ = typ

      if (setVideoUrl) { // 第一次是在没打开窗口前，那时函数还不存在，只能先通过init-xxx-url设置
        setVideoUrl(video.videoUrl)
      }
      if (setCoverUrl) { // 同上
        setCoverUrl(video.coverUrl)
      }
      editEmpowerDisabled.value = !video.empower

      videoCopy.value = _.cloneDeep(video)
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
}

function publish(idx: number) {
  const id = pubed.value.list[idx].id

  ElMessageBox.confirm('你确认要发布该视频吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      pbing.value.push(id)
      VideoAPI.pbOrNopbVideo(id, true)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          pubed.value.list[idx].isPublish = true
          cmjs.prompt.success('发布成功')
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          const idx = pbing.value.indexOf(id)
          pbing.value.splice(idx, 1)
        })
    })
}

function cancelPublish(idx: number) {
  const id = pubed.value.list[idx].id

  ElMessageBox.confirm('你确认要下架该视频吗？下架后其他人将无法观看该视频，且正在观看的人将在数秒后被终止观看（视频页不会被关闭，但相关功能会被禁止）！注意：视频的相关数据<span style="color: red;">不会受到影响</span>。', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
    dangerouslyUseHTMLString: true,
  })
    .then(() => {
      pbing.value.push(id)
      VideoAPI.pbOrNopbVideo(id, false)
        .then((res) => {
          if (res.code !== 0) {
            cmjs.prompt.error(res.msg)
            return
          }

          pubed.value.list[idx].isPublish = false
          cmjs.prompt.success('已下架')
        })
        .catch((err) => {
          cmjs.prompt.error(err)
        })
        .finally(() => {
          const idx = pbing.value.indexOf(id)
          pbing.value.splice(idx, 1)
        })
    })
}

async function edit(idx: number) {
  getting.value.push(idx)

  if (store.videoRegions.length === 0) {
    await store.getVideoRegions()
  }

  switch (viewItem.value) {
    case "pubed": {
      await getVideo(pubed.value.list[idx].id)
      break
    }
    case "isPubing": {
      await getVideo(isPubing.value.list[idx].id)
      break
    }
    case "notPubed": {
      await getVideo(notPubed.value.list[idx].id)
      break
    }
    default: {
      cmjs.prompt.error("不能编辑不支持的类型")
    }
  }

  if (getSuccess.value) {
    editWindowVisible.value = true
  }
  const iidx = getting.value.indexOf(idx)
  getting.value.splice(iidx, 1)
}

function beforeEditWindowClose(done: Function) {
  if (hasEdit.value) {
    ElMessageBox.confirm(
      '你所做的更改可能未保存',
      '关闭窗口？',
      {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'warning',
        autofocus: false,
        showClose: false,
      }
    ).then(() => {
      store.switchAsk = false
      done()
    }).catch(() => { })
  } else {
    done()
  }
}

async function coverUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  let up: UploadPara = { url: "", filename: "", contentType: "", xOssCallback: "" }

  await AuthAPI.getUploadUrl("cover", cmjs.util.getFileSuffix(file.name))
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
        return
      }

      up = res.data
    })
    .catch((err) => {
      fail(err)
    })

  if (up === undefined) {
    return
  }

  coverUploading.value = true
  let fileBinStr = URL.createObjectURL(file)
  setCoverUrl(fileBinStr)

  UploadAPI.upload({
    uploadUrl: up.url,
    file: file,
    contentType: up.contentType,
    xOssCallback: up.xOssCallback,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      percent.value = Math.round((progressEvent.loaded / (progressEvent.total as number)) * 100)
    },
  })
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
      }

      video.coverName = up.filename
      succ()
    })
    .catch((err) => {
      fail(err)
    })
    .finally(() => {
      coverUploading.value = false
    })
}

async function videoUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  let up: UploadPara = { url: "", filename: "", contentType: "", xOssCallback: "" }

  await AuthAPI.getUploadUrl("video", cmjs.util.getFileSuffix(file.name))
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
        return
      }

      up = res.data
    })
    .catch((err) => {
      fail(err)
    })

  if (up === undefined) {
    return
  }

  videoUploading.value = true
  let fileBinStr = URL.createObjectURL(file)
  setVideoUrl(fileBinStr)

  UploadAPI.upload({
    uploadUrl: up.url,
    file: file,
    contentType: up.contentType,
    xOssCallback: up.xOssCallback,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      percent.value = Math.round((progressEvent.loaded / (progressEvent.total as number)) * 100)
    },
  })
    .then((res) => {
      if (res.code !== 0) {
        fail(res.msg)
      }

      video.videoName = up.filename
      succ()
    })
    .catch((err) => {
      fail(err)
    })
    .finally(() => {
      videoUploading.value = false
    })
}

function submit() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInputRef.value?.focus()
    return
  }

  submitting.value = true
  VideoAPI.uploadEditVideo(video)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      editWindowVisible.value = false
      store.switchAsk = false
      cmjs.prompt.success("修改成功")
      video.videoName = "" // 防止在跳转前的1秒内再次点击
      setTimeout(() => {
        timestamp = cmjs.util.getCurBETimestamp()
        if (viewItem.value !== "isPubing") {
          viewItem.value = "isPubing"
          cmjs.util.clearUrlQuery()
          cmjs.util.addUrlQuery("tab", "isPubing")
        }
        if (isPubingCurPage.value !== 1) {
          isPubingCurPage.value = 1 // isPubingCurPage值变更后自动会setIsPubing()
        } else {
          setIsPubing()
        }
      }, 1000) // 跳转过快会无法加载最新的数据（应该是后端数据库还没来得及）

    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      submitting.value = false
    })
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return cmjs.fmt.tsStandard(time)
}

function pubedCellClick(row: any, column: any) {
  if (column.label === "封面" || column.label === "标题") {
    cmjs.jump.video(row.vid)
  }
}

function pubedCellStyle(cell: any) {
  if (cell.columnIndex === 0 || cell.columnIndex === 1) {
    return { cursor: "pointer" }
  }

  return {}
}

function isPubingCellClick(row: any, column: any) {
  if (row.vid !== undefined && (column.label === "封面" || column.label === "标题")) {
    cmjs.jump.video(row.vid)
  }

}

function isPubingCellStyle(cell: any) {
  if (isPubing.value.list[cell.rowIndex].vid !== undefined && (cell.columnIndex === 0 || cell.columnIndex === 1)) {
    return { cursor: "pointer" }
  }

  return {}
}

function notPubedCellClick(row: any, column: any) {
  if (row.vid !== undefined && (column.label === "封面" || column.label === "标题")) {
    cmjs.jump.video(row.vid)
  }

}

function notPubedCellStyle(cell: any) {
  if (notPubed.value.list[cell.rowIndex].vid !== undefined && (cell.columnIndex === 0 || cell.columnIndex === 1)) {
    return { cursor: "pointer" }
  }
  return {}
}

function handleUrlQueryTab(): string {
  const tab = cmjs.util.getUrlQuery('tab')
  if (!tab) {
    setPubed()
    return "pubed"
  }

  switch (tab) {
    case 'pubed': {
      setPubed()
      return "pubed"
    }
    case 'isPubing': {
      setIsPubing()
      return "isPubing"
    }
    case 'notPubed': {
      setNotPubed()
      return "notPubed"
    }
    default: {
      cmjs.prompt.error('不存在的页面')
      cmjs.util.addUrlQuery('tab', 'pubed')
      setPubed()
      return "pubed"
    }
  }
}

function showAppealDetails(idx: number) {
  viewing.value.push(idx)
  VideoAPI.getAppealVideo(notPubed.value.list[idx].appealId!)
    .then((res) => {
      if (res.code !== 0) {
        cmjs.prompt.error(res.msg)
        return
      }

      res.data.imgs = res.data.imgs ? res.data.imgs : []
      appealVideoDetail.value = res.data
      appealDetailsWindowVisible.value = true
    })
    .catch((err) => {
      cmjs.prompt.error(err)
    })
    .finally(() => {
      const iidx = viewing.value.indexOf(idx)
      viewing.value.splice(iidx, 1)
    })
}
</script>

<style lang="less" scoped>
.v-container {
  cursor: default;

  .oper {
    display: flex;
    flex-direction: column;

    .el-button+.el-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .page-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .upload-form {
    .row:first-child {
      margin-top: 0 !important;
    }

    .row {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .notice {
        font-size: 14px;
        margin-right: 10px;
        min-width: 75px;
        text-align: right;

        .require {
          color: red;
        }
      }
    }
  }
}
</style>

<style>
.v-container .el-tabs__nav-wrap::after {
  display: none;
}

.v-container .el-tabs__active-bar {
  display: none;
}

.v-container .el-tabs__item {
  height: 100%;
}

.v-container .el-tabs__item:not(:last-child) {
  border-right: 1px solid #c8c9cc;
}

.v-container .el-tabs--top {
  margin-top: 10px;
}

.v-container .el-tabs__header {
  margin-bottom: 10px;
}

.v-container .el-table__expanded-cell {
  padding: 0;
}

.edit-dialog {
  height: 75%;
  max-height: 745.66px;
  /* dialog的header加上body的高度，假如屏幕很长再显示75%就会出现空白区域了 */
  overflow: auto;

  .el-dialog__header {
    padding: 20px !important;
    padding-bottom: 0 !important;
  }

  .el-dialog__body {
    padding: 20px !important;
  }
}

#appeal-reason {
  width: 100%;
  resize: none;
  border: 1px solid #dedfe0;
  border-radius: 5px;
  padding: 5px;
  height: 150px;
}

#appeal-reason:hover {
  border-color: #c8c9cc;
}

#check-notice {
  color: red;
  font-size: 12px;
  display: none;
}

.el-tabs__header .is-top {
  /* 同上，在预览时会出现在图片顶上 */
  z-index: 0;
}

.el-table__inner-wrapper::before {
  /* 同上，不知道哪跑出来的线 */
  display: none;
}

.pubed,
.not-pubed {
  .el-table__empty-block {
    border-bottom: 1px solid #ebeef5;
  }
}

.is-pubing {
  .el-table__empty-block {
    width: 100% !important;
  }

  /* 本来在table上加个border就行的，但是那个border会在预览封面时出现 */
  border: 1px solid #ebeef5;

  th:not(:last-child),
  td:not(:last-child) {
    border-right: 1px solid #ebeef5 !important;
  }
}

.appeal-detail-container .el-descriptions__cell.el-descriptions__label.is-bordered-label {
  width: 135px !important;
}
</style>