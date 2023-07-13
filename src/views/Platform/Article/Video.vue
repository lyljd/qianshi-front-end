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
                <el-button @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br>
                <el-button @click="deleteItem(scope.$index)" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.pubedNum > 10" class="page-container">
          <el-pagination :total="listNum.pubedNum" v-model:current-page="pubedCurPage" hide-on-single-page background
            layout="prev, pager, next" />
        </div>
      </el-tab-pane>


      <el-tab-pane :label="`进行中 ${listNum.isPubingNum}`" name="isPubing">
        <el-table @cell-click="isPubingCellClick" :cell-class-name="isPubingCellClassName" :cell-style="isPubingCellStyle"
          border :data="isPubing.list">
          <el-table-column label="修改后信息" :width="100" type="expand">
            <template #default="props"> <!--props下数据默认懒加载-->
              <div class="modify-info">
                <div>
                  视频：
                  <el-button @click="previewVideo(props.row.modifyInfo.videoUrl)">预览</el-button>
                </div>
                <div>
                  封面：
                  <el-image class="cover" :src="props.row.modifyInfo.coverUrl">
                    <template #error>
                      <div class="default">封面加载失败</div>
                    </template>
                  </el-image>
                </div>
                <div>标题：{{ props.row.modifyInfo.title }}</div>
                <div>分区：{{ convertRegionName(props.row.modifyInfo.region) }}</div>
                <div>标签：{{ props.row.modifyInfo.tags.join("；") }}</div>
                <div>简介：{{ props.row.modifyInfo.intro }}</div>
                <div v-show="props.row.modifyInfo.empower">权益声明：未经作者授权，禁止转载</div>
              </div>
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
                <el-button @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br v-if="isPubing.list[scope.$index].isNew">
                <el-button v-if="isPubing.list[scope.$index].isNew" @click="deleteItem(scope.$index)" size="small"
                  type="danger"><span class="iconfont el-icon-ashbin"></span>删除</el-button>
                <br v-if="!isPubing.list[scope.$index].isNew">
                <el-button v-if="!isPubing.list[scope.$index].isNew" @click="cancelModify(scope.$index)" size="small"
                  type="warning"><span class="iconfont el-icon-cancel"></span>取消修改</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.isPubingNum > 10" class="page-container">
          <el-pagination :total="listNum.isPubingNum" v-model:current-page="isPubingCurPage" hide-on-single-page
            background layout="prev, pager, next" />
        </div>
      </el-tab-pane>


      <el-tab-pane :label="`未通过 ${listNum.notPubedNum}`" name="notPubed">
        <el-table border :data="notPubed.list">
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
                <el-button @click="edit(scope.$index)" size="small"><span
                    class="iconfont el-icon-edit"></span>编辑</el-button>
                <br>
                <el-button @click="deleteItem(scope.$index)" size="small" type="danger"><span
                    class="iconfont el-icon-ashbin"></span>删除</el-button>
                <br>
                <el-button :class="{ appealBtnT: notPubed.list[scope.$index].appealStatus }"
                  @click="appealIdx = scope.$index; appeal()" size="small" type="info"><span
                    class="iconfont el-icon-appeal"></span>{{
                      notPubed.list[scope.$index].appealStatus ? "已申诉" : "申诉" }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="listNum.notPubedNum > 10" class="page-container">
          <el-pagination :total="listNum.notPubedNum" v-model:current-page="notPubedCurPage" hide-on-single-page
            background layout="prev, pager, next" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog v-model="previewVideoWindowVisible" :custom-class="'preview-video'" :before-close="beforePVWindowClose"
    destroy-on-close align-center>
    <video volume="0.5" controls :src="previewVideoUrl"></video>
  </el-dialog>

  <el-dialog width="75%" v-model="editWindowVisible" :custom-class="'edit-dialog'" :before-close="beforeEditWindowClose"
    title="视频编辑" align-center>
    <div class="setting">
      <div>
        <span class="notice"><span style="color: red;">*</span>视频：</span>
        <el-button :disabled="videoUploadPercent !== 0" @click="previewVideo(video.videoUrl)">预览</el-button>
        <el-button :disabled="videoUploadPercent !== 0" @click="openVideoUpload">上传</el-button>
      </div>
      <el-upload :before-upload="beforeVideoUpload" :on-remove="onVideoUploadRemove" :on-change="onVideoUploadChange"
        :on-progress="onVideoUploadProgress" :on-success="onVideoUploadSuccess" :on-error="onVideoUploadError"
        ref="videoUpload" action="/api/resource/video" accept="video/*" v-show="false"></el-upload>
      <el-progress v-show="videoUploadPercent !== 0" :percentage="videoUploadPercent" class="prg" :stroke-width="10" />
      <span class="tip">上传的视频大小上限为1G</span>
      <br>
      <span class="tip">上传视频，即表示您已同意 <span style="color: #409EFF;">浅时使用协议</span> ，请勿上传色情，反动等违法视频。</span>

      <div>
        <span class="notice"><span style="color: red;">*</span>封面：</span>
        <div v-show="video.coverUrl === ''" @click="openCoverUpload" class="upload-cover-div">
          <span style="font-size: 42px;">+</span>
          <span>上传封面</span>
        </div>

        <el-image v-show="video.coverUrl !== ''" :style="coverUploadPercent === 0 ? '' : 'opacity: 0.25;'"
          @click="openCoverUpload" class="cover" :src="video.coverUrl"></el-image>

        <el-progress v-show="coverUploadPercent !== 0" :percentage="coverUploadPercent" :width="118.125"
          style="position: absolute; margin-left: 130.9375px;" type="circle" />

        <el-upload :before-upload="beforeCoverUpload" :on-remove="onCoverUploadRemove" :on-change="onCoverUploadChange"
          :on-progress="onCoverUploadProgress" :on-success="onCoverUploadSuccess" :on-error="onCoverUploadError"
          ref="coverUpload" action="/api/resource/cover" accept="image/*" v-show="false"></el-upload>
      </div>
      <span class="tip">上传的图片大小上限为10M</span>
      <br>
      <span class="tip">推荐使用16:9的图片</span>

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
          <el-button class="new-tag-btn" v-else size="small" @click="showNewTagInput">
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
      <span class="tip">勾选后该文案会显示在视频播放页中，此选项可以在再次编辑时取消。<span style="color: #FF6699;">一旦取消勾选操作，不可再次勾选。</span></span>

      <div style="justify-content: center;">
        <el-button :disabled="!hasEdit || videoUploadPercent !== 0 || coverUploadPercent !== 0 || video.title === ''"
          @click="modifyVideo" type="primary" size="large">修改</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import mockListNum from "../../../mock/platform/article/video.json"
import mockPubed from "../../../mock/platform/article/video/pubed.json"
import mockIsPubing from "../../../mock/platform/article/video/is_pubing.json"
import mockNotPubed from "../../../mock/platform/article/video/not_pubed.json"
import * as common from "../../../common"
import { Search } from '@element-plus/icons-vue'
import { UploadInstance, ElMessageBox, ElSelect, ElInput } from 'element-plus'
import { useStore } from "../../../store"

type ListNum = {
  pubedNum: number,
  isPubingNum: number,
  notPubedNum: number
}

type Pubed = {
  num: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    vid: number
  }[]
}

