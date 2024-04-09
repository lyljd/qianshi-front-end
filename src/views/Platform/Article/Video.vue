<template>
  <div class="v-container">
    <el-tabs @tab-change="tabChange" v-model="viewItem">
      <div style="margin-bottom: 15px;">
        <el-input @keyup.enter.native="search" v-model="searchKey" show-word-limit :maxlength="50" :prefix-icon="Search"
          clearable placeholder="搜索视频" />
      </div>

      <el-tab-pane :label="`已通过 ${listNum.pubedNum}`" name="pubed">
        <el-table @cell-click="pubedCellClick" :cell-style="pubedCellStyle" border :data="pubed.list" class="pubed">
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
                <el-button v-blur v-if="!pubed.list[scope.$index].isPublish" @click="publish(scope.$index)" size="small"
                  type="success"><span class="iconfont el-icon-fabu"></span>发布</el-button>
                <el-button v-blur v-else @click="cancelPublish(scope.$index)" size="small" type="warning"><span
                    class="iconfont el-icon-xiajia"></span>下架</el-button>
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-blur @click="deleteItem(scope.$index)" size="small" type="danger"><span
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
        <el-table @cell-click="isPubingCellClick" :cell-style="isPubingCellStyle" :data="isPubing.list"
          class="is-pubing">
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
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-blur v-if="!isPubing.list[scope.$index].vid" @click="deleteItem(scope.$index)" size="small"
                  type="danger"><span class="iconfont el-icon-ashbin"></span>删除</el-button>
                <el-button v-blur v-if="isPubing.list[scope.$index].vid" @click="cancelModify(scope.$index)"
                  size="small" type="warning"><span class="iconfont el-icon-cancel"></span>取消修改</el-button>
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
          <span style="margin-top: 0; margin-bottom: 3px; color:red">在超过处理时间1天后，未通过的视频和封面资源将被删除。</span>
        </div>
        <el-table @cell-click="notPubedCellClick" :cell-style="notPubedCellStyle" border :data="notPubed.list"
          class="not-pubed">
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
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <el-button v-blur v-if="!notPubed.list[scope.$index].vid" @click="deleteItem(scope.$index)" size="small"
                  type="danger"><span class="iconfont el-icon-ashbin"></span>删除</el-button>
                <el-button v-blur v-if="notPubed.list[scope.$index].vid" @click="cancelModify(scope.$index)"
                  size="small" type="warning"><span class="iconfont el-icon-cancel"></span>取消修改</el-button>
                <el-button v-blur :class="{ appealBtnT: notPubed.list[scope.$index].appealStatus }"
                  @click="appealIdx = scope.$index; appeal()" size="small" type="info"><span
                    class="iconfont el-icon-appeal"></span>{{
      notPubed.list[scope.$index].appealStatus ? "已申诉" : "申诉" }}</el-button>
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

  <el-dialog width="75%" @open="store.regions.length === 0 ? store.getRegions() : null" v-model="editWindowVisible"
    class="edit-dialog" :before-close="beforeEditWindowClose" title="视频编辑" align-center>
    <div class="v-container">
      <div class="upload-form">
        <div class="row">
          <span class="notice"><span class="require">*</span>视频：</span>
          <VideoUpload style="width: 100%;" @setVideoUrl="(f: Function) => { setVideoUrl = f }"
            :initVideoUrl="video.videoUrl" :uploadHandler="videoUploadHandler">
          </VideoUpload>
        </div>

        <div class="row">
          <span class="notice"><span class="require">*</span>封面：</span>
          <ImageUpload @setImgUrl="(f: Function) => { setCoverUrl = f }" :initImgUrl="video.coverUrl" :w="270"
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
            <el-option v-for="r in store.regions" :label="r.name" :value="r.slug" />
          </el-select>
        </div>

        <div class="row">
          <span class="notice">标签：</span>
          <TagInput :tags="video.tags" :limit="10"></TagInput>
        </div>

        <div class="row">
          <span class="notice">简介：</span>
          <el-input v-model="video.intro" maxlength="250" rows="3" placeholder="请输入简介" type="textarea"
            show-word-limit />
        </div>

        <div class="row">
          <span class="notice">权益声明：</span>
          <div>
            <el-checkbox :disabled="editEmpowerDisabled" v-model="video.empower" label="未经作者授权，禁止转载" />
            <div class="tip">
              <span>勾选后该文案会显示在视频播放页中</span>
              <span style="color: #FF6699;">若在修改时取消勾选该项，后续在编辑时将不能恢复勾选。</span>
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
          <el-button v-blur :disabled="!hasEdit || videoUploading || coverUploading" @click="submit" type="primary"
            size="large">修改</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import mockNum from "@/mock/platform/article/num.json"
