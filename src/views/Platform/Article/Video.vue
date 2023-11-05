<template>
  <div class="v-container">
    <el-tabs @tab-change="tabChange" v-model="viewItem">
      <div style="margin-bottom: 15px;">
        <el-input @keyup.enter.native="search" v-model="searchKey" show-word-limit :maxlength="50" :prefix-icon="Search"
          clearable placeholder="搜索视频" />
      </div>
      <el-tab-pane :label="`已通过 ${listNum.pubedNum}`" name="pubed">
        <el-table @cell-click="pubedCellClick" :cell-style="pubedCellStyle" border :data="pubed.list">
          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <el-image class="cover" :src="pubed.list[scope.$index].coverUrl">
                <template #error>
                  <div class="default">封面加载失败</div>
                </template>
              </el-image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div style="display: flex; flex-direction: column; ">
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br>
                <el-button v-blur @click="deleteItem(scope.$index)" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.pubedNum > 10" class="page-container">
          <el-pagination :total="listNum.pubedNum" v-model:current-page="pubedCurPage" :page-size="10" hide-on-single-page
            background layout="prev, pager, next" />
        </div>
      </el-tab-pane>


      <el-tab-pane :label="`进行中 ${listNum.isPubingNum}`" name="isPubing">
        <el-table @cell-click="isPubingCellClick" :cell-class-name="isPubingCellClassName" :cell-style="isPubingCellStyle"
          border :data="isPubing.list">
          <el-table-column label="修改后信息" :width="100" type="expand">
            <template #default="props"> <!--数据默认懒加载-->
              <VideoDescriptions :data="(props.row.modifyInfo)" title=""></VideoDescriptions>
            </template>
          </el-table-column>

          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <el-image class="cover" :src="isPubing.list[scope.$index].coverUrl">
                <template #error>
                  <div class="default">封面加载失败</div>
                </template>
              </el-image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="175" :formatter="tableTimeFormatter" prop="applyTime" label="申请时间" />

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div style="display: flex; flex-direction: column; ">
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br v-if="!isPubing.list[scope.$index].vid">
                <el-button v-blur v-if="!isPubing.list[scope.$index].vid" @click="deleteItem(scope.$index)" size="small"
                  type="danger"><span class="iconfont el-icon-ashbin"></span>删除</el-button>
                <br v-if="isPubing.list[scope.$index].vid">
                <el-button v-blur v-if="isPubing.list[scope.$index].vid" @click="cancelModify(scope.$index)" size="small"
                  type="warning"><span class="iconfont el-icon-cancel"></span>取消修改</el-button>
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
        <el-table @cell-click="notPubedCellClick" :cell-style="notPubedCellStyle" border :data="notPubed.list">
          <el-table-column align="center" :width="235" label="封面">
            <template #default="scope">
              <el-image class="cover" :src="notPubed.list[scope.$index].coverUrl">
                <template #error>
                  <div class="default">封面加载失败</div>
                </template>
              </el-image>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="title" label="标题" />

          <el-table-column align="center" :width="175" label="申请/处理时间">

            <template #default="scope">
              <div>{{ tableTimeFormatter(null, null, notPubed.list[scope.$index].applyTime) }}</div>
              <div>/</div>
              <div>{{ tableTimeFormatter(null, null, notPubed.list[scope.$index].processTime) }}</div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="reason" label="原因" />

          <el-table-column align="center" :width="89" label="操作">
            <template #default="scope">
              <div style="display: flex; flex-direction: column; ">
                <el-button v-blur @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br v-if="!notPubed.list[scope.$index].vid">
                <el-button v-blur v-if="!notPubed.list[scope.$index].vid" @click="deleteItem(scope.$index)" size="small"
                  type="danger"><span class="iconfont el-icon-ashbin"></span>删除</el-button>
                <br v-if="notPubed.list[scope.$index].vid">
                <el-button v-blur v-if="notPubed.list[scope.$index].vid" @click="cancelModify(scope.$index)" size="small"
                  type="warning"><span class="iconfont el-icon-cancel"></span>取消修改</el-button>
                <br>
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

  <el-dialog width="75%" v-model="editWindowVisible" :custom-class="'edit-dialog'" :before-close="beforeEditWindowClose"
    title="视频编辑" align-center>
    <div class="setting">
      <div>
        <span class="notice"><span style="color: red;">*</span>视频：</span>
        <el-button v-blur :disabled="videoUploadPercent !== 0" @click="store.openPVWindow(video.videoUrl)">预览</el-button>
        <el-button v-blur :disabled="videoUploadPercent !== 0" @click="openVideoUpload">上传</el-button>
      </div>
      <el-upload :before-upload="beforeVideoUpload" :on-remove="onVideoUploadRemove" :on-change="onVideoUploadChange"
        :on-progress="onVideoUploadProgress" :on-success="onVideoUploadSuccess" :on-error="onVideoUploadError"
        ref="videoUpload" action="/api/resource/video" accept="video/*" v-show="false"></el-upload>
      <el-progress v-show="videoUploadPercent !== 0" :percentage="videoUploadPercent" class="prg" :stroke-width="10" />
      <div class="tip">
        <span>上传的视频大小上限为1G</span>
        <span>上传视频，即表示您已同意 <Agreement></Agreement> ，请勿上传色情，反动等违法视频。</span>
      </div>

      <div>
        <span class="notice"><span style="color: red;">*</span>封面：</span>
        <ImageUpload @recImgUrl="recImgUrl" @recImgUploadPercent="recImgUploadPercent" uploadUrl="/api/resource/cover"
          :imgUrl="video.coverUrl">
        </ImageUpload>
      </div>

      <div>
        <span class="notice"><span style="color: red;">*</span>标题：</span>
        <el-input ref="titleInput" v-model="video.title" maxlength="50" placeholder="请输入标题" show-word-limit />
      </div>

      <div>
        <span class="notice"><span style="color: red;">*</span>分区：</span>
        <el-select ref="regionSelect" v-model="video.region" placeholder="请选择分区">
          <el-option label="番剧" value="anime" />
          <el-option label="游戏" value="game" />
          <el-option label="音乐" value="music" />
          <el-option label="科技" value="tech" />
          <el-option label="其它" value="other" />
        </el-select>
      </div>

      <div>
        <span class="notice">标签：</span>
        <div class="tag-container">
          <el-tag class="tag" v-for="tag in video.tags" closable @close="delTag(tag)">
            {{ tag }}
          </el-tag>
          <input v-if="newTagInputVisible" class="new-tag-input" ref="newTagInput" v-model="newTagInputValue"
            @keyup.enter="newTag" @blur="newTag">
          <el-button v-blur class="new-tag-btn" v-else size="small" @click="showNewTagInput">
            + New Tag
          </el-button>
        </div>
      </div>

      <div>
        <span class="notice">简介：</span>
        <el-input v-model="video.intro" maxlength="250" rows="3" placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧" type="textarea"
          show-word-limit />
      </div>

      <div>
        <span class="notice">权益声明：</span>
        <el-checkbox :disabled="editEmpowerDisabled" v-model="video.empower" label="未经作者授权，禁止转载" />
      </div>
      <div class="tip">
        <span>勾选后该文案会显示在视频播放页中，此选项可以在再次编辑时取消。<span style="color: #FF6699;">一旦取消勾选操作，不可再次勾选。</span></span>
      </div>

      <div style="justify-content: center;">
        <el-button v-blur
          :disabled="!hasEdit || videoUploadPercent !== 0 || coverUploadPercent !== 0 || video.title === ''"
          @click="modifyVideo" type="primary" size="large">修改</el-button>
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
import { UploadInstance, ElMessageBox, ElSelect, ElInput } from 'element-plus'
import { useStore } from "@/store"
import VideoDescriptions from "@/components/util/VideoDescriptions.vue"
import ImageUpload from "@/components/common/ImageUpload.vue"
import Agreement from '@/components/common/Agreement.vue'