type IsPubing = {
  num: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    applyTime: number,
    isNew: boolean,
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
  num: number,
  list: {
    id: number,
    coverUrl: string,
    title: string,
    applyTime: number,
    processTime: number,
    reason: string,
    appealStatus: boolean,
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

const coverUpload = ref<UploadInstance>()
const videoUpload = ref<UploadInstance>()
const newTagInput = ref<HTMLInputElement>()
const titleInput = ref<InstanceType<typeof ElInput>>()

let listNum: ListNum = reactive(getListNum())
let pubed: Pubed = reactive(getPubed())
let isPubing: IsPubing = reactive({
  num: 0,
  list: []
})
let notPubed: NotPubed = reactive({
  num: 0,
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
let preCoverId = ref(0)
let preVideoId = ref(0)
let preCoverUrl = ref("")
let preVideoUrl = ref("")
let coverUploadPercent = ref(0)
let videoUploadPercent = ref(0)
let newTagInputValue = ref("")
let newTagInputVisible = ref(false)
let previewVideoWindowVisible = ref(false)
let previewVideoUrl = ref("")
let editWindowVisible = ref(false)
let editEmpowerDisabled = ref(false)
let hasEdit = ref(false)
let pubedCurPage = ref(1)
let isPubingCurPage = ref(1)
let notPubedCurPage = ref(1)

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
  console.log(`现在访问的是【已通过】的第${newV}页`)
})
watch(isPubingCurPage, (newV) => {
  console.log(`现在访问的是【进行中】的第${newV}页`)
})
watch(notPubedCurPage, (newV) => {
  console.log(`现在访问的是【未通过】的第${newV}页`)
})

function tabChange() {
  switch (viewItem.value) {
    case "pubed": {
      pubed = reactive(getPubed())
      listNum.pubedNum = pubed.num
      break
    }
    case "isPubing": {
      isPubing = reactive(getIsPubing())
      listNum.isPubingNum = isPubing.num
      break
    }
    case "notPubed": {
      notPubed = reactive(getNotPubed())
      listNum.notPubedNum = notPubed.num
      break
    }
  }
}

function getListNum(): ListNum {
  return mockListNum
}

function getPubed(): Pubed {
  return mockPubed
}

function getIsPubing(): IsPubing {
  return mockIsPubing
}

function getNotPubed(): NotPubed {
  return mockNotPubed
}

function tableTimeFormatter(_: any, __: any, time: number) {
  return common.timestampFormatterStandard(time)
}

function search() {
  alert(`type: ${viewItem.value}\nsearchKey: ${searchKey.value}`)
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
      //TODO api request
      switch (viewItem.value) {
        case "pubed": {
          pubed.list.splice(idx, 1)
          pubed.num--
          listNum.pubedNum--
          break
        }
        case "isPubing": {
          isPubing.list.splice(idx, 1)
          isPubing.num--
          listNum.isPubingNum--
          break
        }
        case "notPubed": {
          notPubed.num--
          notPubed.list.splice(idx, 1)
          listNum.notPubedNum--
          break
        }
      }
      common.showSuccess('删除成功')
    })
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
      //TODO api request
      pubed.list.push({
        id: isPubing.list[idx].id,
        coverUrl: isPubing.list[idx].coverUrl,
        title: isPubing.list[idx].title,
        vid: isPubing.list[idx].vid as number
      })

      isPubing.list.splice(idx, 1)
      isPubing.num--
      listNum.isPubingNum--
      pubed.num++
      listNum.pubedNum++
      common.scrollToTopSmoothly()
      pubed = reactive(getPubed())
      viewItem.value = "pubed"
      common.showSuccess('取消修改成功')
    })
}

