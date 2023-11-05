<template>
  <el-dialog v-model="mainWindowVisible" :title="mode === 1 ? '添加广告' : '修改广告'" width="75%" custom-class="aaw"
    :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" align-center destroy-on-close>

    <div class="body">
      <div>
        <span>页面：{{ pageLabel }}</span>
      </div>

      <div>
        <span>类型：</span>
        <el-radio-group v-model="data.type">
          <el-radio label="image">图片</el-radio>
          <el-radio label="text">文本</el-radio>
        </el-radio-group>
      </div>

      <div class="row">
        <span>内容：</span>
        <div class="content">
          <div v-if="data.type === 'image'">
            <ImageUpload @recImgUrl="recImgUrl" @recImgUploadPercent="recImgUploadPercent"
              uploadUrl="/api/resource/advertisement" :imgUrl="imageContent" :width="iup.width" :height="iup.height"
              :proportion="iup.proportion"></ImageUpload>
          </div>

          <div class="text-content" v-if="data.type === 'text'">
            <div class="text">
              <span>文本内容：</span>
              <el-input type="textarea" v-model="textContent.text" placeholder="行数过多会导致显示不全"
                style="width: calc(100% - 70px);" />
            </div>
            <div>
              <span>字体大小：</span>
              <el-input v-model.number="textContent.fontSize" placeholder="s∈[14, 99]" maxlength="2"
                style="width: calc(100% - 70px);" />
            </div>
            <div class="row">
              <span>字体颜色：</span>
              <ColorPicker v-model="textContent.fontColor"></ColorPicker>
            </div>
            <div class="row">
              <span>背景颜色：</span>
              <ColorPicker v-model="textContent.bgColor"></ColorPicker>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span>链接：</span>
        <el-input v-model="data.linkUrl" placeholder="可为空；支持但不推荐相对路径，绝对路径请加http(s)前缀" clearable
          style="width: calc(100% - 42px);" />
      </div>

      <div>
        <span>权重：</span>
        <el-input v-model.number="data.weight" placeholder="w∈[0, 100]；表示该条广告有w%的几率出现" maxlength="3"
          style="width: calc(100% - 42px);" />
      </div>
    </div>

    <template #footer>
      <el-button :disabled="imgUploadPercent !== 0" v-blur @click="closeMainWindow">取消</el-button>
      <el-button :disabled="imgUploadPercent !== 0" v-blur @click="confirm" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import cmjs from '@/cmjs'
import ImageUpload from "@/components/common/ImageUpload.vue"
import ColorPicker from "@/components/common/ColorPicker.vue"
import Advertisement from '../common/Advertisement.vue';
import { ElMessageBox } from 'element-plus'

type Advertisement = {
  type: string,
  content: string | Text,
  linkUrl: string,
  weight: number,
  createdAt: number,
  updatedAt: number,
}

type Text = {
  text: string,
  fontSize: number,
  fontColor: string,
  bgColor: string,
}

type ImgUploadPara = {
  width: number,
  height: number,
  proportion: string,
}

const stf = defineEmits<{
  (cen: "open", f: Function): void
}>()
stf('open', openMainWindow)

let mainWindowVisible = ref(false)
let data = ref<Advertisement>({
  type: "image",
  content: "",
  linkUrl: "",
  weight: "" as unknown as number,
  createdAt: 0,
  updatedAt: 0,
})
let dataCopy = ref<Advertisement>({
  type: "image",
  content: "",
  linkUrl: "",
  weight: "" as unknown as number,
  createdAt: 0,
  updatedAt: 0,
})
let page = ref("")
let mode = ref(1) // 1:添加广告；2:修改广告
let imageContent = ref("")
let textContent = ref<Text>({
  text: "",
  fontSize: 18,
  fontColor: "#FFFFFF",
  bgColor: "#909399"
})
let callback: Function
let pageLabel: string
let iup: ImgUploadPara
let imgUploadPercent = ref(0)
let dataChange = ref(false)
let icChange = ref(false)
let tcChange = ref(false)

function openMainWindow(cb: Function, p: string, a: Advertisement) {
  callback = cb
  page.value = p
  if (a) {
    data.value = copyAdv(a)
    dataCopy.value = copyAdv(a)
    mode.value = 2
    initContent()
  }
  listenChange()
  initPage()
  mainWindowVisible.value = true
}

function copyAdv(d: Advertisement): Advertisement {
  return {
    type: d.type,
    content: d.content,
    linkUrl: d.linkUrl,
    weight: d.weight,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }
}

function copyText(t: Text): Text {
  return {
    text: t.text,
    fontSize: t.fontSize,
    fontColor: t.fontColor,
    bgColor: t.bgColor,
  }
}