type Num = {
  pubedNum: number,
  isPubingNum: number,
  notPubedNum: number
}

type Pubed = {
  total: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    vid: number
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
    modifyInfo?: {
      videoUrl?: string,
      coverUrl?: string,
      title?: string,
      region?: string,
      tags?: string[],
      intro?: string,
      empower?: boolean
    }
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
  empower: boolean
}

const store = useStore()
store.setPlatformItemIndex(2, location.pathname)

const videoUpload = ref<UploadInstance>()
const newTagInput = ref<HTMLInputElement>()
const titleInput = ref<InstanceType<typeof ElInput>>()

let pubedCurPage = ref(1)
let isPubingCurPage = ref(1)
let notPubedCurPage = ref(1)

let listNum: Num = reactive(getNum())
let pubed: Pubed = reactive(getPubed())
let isPubing: IsPubing = reactive({
  total: 0,
  list: []
})
let notPubed: NotPubed = reactive({
  total: 0,
  list: []
})
let viewItem = ref("pubed")
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
let preVideoId = ref(0)
let preVideoUrl = ref("")
let coverUploadPercent = ref(0)
let videoUploadPercent = ref(0)
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)
let editWindowVisible = ref(false)
let editEmpowerDisabled = ref(false)
let hasEdit = ref(false)

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
      break
    }
    case "isPubing": {
      if (isPubingCurPage.value === 1) {
        isPubing = reactive(getIsPubing())
      } else {
        isPubingCurPage.value = 1
      }
      break
    }
    case "notPubed": {
      if (notPubedCurPage.value === 1) {
        notPubed = reactive(getNotPubed())
      } else {
        notPubedCurPage.value = 1
      }
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
    cmjs.prompt.info("你已申诉，请耐心等待！管理员会尽快处理的，请留意系统消息")
    return
  }

  store.openFSWindow('申诉', '#', { id: notPubed.list[appealIdx.value].id }, '请输入申诉理由', '理由不能为空', "提交成功！管理员会尽快处理的，请留意系统消息", () => { notPubed.list[appealIdx.value].appealStatus = true })
}