import mockPubed from "@/mock/platform/article/video/pubed.json"
import mockIsPubing from "@/mock/platform/article/video/is_pubing.json"
import mockNotPubed from "@/mock/platform/article/video/not_pubed.json"
import cmjs from '@/cmjs'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElSelect, ElInput } from 'element-plus'
import { useStore } from "@/store"
import ImageUpload from "@/components/common/ImageUpload.vue"
import VideoUpload from "@/components/common/VideoUpload.vue"
import TagInput from '@/components/common/TagInput.vue'

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
    appealStatus: boolean,
    vid?: number,
  }[]
}

type Video = {
  videoUrl: string,
  coverUrl: string,
  title: string,
  region: string,
  tags: string[],
  intro: string,
  empower: boolean,
  autoPublish?: boolean
}

const store = useStore()
store.setPlatformItemIndex(2, location.pathname)

const titleInputRef = ref<InstanceType<typeof ElInput>>()

let pubedCurPage = ref(1)
let isPubingCurPage = ref(1)
let notPubedCurPage = ref(1)

let listNum: Num = reactive(getNum())
let pubed: Pubed = reactive({
  total: 0,
  list: []
})
let isPubing: IsPubing = reactive({
  total: 0,
  list: []
})
let notPubed: NotPubed = reactive({
  total: 0,
  list: []
})
let viewItem = ref(handleUrlQueryTab())
let searchKey = ref("")
let appealIdx = ref(-1)

let video: Video = reactive({
  videoUrl: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: false
})
let videoCopy: Video = reactive({
  videoUrl: "",
  coverUrl: "",
  title: "",
  region: "",
  tags: [],
  intro: "",
  empower: false
})

let editWindowVisible = ref(false)
let editEmpowerDisabled = ref(false)
let hasEdit = ref(false)
let coverUploading = ref(false)
let videoUploading = ref(false)
let setCoverUrl: Function
let setVideoUrl: Function

watch(video, (newV) => {
  if (newV.videoUrl !== videoCopy.videoUrl || newV.coverUrl !== videoCopy.coverUrl || newV.title !== videoCopy.title || newV.region !== videoCopy.region || JSON.stringify(newV.tags) !== JSON.stringify(videoCopy.tags) || newV.intro !== videoCopy.intro || newV.empower !== videoCopy.empower) {
    hasEdit.value = true
    store.switchAsk = true
  } else {
    hasEdit.value = false
    store.switchAsk = false
  }
})
watch(pubedCurPage, (newV) => {
  pubed = reactive(getPubed())
})
watch(isPubingCurPage, (newV) => {
  isPubing = reactive(getIsPubing())
})
watch(notPubedCurPage, (newV) => {
  notPubed = reactive(getNotPubed())
})

function tabChange() {
  switch (viewItem.value) {
    case "pubed": {
      if (pubedCurPage.value === 1) {
        pubed = reactive(getPubed())
      } else {
        pubedCurPage.value = 1
      }
      cmjs.util.addUrlQuery('tab', 'pubed')
      break
    }
    case "isPubing": {
      if (isPubingCurPage.value === 1) {
        isPubing = reactive(getIsPubing())
      } else {
        isPubingCurPage.value = 1
      }
      cmjs.util.addUrlQuery('tab', 'isPubing')
      break
    }
    case "notPubed": {
      if (notPubedCurPage.value === 1) {
        notPubed = reactive(getNotPubed())
      } else {
        notPubedCurPage.value = 1
      }
      cmjs.util.addUrlQuery('tab', 'notPubed')
      break
    }
  }
}