function appeal() {
  if (notPubed.list[appealIdx.value].appealStatus) {
    common.showInfo("你已申诉，请耐心等待！管理员会尽快处理的，请留意系统消息")
    return
  }

  store.openFSWindow('申诉', '#', '请输入申诉理由', '理由不能为空', "提交成功！管理员会尽快处理的，请留意系统消息", () => { notPubed.list[appealIdx.value].appealStatus = true })
}

function pubedCellClick(row: any, column: any) {
  if (column.label === "封面" || column.label === "标题") {
    common.ToVideo(row.vid)
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
    common.ToVideo(row.vid)
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

function getVideo(id: number): Video {
  //TODO 通过id和viewItem去请求后端获取数据
  console.log(id, viewItem.value)

  return {
    "videoUrl": "../../public/video/8.mp4",
    "coverUrl": "../../public/cover/8.jpeg",
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
  preCoverUrl.value = video.coverUrl
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

function previewVideo(url: string) {
  previewVideoUrl.value = url
  previewVideoWindowVisible.value = true
}

function beforePVWindowClose(done: Function) {
  previewVideoUrl.value = "" //不清除url会导致在video元素被销毁后仍然可以通过按键播放
  done()
}

function openCoverUpload() {
  if (coverUploadPercent.value !== 0) {
    common.showError("图片上传时禁止修改")
    return
  }
  coverUpload.value?.$el.querySelector('input').click()
}

function openVideoUpload() {
  videoUpload.value?.$el.querySelector('input').click()
}

function beforeVideoUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 / 1024 > 1) {
    common.showError("上传的视频大小不能超过1G")
    return false
  }
  return true
}

function beforeCoverUpload(rawFile: any) {
  if (rawFile.size / 1024 / 1024 > 10) {
    common.showError("上传的图片大小不能超过10M")
    return false
  }
  return true
}

function onVideoUploadRemove() {
  video.videoUrl = preVideoUrl.value
}

function onCoverUploadRemove() {
  video.coverUrl = preCoverUrl.value
}

function onVideoUploadChange(file: any) {
  if (file.uid !== preVideoId.value) {
    preVideoId.value = file.uid
    video.videoUrl = URL.createObjectURL(file.raw)
  }
}

function onCoverUploadChange(file: any) {
  if (file.uid !== preCoverId.value) {
    preCoverId.value = file.uid
    video.coverUrl = URL.createObjectURL(file.raw)
  }
}

function onVideoUploadProgress(event: any) {
  videoUploadPercent.value = Math.floor(event.percent)
}

function onCoverUploadProgress(event: any) {
  coverUploadPercent.value = Math.floor(event.percent)
}

function onVideoUploadSuccess() {
  preVideoUrl.value = video.videoUrl
  videoUploadPercent.value = 0
  common.showSuccess("视频上传成功")
}

function onCoverUploadSuccess() {
  preCoverUrl.value = video.coverUrl
  coverUploadPercent.value = 0
}

function onVideoUploadError() {
  video.videoUrl = preVideoUrl.value
  videoUploadPercent.value = 0
  common.showError("视频上传失败")
}

function onCoverUploadError() {
  video.coverUrl = preCoverUrl.value
  coverUploadPercent.value = 0
  common.showError("图片上传失败")
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
      common.showError("该标签已存在")
      newTagInput.value!.focus()
      return
    }
    video.tags.push(val)
  }
  newTagInputVisible.value = false
  newTagInputValue.value = ""
}