function getVideo(id: number): Video {
  //TODO api（通过id和viewItem去请求后端获取数据）
  console.log(id, viewItem.value)

  return {
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
}

function setVideo(v: Video) {
  video.videoUrl = v.videoUrl
  video.coverUrl = v.coverUrl
  video.title = v.title
  video.region = v.region
  video.tags = v.tags
  video.intro = v.intro
  video.empower = v.empower

  videoCopy.videoUrl = v.videoUrl
  videoCopy.coverUrl = v.coverUrl
  videoCopy.title = v.title
  videoCopy.region = v.region
  videoCopy.tags = [...v.tags] //深拷贝
  videoCopy.intro = v.intro
  videoCopy.empower = v.empower

  preVideoUrl.value = video.videoUrl
  editEmpowerDisabled.value = !video.empower
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

function modifyVideo() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    cmjs.prompt.error("请输入标题")
    titleInput.value?.focus()
    return
  }

  // TODO api
  // TODO 若在pubed页则需删除该条数据并跳转到isPubing

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
        pubed.list.push({
          id: isPubing.list[idx].id,
          coverUrl: isPubing.list[idx].coverUrl,
          title: isPubing.list[idx].title,
          vid: isPubing.list[idx].vid as number
        })
        isPubing.list.splice(idx, 1)
        isPubing.total--
        listNum.isPubingNum--
      } else if (viewItem.value === "notPubed") {
        pubed.list.push({
          id: notPubed.list[idx].id,
          coverUrl: notPubed.list[idx].coverUrl,
          title: notPubed.list[idx].title,
          vid: notPubed.list[idx].vid as number
        })
        notPubed.list.splice(idx, 1)
        notPubed.total--
        listNum.notPubedNum--
      }

      pubed.total++
      listNum.pubedNum++
      viewItem.value = "pubed"
      cmjs.prompt.success('取消修改成功')
    })
}