function getNum(): Num {
  // TODO api
  return mockNum
}

function getPubed(): Pubed {
  // TODO api
  // listNum.pubedNum = pubed.total
  listNum.pubedNum = mockPubed.total
  console.log(`获取【视频-已通过】第${pubedCurPage.value}页数据`)
  return mockPubed
}

function getIsPubing(): IsPubing {
  // TODO api
  // listNum.isPubingNum = isPubing.total
  listNum.isPubingNum = mockIsPubing.total
  console.log(`获取【视频-进行中】第${isPubingCurPage.value}页数据`)
  return mockIsPubing
}

function getNotPubed(): NotPubed {
  // TODO api
  // listNum.notPubedNum = notPubed.total
  listNum.notPubedNum = mockNotPubed.total
  console.log(`获取【视频-未发布】第${notPubedCurPage.value}页数据`)
  return mockNotPubed
}

function search() {
  // TODO api
  cmjs.prompt.info(`type: ${viewItem.value}; searchKey: ${searchKey.value}`)
}

function deleteItem(idx: number) {
  ElMessageBox.confirm('你确认要删除该视频吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api
      switch (viewItem.value) {
        case "pubed": {
          pubed.list.splice(idx, 1)
          pubed.total--
          listNum.pubedNum--
          break
        }
        case "isPubing": {
          isPubing.list.splice(idx, 1)
          isPubing.total--
          listNum.isPubingNum--
          break
        }
        case "notPubed": {
          notPubed.total--
          notPubed.list.splice(idx, 1)
          listNum.notPubedNum--
          break
        }
      }
      cmjs.prompt.success('删除成功')
    })
}

function appeal() {
  if (notPubed.list[appealIdx.value].appealStatus) {
    cmjs.prompt.info("请耐心等待，并留意系统消息")
    return
  }

  store.openFSWindow({
    title: "申诉",
    placeholder: "请输入申诉理由",
    submitHandler: (msg: string, fileList: File[], closeWindow: Function) => {
      // TODO api
      console.log({
        "msg": msg,
        "fileList": fileList,
        "data": {
          id: notPubed.list[appealIdx.value].id,
        },
      })
      cmjs.prompt.success("提交成功！请留意系统消息")
      notPubed.list[appealIdx.value].appealStatus = true
      closeWindow()
    },
  })
}

function getVideo(id: number): Video {
  //TODO api（通过id和viewItem去请求后端获取数据）
  console.log(id, viewItem.value)

  const v: Video = {
    "videoUrl": "/resource/video/8.mp4",
    "coverUrl": "/resource/cover/8.jpeg",
    "title": "许嵩-雅俗共赏",
    "region": "music",
    "tags": [
      "许嵩",
      "vae",
      "青年晚报",
      "雅俗共赏",
      "音乐"
    ],
    "intro": "满纸荒唐中窥见满脸沧桑，触到神经就要懂得鼓掌。",
    "empower": true
  }
  if (viewItem.value !== "pubed") {
    v.autoPublish = false
  }

  return v
}

function setVideo(v: Video) {
  video.videoUrl = v.videoUrl
  video.coverUrl = v.coverUrl
  video.title = v.title
  video.region = v.region
  video.tags = v.tags
  video.intro = v.intro
  video.empower = v.empower
  video.autoPublish = v.autoPublish !== undefined ? v.autoPublish : true

  videoCopy.videoUrl = v.videoUrl
  videoCopy.coverUrl = v.coverUrl
  videoCopy.title = v.title
  videoCopy.region = v.region
  videoCopy.tags = [...v.tags] //深拷贝
  videoCopy.intro = v.intro
  videoCopy.empower = v.empower
  video.autoPublish = v.autoPublish !== undefined ? v.autoPublish : true

  editEmpowerDisabled.value = !video.empower
}