function modifyVideo() {
  video.title = video.title.trim()
  video.intro = video.intro.trim()

  if (video.title.length === 0) {
    common.showError("请输入标题")
    titleInput.value?.focus()
    return
  }

  //TODO 根据当前viewItem做不同的事：pubed：将记录转移并跳转到isPubing；isPubing：修改modifyInfo

  editWindowVisible.value = false
  store.switchAsk = false

  common.showSuccess("修改成功")
}

function convertRegionName(code: string): string {
  switch (code) {
    case "anime": {
      return "番剧"
    }
    case "game": {
      return "游戏"
    }
    case "music": {
      return "音乐"
    }
    case "tech": {
      return "科技"
    }
    case "other": {
      return "其它"
    }
  }
  return "未知"
}
</script>

<style scoped>
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

.v-container .modify-info {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.v-container .modify-info>div:not(:last-child) {
  margin-bottom: 10px;
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

.setting>div {
  display: flex;
  align-items: center;
}

.setting>div:not(:first-child) {
  margin-top: 10px;
}

.setting .tip {
  font-size: 12px;
  color: #909399;
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

.preview-video video {
  width: 100%;
  border-radius: 10px;
  vertical-align: top;
}

.preview-video .el-dialog__header {
  display: none;
}

.preview-video .el-dialog__body {
  padding: 0;
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
  overflow: scroll;
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