function recImgUploadPercent(imgUploadPercent: number) {
  coverUploadPercent.value = imgUploadPercent
}

function recImgUrl(imgUrl: string) {
  video.coverUrl = imgUrl
}

function openVideoUpload() {
  videoUpload.value?.$el.querySelector('input').click()
}

function beforeVideoUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 / 1024 > 1) {
    cmjs.prompt.error("上传的视频大小不能超过1G")
    return false
  }
  return true
}

function onVideoUploadRemove() {
  video.videoUrl = preVideoUrl.value
}

function onVideoUploadChange(file: any) {
  if (file.uid !== preVideoId.value) {
    preVideoId.value = file.uid
    video.videoUrl = URL.createObjectURL(file.raw)
  }
}

function onVideoUploadProgress(event: any) {
  videoUploadPercent.value = Math.floor(event.percent)
}

function onVideoUploadSuccess() {
  preVideoUrl.value = video.videoUrl
  videoUploadPercent.value = 0
  cmjs.prompt.success("视频上传成功")
}

function onVideoUploadError() {
  video.videoUrl = preVideoUrl.value
  videoUploadPercent.value = 0
  cmjs.prompt.error("视频上传失败")
}

function delTag(tag: string) {
  video.tags.splice(video.tags.indexOf(tag), 1)
}

function showNewTagInput() {
  newTagInputVisible.value = true
  nextTick(() => {
    newTagInput.value!.focus()
  })
}

function newTag() {
  let val = newTagInputValue.value
  if (val) {
    if (video.tags.includes(val)) {
      cmjs.prompt.error("该标签已存在")
      newTagInput.value!.focus()
      return
    }
    video.tags.push(val)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
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
  if (isPubing.list[cell.rowIndex].vid !== undefined) {
    if (cell.columnIndex === 1 || cell.columnIndex === 2) {
      return { cursor: "pointer" }
    }
  } else if (cell.columnIndex === 0) {
    return { cursor: "not-allowed" }
  }
  return {}
}

function isPubingCellClassName(cell: any) {
  if (isPubing.list[cell.rowIndex].vid === undefined && cell.columnIndex === 0) {
    return "no-vid"
  }
  return ""
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
</script>

<style lang="less" scoped>
.v-container .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
}

.v-container .appealBtnT {
  cursor: not-allowed;
  background-color: #c8c9cc;
  border-color: #c8c9cc;
}

.v-container .page-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.setting {
  margin-top: -30px;
  margin-bottom: -10px;
}

.setting>div:not(.tip) {
  display: flex;
  align-items: center;
}

.setting>div:not(:first-child, .tip) {
  margin-top: 10px;
}

.tip {
  margin-left: 85px;
}

.setting .notice {
  font-size: 14px;
  margin-right: 10px;
  min-width: 75px;
  text-align: right;
}

.setting .upload-cover-div {
  width: 210px;
  height: 116.125px;
  /* 这里的高度必须比cover的高度少2px，因为上下的border还占了2px */
  border-radius: 5px;
  cursor: pointer;
  border: 1px dashed #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.setting .cover {
  width: 210px;
  height: 118.125px;
  border-radius: 5px;
  cursor: pointer;
}

.setting .tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.setting .tag,
.setting .new-tag-btn {
  min-width: 100px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
}

.setting .new-tag-input {
  width: 78px;
  height: 18px;
  font-size: 14px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #409EFF;
  padding: 5px 10px;
}

.setting .prg {
  margin-top: 0 !important;
  margin-left: 85px;
}
</style>

<style>
.setting .prg .el-progress__text {
  font-size: 14px !important;
  display: flex;
  justify-content: right;
  margin-left: -10px;
}

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

.v-container .el-image {
  vertical-align: top;
}

.v-container .no-vid .el-table__expand-icon {
  pointer-events: none;
}

.v-container .el-table__expanded-cell {
  padding: 0;
}

.edit-dialog {
  height: 75%;
  max-height: 597px;
  overflow: auto;
}

.edit-dialog .el-dialog__header {
  padding: 20px;
  margin: 0;
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
</style>