function initContent() {
  switch (data.value.type) {
    case "image": {
      imageContent.value = data.value.content as string
      return
    }
    case "text": {
      textContent.value = copyText(data.value.content as Text)
      return
    }
  }
}

function listenChange() {
  watch(data, newVal => {
    if (newVal.type !== dataCopy.value.type || newVal.weight !== dataCopy.value.weight || newVal.linkUrl !== dataCopy.value.linkUrl) {
      dataChange.value = true
    } else {
      dataChange.value = false
    }
  }, {
    deep: true,
  })

  watch(imageContent, newVal => {
    if (newVal !== dataCopy.value.content) {
      icChange.value = true
    } else {
      icChange.value = false
    }
  }, {
    deep: true,
  })

  watch(textContent, newVal => {
    const dcc = dataCopy.value.content as Text
    if (newVal.text !== dcc.text || newVal.fontSize !== dcc.fontSize || newVal.fontColor !== dcc.fontColor || newVal.bgColor !== dcc.bgColor) {
      tcChange.value = true
    } else {
      tcChange.value = false
    }
  }, {
    deep: true,
  })
}

function initPage() {
  switch (page.value) {
    case "index": {
      pageLabel = "首页"
      iup = { width: 855, height: 75, proportion: "1140*100" }
      return
    }
    case "video": {
      pageLabel = "视频页"
      iup = { width: 270, height: 151.88, proportion: "16:9" }
      return
    }
  }

  pageLabel = "未知"
  iup = { width: 0, height: 0, proportion: "0*0" }
}

function closeMainWindow() {
  if (dataChange.value || icChange.value || tcChange.value) {
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
      resetVar()
      mainWindowVisible.value = false
    }).catch(() => { })
  } else {
    resetVar()
    mainWindowVisible.value = false
  }
}

function resetVar() {
  data = ref<Advertisement>({
    type: "image",
    content: "",
    linkUrl: "",
    weight: "" as unknown as number,
    createdAt: 0,
    updatedAt: 0,
  })
  imageContent = ref("")
  textContent = ref<Text>({
    text: "",
    fontSize: 18,
    fontColor: "#FFFFFF",
    bgColor: "#909399"
  })
  dataChange.value = false
  icChange.value = false
  tcChange.value = false
}

function confirm() {
  const errMsg = confrimCheck()
  if (errMsg !== "") {
    cmjs.prompt.error(errMsg)
    return
  }

  switch (data.value.type) {
    case "text": {
      data.value.content = textContent.value
      break
    }
    case "image": {
      data.value.content = imageContent.value
      break
    }
  }

  callback(dataChange.value || icChange.value || tcChange.value ? data.value : null)
  dataChange.value = false
  icChange.value = false
  tcChange.value = false
  closeMainWindow()
  cmjs.prompt.success(`${mode.value === 1 ? '添加' : '修改'}成功`)
}

function confrimCheck(): string {
  switch (data.value.type) {
    case "text": {
      textContent.value.text = textContent.value.text.trim()
      if (textContent.value.text === "") {
        return "文本内容为空"
      }
      if (typeof textContent.value.fontSize !== "number") {
        if (textContent.value.fontSize === "") {
          return "字体大小为空"
        }
        return "字体大小输入有误"
      }
      if (textContent.value.fontSize < 14 || textContent.value.fontSize > 100) {
        return "字体大小值范围应在14～99内(含)"
      }
      break
    }
    case "image": {
      if (imageContent.value === "") {
        return "图片内容为空"
      }
      break
    }
  }

  if (typeof data.value.weight !== "number") {
    if (data.value.weight === "") {
      return "权重为空"
    }
    return "权重输入有误"
  }
  if (data.value.weight < 0 || data.value.weight > 100) {
    return "权重值范围应在0～100内(含)"
  }

  return ""
}

function recImgUrl(imgUrl: string) {
  imageContent.value = imgUrl
}

function recImgUploadPercent(iup: number) {
  imgUploadPercent.value = iup
}
</script>

<style lang="less" scoped>
.aaw .body>*:not(:last-child),
.aaw .body .text-content>*:not(:last-child) {
  margin-bottom: 10px;
}

.aaw .body .text-content .text {
  display: flex;
  align-items: center;
}

.aaw .content {
  margin-left: 10px;
  width: calc(100% - 52px);
}

.aaw .row {
  display: flex;
  align-items: center;
}
</style>

<style>
.aaw .el-dialog__header,
.aaw .el-dialog__footer {
  padding: 20px;
  margin: 0;
}

.aaw .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>