function publish(idx: number) {
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
      //TODO api

      pubed.list[idx].isPublish = true
      cmjs.prompt.success('发布成功')
    })
}

function cancelPublish(idx: number) {
  ElMessageBox.confirm('你确认要下架该视频吗？下架后其他人将无法观看该视频，且正在观看的人将立刻被终止观看！注意：视频的相关数据<span style="color: red;">不会受到影响</span>。', '确认提示', {
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
      //TODO api

      pubed.list[idx].isPublish = false
      cmjs.prompt.success('下架成功')
    })
}

function edit(idx: number) {
  switch (viewItem.value) {
    case "pubed": {
      setVideo(getVideo(pubed.list[idx].id))
      break
    }
    case "isPubing": {
      setVideo(getVideo(isPubing.list[idx].id))
      break
    }
    case "notPubed": {
      setVideo(getVideo(notPubed.list[idx].id))
      break
    }
  }

  editWindowVisible.value = true
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

function coverUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  coverUploading.value = true

  // TODO api

  const url = URL.createObjectURL(file)
  setCoverUrl(url)
  const timer = setInterval(() => {
    const randPercent = Math.floor(Math.random() * 26) + 25 // [25,50]，整数
    if (percent.value + randPercent < 100) {
      percent.value += randPercent
    } else {
      percent.value = 100
      clearInterval(timer)
      coverUploading.value = false
      video.coverUrl = url // fail时不能设置！！
      succ()
      // fail()
    }
  }, 1000)
}

function videoUploadHandler(file: File, percent: Ref<number>, succ: Function, fail: Function) {
  videoUploading.value = true

  // TODO api

  const url = URL.createObjectURL(file)
  setVideoUrl(url)
  const timer = setInterval(() => {
    const randPercent = Math.floor(Math.random() * 11) + 10 // [10,20]，整数
    if (percent.value + randPercent < 100) {
      percent.value += randPercent
    } else {
      percent.value = 100
      clearInterval(timer)
      videoUploading.value = false
      video.videoUrl = url // fail时不能设置！！
      succ()
      // fail()
    }
  }, 1000)
}

function submit() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInputRef.value?.focus()
    return
  }

  // TODO api
  // TODO 若在pubed页则需跳转到isPubing
  console.log(video)

  editWindowVisible.value = false
  store.switchAsk = false
  cmjs.prompt.success("修改成功")
}

function cancelModify(idx: number) {
  ElMessageBox.confirm('你确认要取消修改该视频吗？', '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning',
    autofocus: false,
  })
    .then(() => {
      //TODO api

      if (viewItem.value === "isPubing") {
        isPubing.list.splice(idx, 1)
        isPubing.total--
        listNum.isPubingNum--
      } else if (viewItem.value === "notPubed") {
        notPubed.list.splice(idx, 1)
        notPubed.total--
        listNum.notPubedNum--
      }

      cmjs.prompt.success('操作成功')
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
  if (isPubing.list[cell.rowIndex].vid !== undefined && (cell.columnIndex === 0 || cell.columnIndex === 1)) {
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
  if (notPubed.list[cell.rowIndex].vid !== undefined && (cell.columnIndex === 0 || cell.columnIndex === 1)) {
    return { cursor: "pointer" }
  }
  return {}
}

function handleUrlQueryTab(): string {
  const tab = cmjs.util.getUrlQuery('tab')
  if (!tab) {
    pubed = reactive(getPubed())
    return "pubed"
  }

  switch (tab) {
    case 'pubed': {
      pubed = reactive(getPubed())
      return "pubed"
    }
    case 'isPubing': {
      isPubing = reactive(getIsPubing())
      return "isPubing"
    }
    case 'notPubed': {
      notPubed = reactive(getNotPubed())
      return "notPubed"
    }
    default: {
      cmjs.prompt.error('不存在的页面')
      cmjs.util.addUrlQuery('tab', 'pubed')
      pubed = reactive(getPubed())
      return "pubed"
    }
  }
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

  .appealBtnT {
    cursor: not-allowed;
    background-color: #c8c9cc;
    border-color: #c8c9cc;
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
</style>